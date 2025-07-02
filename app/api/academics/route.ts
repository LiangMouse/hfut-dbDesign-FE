import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'
import { RowDataPacket } from 'mysql2'

interface Class extends RowDataPacket {
  class_id: number
  class_name: string
  major_id: number
  major_name: string
  dept_name: string
  student_count: number
}

interface Major extends RowDataPacket {
  major_id: number
  major_name: string
  dept_id: number
  dept_name: string
}

interface Department extends RowDataPacket {
  dept_id: number
  dept_name: string
}

// 获取班级信息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'classes'
    
    if (type === 'classes') {
      const query = `
        SELECT c.class_id, c.class_name, c.major_id, m.major_name, d.dept_name, c.student_count
        FROM class c
        LEFT JOIN major m ON c.major_id = m.major_id
        LEFT JOIN department d ON m.dept_id = d.dept_id
        ORDER BY c.class_id
      `
      
      const [rows] = await pool.execute<Class[]>(query)
      return NextResponse.json({ classes: rows })
      
    } else if (type === 'majors') {
      const query = `
        SELECT m.major_id, m.major_name, m.dept_id, d.dept_name
        FROM major m
        LEFT JOIN department d ON m.dept_id = d.dept_id
        ORDER BY m.major_id
      `
      
      const [rows] = await pool.execute<Major[]>(query)
      return NextResponse.json({ majors: rows })
      
    } else if (type === 'departments') {
      const query = 'SELECT * FROM department ORDER BY dept_id'
      const [rows] = await pool.execute<Department[]>(query)
      return NextResponse.json({ departments: rows })
    }
    
    return NextResponse.json({ error: '无效的查询类型' }, { status: 400 })
    
  } catch (error) {
    console.error('获取信息失败:', error)
    return NextResponse.json({ error: '获取信息失败' }, { status: 500 })
  }
}

// 添加新记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body
    
    if (type === 'department') {
      const { dept_name } = data
      const query = 'INSERT INTO department (dept_name) VALUES (?)'
      const [result] = await pool.execute(query, [dept_name])
      return NextResponse.json({ success: true, id: (result as any).insertId })
      
    } else if (type === 'major') {
      const { major_name, dept_id } = data
      const query = 'INSERT INTO major (major_name, dept_id) VALUES (?, ?)'
      const [result] = await pool.execute(query, [major_name, dept_id])
      return NextResponse.json({ success: true, id: (result as any).insertId })
      
    } else if (type === 'class') {
      const { class_name, major_id, student_count = 0 } = data
      const query = 'INSERT INTO class (class_name, major_id, student_count) VALUES (?, ?, ?)'
      const [result] = await pool.execute(query, [class_name, major_id, student_count])
      return NextResponse.json({ success: true, id: (result as any).insertId })
    }
    
    return NextResponse.json({ error: '无效的类型' }, { status: 400 })
    
  } catch (error) {
    console.error('添加记录失败:', error)
    return NextResponse.json({ error: '添加记录失败' }, { status: 500 })
  }
}

// 更新记录
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, id, ...data } = body
    
    if (type === 'department') {
      const { dept_name } = data
      const query = 'UPDATE department SET dept_name = ? WHERE dept_id = ?'
      await pool.execute(query, [dept_name, id])
      return NextResponse.json({ success: true })
      
    } else if (type === 'major') {
      const { major_name, dept_id } = data
      const query = 'UPDATE major SET major_name = ?, dept_id = ? WHERE major_id = ?'
      await pool.execute(query, [major_name, dept_id, id])
      return NextResponse.json({ success: true })
      
    } else if (type === 'class') {
      const { class_name, major_id, student_count } = data
      const query = 'UPDATE class SET class_name = ?, major_id = ?, student_count = ? WHERE class_id = ?'
      await pool.execute(query, [class_name, major_id, student_count, id])
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: '无效的类型' }, { status: 400 })
    
  } catch (error) {
    console.error('更新记录失败:', error)
    return NextResponse.json({ error: '更新记录失败' }, { status: 500 })
  }
}

// 删除记录
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')
    
    if (!type || !id) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }
    
    if (type === 'department') {
      const query = 'DELETE FROM department WHERE dept_id = ?'
      await pool.execute(query, [id])
      return NextResponse.json({ success: true })
      
    } else if (type === 'major') {
      const query = 'DELETE FROM major WHERE major_id = ?'
      await pool.execute(query, [id])
      return NextResponse.json({ success: true })
      
    } else if (type === 'class') {
      const query = 'DELETE FROM class WHERE class_id = ?'
      await pool.execute(query, [id])
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: '无效的类型' }, { status: 400 })
    
  } catch (error) {
    console.error('删除记录失败:', error)
    return NextResponse.json({ error: '删除记录失败' }, { status: 500 })
  }
}
