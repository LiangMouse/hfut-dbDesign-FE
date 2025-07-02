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

// 获取单个学生详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params
    
    const query = `
      SELECT s.student_id, s.name, s.gender, s.birth_date, s.class_id, s.admission_year,
             c.class_name, m.major_name, d.dept_name
      FROM student s
      LEFT JOIN class c ON s.class_id = c.class_id
      LEFT JOIN major m ON c.major_id = m.major_id
      LEFT JOIN department d ON m.dept_id = d.dept_id
      WHERE s.student_id = ?
    `
    
    const [rows] = await pool.execute<Student[]>(query, [studentId])
    
    if (rows.length === 0) {
      return NextResponse.json({ error: '学生不存在' }, { status: 404 })
    }
    
    return NextResponse.json({ student: rows[0] })
  } catch (error) {
    console.error('获取学生详情失败:', error)
    return NextResponse.json({ error: '获取学生详情失败' }, { status: 500 })
  }
}

// 修改学生信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params
    const body = await request.json()
    const { name, gender, birth_date, class_id, admission_year } = body
    
    // 性别验证规则
    if (gender !== '男' && gender !== '女') {
      return NextResponse.json({ error: '性别只能输入"男"或"女"' }, { status: 400 })
    }
    
    const query = `
      UPDATE student 
      SET name = ?, gender = ?, birth_date = ?, class_id = ?, admission_year = ?
      WHERE student_id = ?
    `
    
    const [result] = await pool.execute<ResultSetHeader>(
      query,
      [name, gender, birth_date, class_id, admission_year, studentId]
    )
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: '学生不存在' }, { status: 404 })
    }
    
    return NextResponse.json({ message: '学生信息修改成功' })
  } catch (error) {
    console.error('修改学生信息失败:', error)
    return NextResponse.json({ error: '修改学生信息失败' }, { status: 500 })
  }
}

// 删除学生
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params
    
    // 先删除相关的外键记录
    await pool.execute('DELETE FROM reward_punishment WHERE student_id = ?', [studentId])
    await pool.execute('DELETE FROM score WHERE student_id = ?', [studentId])
    
    const query = 'DELETE FROM student WHERE student_id = ?'
    const [result] = await pool.execute<ResultSetHeader>(query, [studentId])
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: '学生不存在' }, { status: 404 })
    }
    
    return NextResponse.json({ message: '学生删除成功' })
  } catch (error) {
    console.error('删除学生失败:', error)
    return NextResponse.json({ error: '删除学生失败' }, { status: 500 })
  }
}
