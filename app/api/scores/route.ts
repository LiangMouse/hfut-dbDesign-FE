import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

interface Score extends RowDataPacket {
  student_id: string
  course_id: number
  score: number
  term: string
}

interface ScoreWithDetails extends RowDataPacket {
  student_id: string
  student_name: string
  course_id: number
  course_name: string
  score: number
  term: string
}

// 获取成绩列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('student_id')
    
    let query = `
      SELECT sc.student_id, s.name as student_name, sc.course_id, c.course_name, sc.score, sc.term
      FROM score sc
      JOIN student s ON sc.student_id = s.student_id
      JOIN course c ON sc.course_id = c.course_id
    `
    
    const params: any[] = []
    
    if (studentId) {
      query += ' WHERE sc.student_id = ?'
      params.push(studentId)
    }
    
    query += ' ORDER BY sc.student_id, sc.course_id'
    
    const [rows] = await pool.execute<ScoreWithDetails[]>(query, params)
    
    return NextResponse.json({ scores: rows })
  } catch (error) {
    console.error('获取成绩列表失败:', error)
    return NextResponse.json({ error: '获取成绩列表失败' }, { status: 500 })
  }
}

// 添加成绩
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { student_id, course_id, score, term } = body
    
    // 验证成绩范围
    if (score < 0 || score > 100) {
      return NextResponse.json({ error: '成绩必须在0-100之间' }, { status: 400 })
    }
    
    const query = `
      INSERT INTO score (student_id, course_id, score, term)
      VALUES (?, ?, ?, ?)
    `
    
    const [result] = await pool.execute<ResultSetHeader>(
      query,
      [student_id, course_id, score, term]
    )
    
    return NextResponse.json({ 
      message: '成绩添加成功',
      id: result.insertId
    }, { status: 201 })
  } catch (error: any) {
    console.error('添加成绩失败:', error)
    
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: '该学生该课程成绩已存在' }, { status: 400 })
    }
    
    return NextResponse.json({ error: '添加成绩失败' }, { status: 500 })
  }
}
