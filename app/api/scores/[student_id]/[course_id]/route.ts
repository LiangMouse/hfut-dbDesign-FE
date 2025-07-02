import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'
import { ResultSetHeader } from 'mysql2'

// 修改成绩
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ student_id: string; course_id: string }> }
) {
  try {
    const { student_id, course_id } = await params
    const body = await request.json()
    const { score } = body
    
    // 验证成绩范围
    if (score < 0 || score > 100) {
      return NextResponse.json({ error: '成绩必须在0-100之间' }, { status: 400 })
    }
    
    const query = `
      UPDATE score 
      SET score = ?
      WHERE student_id = ? AND course_id = ?
    `
    
    const [result] = await pool.execute<ResultSetHeader>(
      query,
      [score, student_id, course_id]
    )
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: '成绩记录不存在' }, { status: 404 })
    }
    
    return NextResponse.json({ message: '成绩修改成功' })
  } catch (error) {
    console.error('修改成绩失败:', error)
    return NextResponse.json({ error: '修改成绩失败' }, { status: 500 })
  }
}

// 删除成绩
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ student_id: string; course_id: string }> }
) {
  try {
    const { student_id, course_id } = await params
    
    const query = 'DELETE FROM score WHERE student_id = ? AND course_id = ?'
    const [result] = await pool.execute<ResultSetHeader>(query, [student_id, course_id])
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: '成绩记录不存在' }, { status: 404 })
    }
    
    return NextResponse.json({ message: '成绩删除成功' }, { status: 204 })
  } catch (error) {
    console.error('删除成绩失败:', error)
    return NextResponse.json({ error: '删除成绩失败' }, { status: 500 })
  }
}
