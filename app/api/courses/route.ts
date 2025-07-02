import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

interface Course extends RowDataPacket {
  course_id: number
  course_name: string
  credits: number
  course_type: string
}

// 获取所有课程信息
export async function GET(request: NextRequest) {
  try {
    const query = `SELECT * FROM course ORDER BY course_id`
    const [rows] = await pool.execute<Course[]>(query)
    
    return NextResponse.json({ 
      courses: rows
    })
  } catch (error) {
    console.error('获取课程信息失败:', error)
    return NextResponse.json({ error: '获取课程信息失败' }, { status: 500 })
  }
}

// 添加新课程
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { course_name, credits, course_type } = body
    
    const query = `
      INSERT INTO course (course_name, credits, course_type)
      VALUES (?, ?, ?)
    `
    
    const [result] = await pool.execute<ResultSetHeader>(
      query,
      [course_name, credits, course_type]
    )
    
    return NextResponse.json({ 
      message: '课程添加成功',
      course_id: result.insertId
    }, { status: 201 })
  } catch (error: any) {
    console.error('添加课程失败:', error)
    return NextResponse.json({ error: '添加课程失败' }, { status: 500 })
  }
}
