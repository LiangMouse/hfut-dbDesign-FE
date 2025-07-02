import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'
import { RowDataPacket } from 'mysql2'

interface StudentSummary extends RowDataPacket {
  student_id: string
  name: string
  class_name: string
  major_name: string
  dept_name: string
}

// 查询学生的学号、姓名、班级、专业、院系（符合课设要求6：创建视图）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params
    
    // 首先尝试使用视图
    try {
      const [rows] = await pool.execute<StudentSummary[]>(
        'SELECT * FROM student_summary_view WHERE student_id = ?',
        [studentId]
      )
      
      if (rows.length === 0) {
        return NextResponse.json({ error: '学生不存在' }, { status: 404 })
      }
      
      return NextResponse.json({ summary: rows[0] })
    } catch (viewError) {
      console.log('视图不存在，使用JOIN查询')
      
      // 如果视图不存在，使用JOIN查询
      const query = `
        SELECT s.student_id, s.name, c.class_name, m.major_name, d.dept_name
        FROM student s
        LEFT JOIN class c ON s.class_id = c.class_id
        LEFT JOIN major m ON c.major_id = m.major_id
        LEFT JOIN department d ON m.dept_id = d.dept_id
        WHERE s.student_id = ?
      `
      
      const [rows] = await pool.execute<StudentSummary[]>(query, [studentId])
      
      if (rows.length === 0) {
        return NextResponse.json({ error: '学生不存在' }, { status: 404 })
      }
      
      return NextResponse.json({ summary: rows[0] })
    }
    
  } catch (error) {
    console.error('查询学生摘要失败:', error)
    return NextResponse.json({ error: '查询学生摘要失败' }, { status: 500 })
  }
}
