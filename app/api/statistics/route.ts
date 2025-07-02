import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'
import { RowDataPacket } from 'mysql2'

interface Statistics extends RowDataPacket {
  [key: string]: any
}

// 统计查询功能（符合课设要求4）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    let query = ''
    let rows: Statistics[] = []
    
    switch (type) {
      case 'overview':
        // 获取首页概览统计数据
        try {
          const queries = [
            'SELECT COUNT(*) as student_count FROM student',
            'SELECT COUNT(*) as major_count FROM major',
            'SELECT COUNT(*) as reward_count FROM reward_punishment',
            'SELECT COUNT(*) as dept_count FROM department'
          ]
          
          const [studentResult] = await pool.execute(queries[0])
          const [majorResult] = await pool.execute(queries[1])
          const [rewardResult] = await pool.execute(queries[2])
          const [deptResult] = await pool.execute(queries[3])
          
          const overview = {
            studentCount: (studentResult as any)[0].student_count,
            majorCount: (majorResult as any)[0].major_count,
            rewardCount: (rewardResult as any)[0].reward_count,
            deptCount: (deptResult as any)[0].dept_count
          }
          
          return NextResponse.json({ type: 'overview', data: overview })
        } catch (error) {
          console.error('概览统计查询失败:', error)
          return NextResponse.json({ error: '概览统计查询失败' }, { status: 500 })
        }
        
      case 'student_count_by_class':
        // 按班级统计学生人数
        query = `
          SELECT c.class_name, COUNT(s.student_id) as student_count, m.major_name, d.dept_name
          FROM class c
          LEFT JOIN major m ON c.major_id = m.major_id
          LEFT JOIN department d ON m.dept_id = d.dept_id
          LEFT JOIN student s ON c.class_id = s.class_id
          GROUP BY c.class_id, c.class_name, m.major_name, d.dept_name
          ORDER BY student_count DESC
        `
        break
        
      case 'student_count_by_major':
        // 按专业统计学生人数
        query = `
          SELECT m.major_name, COUNT(s.student_id) as student_count, d.dept_name
          FROM major m
          LEFT JOIN class c ON m.major_id = c.major_id
          LEFT JOIN student s ON c.class_id = s.class_id
          LEFT JOIN department d ON m.dept_id = d.dept_id
          GROUP BY m.major_id, m.major_name, d.dept_name
          ORDER BY student_count DESC
        `
        break
        
      case 'student_count_by_department':
        // 按院系统计学生人数
        query = `
          SELECT d.dept_name, COUNT(s.student_id) as student_count
          FROM department d
          LEFT JOIN major m ON d.dept_id = m.dept_id
          LEFT JOIN class c ON m.major_id = c.major_id
          LEFT JOIN student s ON c.class_id = s.class_id
          GROUP BY d.dept_id, d.dept_name
          ORDER BY student_count DESC
        `
        break
        
      case 'average_score_by_course':
        // 按课程统计平均成绩
        query = `
          SELECT c.course_name, 
                 AVG(s.score) as avg_score,
                 COUNT(s.student_id) as student_count,
                 MAX(s.score) as max_score,
                 MIN(s.score) as min_score
          FROM course c
          LEFT JOIN score s ON c.course_id = s.course_id
          GROUP BY c.course_id, c.course_name
          ORDER BY avg_score DESC
        `
        break
        
      case 'score_distribution':
        // 成绩分布统计
        query = `
          SELECT 
            CASE 
              WHEN score >= 90 THEN '优秀(90-100)'
              WHEN score >= 80 THEN '良好(80-89)'
              WHEN score >= 70 THEN '中等(70-79)'
              WHEN score >= 60 THEN '及格(60-69)'
              ELSE '不及格(0-59)'
            END as grade_level,
            COUNT(*) as count,
            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM score), 2) as percentage
          FROM score
          GROUP BY grade_level
          ORDER BY MIN(score) DESC
        `
        break
        
      case 'reward_punishment_summary':
        // 奖惩统计
        query = `
          SELECT 
            type,
            COUNT(*) as count,
            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM reward_punishment), 2) as percentage
          FROM reward_punishment
          GROUP BY type
        `
        break
        
      default:
        return NextResponse.json({ error: '无效的统计类型' }, { status: 400 })
    }
    
    const [result] = await pool.execute<Statistics[]>(query)
    rows = result
    
    return NextResponse.json({ 
      type,
      data: rows,
      total: rows.length
    })
    
  } catch (error) {
    console.error('统计查询失败:', error)
    return NextResponse.json({ error: '统计查询失败' }, { status: 500 })
  }
}
