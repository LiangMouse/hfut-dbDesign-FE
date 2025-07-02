import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

interface RewardPunishment extends RowDataPacket {
  rp_id: number
  student_id: string
  student_name: string
  type: string
  reason: string
  date: string
}

// 获取奖惩记录列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('student_id')
    const type = searchParams.get('type')
    
    let query = `
      SELECT rp.rp_id, rp.student_id, s.name as student_name, rp.type, rp.reason, rp.date
      FROM reward_punishment rp
      JOIN student s ON rp.student_id = s.student_id
    `
    
    const params: any[] = []
    const conditions: string[] = []
    
    if (studentId) {
      conditions.push('rp.student_id = ?')
      params.push(studentId)
    }
    
    if (type) {
      conditions.push('rp.type = ?')
      params.push(type)
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    
    query += ' ORDER BY rp.date DESC'
    
    const [rows] = await pool.execute<RewardPunishment[]>(query, params)
    
    return NextResponse.json({ rewards_punishments: rows })
  } catch (error) {
    console.error('获取奖惩记录失败:', error)
    return NextResponse.json({ error: '获取奖惩记录失败' }, { status: 500 })
  }
}

// 添加奖惩记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { student_id, type, reason, date } = body
    
    // 验证类型
    if (type !== '奖励' && type !== '惩罚') {
      return NextResponse.json({ error: '类型只能是"奖励"或"惩罚"' }, { status: 400 })
    }
    
    const query = `
      INSERT INTO reward_punishment (student_id, type, reason, date)
      VALUES (?, ?, ?, ?)
    `
    
    const [result] = await pool.execute<ResultSetHeader>(
      query,
      [student_id, type, reason, date]
    )
    
    return NextResponse.json({ 
      message: '奖惩记录添加成功',
      rp_id: result.insertId
    }, { status: 201 })
  } catch (error: any) {
    console.error('添加奖惩记录失败:', error)
    
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return NextResponse.json({ error: '学生不存在' }, { status: 400 })
    }
    
    return NextResponse.json({ error: '添加奖惩记录失败' }, { status: 500 })
  }
}

// 删除奖惩记录
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rpId = searchParams.get('rp_id')
    
    if (!rpId) {
      return NextResponse.json({ error: '缺少奖惩记录ID' }, { status: 400 })
    }
    
    const query = 'DELETE FROM reward_punishment WHERE rp_id = ?'
    const [result] = await pool.execute<ResultSetHeader>(query, [rpId])
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: '奖惩记录不存在' }, { status: 404 })
    }
    
    return NextResponse.json({ message: '奖惩记录删除成功' })
  } catch (error) {
    console.error('删除奖惩记录失败:', error)
    return NextResponse.json({ error: '删除奖惩记录失败' }, { status: 500 })
  }
}
