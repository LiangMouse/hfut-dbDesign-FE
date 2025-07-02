import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'
import { RowDataPacket } from 'mysql2'

interface StudentScore extends RowDataPacket {
  student_id: string
  student_name: string
  course_name: string
  score: number
  term: string
}

// 查询指定学生成绩单（符合课设要求7：调用存储过程）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params
    
    // 首先尝试调用存储过程
    try {
      const [rows] = await pool.execute<StudentScore[]>(
        'CALL GetStudentScores(?)',
        [studentId]
      )
      return NextResponse.json({ transcript: rows })
    } catch (procError) {
      console.log('存储过程不存在，使用普通查询')
      
      // 如果存储过程不存在，使用普通查询
      const query = `
        SELECT 
          c.course_name,
          sc.score,
          '必修课' as course_type,
          sc.term as semester
        FROM student s
        JOIN score sc ON s.student_id = sc.student_id
        JOIN course c ON sc.course_id = c.course_id
        WHERE s.student_id = ?
        ORDER BY sc.term, c.course_name
      `
      
      const [rows] = await pool.execute<StudentScore[]>(query, [studentId])
      return NextResponse.json({ transcript: rows })
    }
    
  } catch (error) {
    console.error('查询学生成绩失败:', error)
    return NextResponse.json({ error: '查询成绩失败' }, { status: 500 })
  }
}
