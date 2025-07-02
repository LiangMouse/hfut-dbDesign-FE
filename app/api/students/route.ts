import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

interface Student extends RowDataPacket {
  student_id: string
  name: string
  gender: string
  birth_date: string
  class_id: number
  admission_year: number
}

interface StudentView extends RowDataPacket {
  student_id: string
  name: string
  class_name: string
  major_name: string
  dept_name: string
}

// 获取所有学生信息（包含视图查询功能）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('name')
    const classId = searchParams.get('class_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    
    // 创建视图查询（符合课设要求6）
    let query = `
      SELECT s.student_id, s.name, s.gender, s.birth_date, s.class_id, s.admission_year,
             c.class_name, m.major_name, d.dept_name
      FROM student s
      LEFT JOIN class c ON s.class_id = c.class_id
      LEFT JOIN major m ON c.major_id = m.major_id
      LEFT JOIN department d ON m.dept_id = d.dept_id
    `
    
    const params: any[] = []
    const conditions: string[] = []
    
    if (search) {
      conditions.push('s.name LIKE ?')
      params.push(`%${search}%`)
    }
    
    if (classId) {
      conditions.push('s.class_id = ?')
      params.push(parseInt(classId))
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    
    query += ` ORDER BY s.student_id LIMIT ${limit} OFFSET ${offset}`
    
    const [rows] = await pool.execute<StudentView[]>(query, params)
    
    return NextResponse.json({ 
      students: rows,
      page,
      limit
    })
  } catch (error) {
    console.error('获取学生信息失败:', error)
    return NextResponse.json({ error: '获取学生信息失败' }, { status: 500 })
  }
}

// 添加新学生
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { student_id, name, gender, birth_date, class_id, admission_year } = body
    
    // 性别验证规则（符合课设要求5）
    if (gender !== '男' && gender !== '女') {
      return NextResponse.json({ error: '性别只能输入"男"或"女"' }, { status: 400 })
    }
    
    const query = `
      INSERT INTO student (student_id, name, gender, birth_date, class_id, admission_year)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    
    const [result] = await pool.execute<ResultSetHeader>(
      query,
      [student_id, name, gender, birth_date, class_id, admission_year]
    )
    
    return NextResponse.json({ 
      message: '学生添加成功',
      student_id: student_id
    }, { status: 201 })
  } catch (error: any) {
    console.error('添加学生失败:', error)
    
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: '学号已存在' }, { status: 400 })
    }
    
    return NextResponse.json({ error: '添加学生失败' }, { status: 500 })
  }
}
