import { NextRequest, NextResponse } from 'next/server'
import { pool, testConnection, dbConfig } from '@/lib/database'

export async function GET() {
  try {
    // 测试连接
    const isConnected = await testConnection()
    
    if (!isConnected) {
      return NextResponse.json({ 
        error: '数据库连接失败',
        config: {
          host: dbConfig.host,
          user: dbConfig.user,
          database: dbConfig.database,
          port: dbConfig.port
        }
      }, { status: 500 })
    }

    // 检查表是否存在
    const [tables] = await pool.execute('SHOW TABLES')
    
    // 检查是否有学生数据
    let studentCount = 0
    try {
      const [rows] = await pool.execute('SELECT COUNT(*) as count FROM student')
      studentCount = (rows as any)[0].count
    } catch (error) {
      console.log('student表可能不存在:', error)
    }

    return NextResponse.json({
      message: '数据库连接成功',
      database: dbConfig.database,
      tables: tables,
      studentCount
    })

  } catch (error) {
    console.error('数据库测试失败:', error)
    return NextResponse.json({ 
      error: '数据库测试失败', 
      details: error instanceof Error ? error.message : String(error),
      config: {
        host: dbConfig.host,
        user: dbConfig.user,
        database: dbConfig.database,
        port: dbConfig.port
      }
    }, { status: 500 })
  }
}

// 创建数据库表
export async function POST() {
  try {
    // 创建表的SQL语句
    const createTablesSql = [
      `CREATE TABLE IF NOT EXISTS department (
        dept_id INT PRIMARY KEY AUTO_INCREMENT,
        dept_name VARCHAR(50) NOT NULL
      )`,
      
      `CREATE TABLE IF NOT EXISTS major (
        major_id INT PRIMARY KEY AUTO_INCREMENT,
        major_name VARCHAR(50) NOT NULL,
        dept_id INT,
        FOREIGN KEY (dept_id) REFERENCES department(dept_id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS class (
        class_id INT PRIMARY KEY AUTO_INCREMENT,
        class_name VARCHAR(50) NOT NULL,
        major_id INT,
        student_count INT DEFAULT 0,
        FOREIGN KEY (major_id) REFERENCES major(major_id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS student (
        student_id CHAR(10) PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        gender ENUM('男', '女') NOT NULL,
        birth_date DATE,
        class_id INT,
        admission_year INT,
        FOREIGN KEY (class_id) REFERENCES class(class_id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS course (
        course_id INT PRIMARY KEY AUTO_INCREMENT,
        course_name VARCHAR(100) NOT NULL
      )`,
      
      `CREATE TABLE IF NOT EXISTS score (
        student_id CHAR(10),
        course_id INT,
        score INT,
        term VARCHAR(10),
        PRIMARY KEY (student_id, course_id),
        FOREIGN KEY (student_id) REFERENCES student(student_id),
        FOREIGN KEY (course_id) REFERENCES course(course_id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS reward_punishment (
        rp_id INT PRIMARY KEY AUTO_INCREMENT,
        student_id CHAR(10),
        type ENUM('奖励', '惩罚') NOT NULL,
        reason TEXT,
        date DATE,
        FOREIGN KEY (student_id) REFERENCES student(student_id)
      )`
    ]

    // 插入示例数据的SQL
    const insertDataSql = [
      `INSERT IGNORE INTO department (dept_name) VALUES 
        ('计算机科学与技术学院'),
        ('电子信息工程学院'),
        ('机械工程学院'),
        ('经济管理学院')`,
        
      `INSERT IGNORE INTO major (major_name, dept_id) VALUES 
        ('计算机科学与技术', 1),
        ('软件工程', 1),
        ('网络工程', 1),
        ('电子信息工程', 2)`,
        
      `INSERT IGNORE INTO class (class_name, major_id) VALUES 
        ('计科2021-1班', 1),
        ('计科2021-2班', 1),
        ('软工2021-1班', 2),
        ('网工2021-1班', 3)`,
        
      `INSERT IGNORE INTO student (student_id, name, gender, birth_date, class_id, admission_year) VALUES 
        ('20210001', '张三', '男', '2003-05-12', 1, 2021),
        ('20210002', '李四', '女', '2003-11-08', 1, 2021),
        ('20210003', '王五', '男', '2003-03-25', 2, 2021),
        ('20210004', '赵六', '女', '2003-07-30', 3, 2021)`,
        
      `INSERT IGNORE INTO course (course_name) VALUES 
        ('高等数学'),
        ('大学英语'),
        ('数据结构'),
        ('操作系统')`,
        
      `INSERT IGNORE INTO score (student_id, course_id, score, term) VALUES 
        ('20210001', 1, 92, '2024春'),
        ('20210002', 3, 86, '2024春'),
        ('20210003', 2, 78, '2024春')`,
        
      `INSERT IGNORE INTO reward_punishment (student_id, type, reason, date) VALUES 
        ('20210001', '奖励', '获得国家奖学金', '2024-04-20'),
        ('20210003', '惩罚', '旷课累计10学时', '2024-03-15')`
    ]

    // 执行创建表的SQL
    for (const sql of createTablesSql) {
      await pool.execute(sql)
    }

    // 执行插入数据的SQL
    for (const sql of insertDataSql) {
      await pool.execute(sql)
    }

    return NextResponse.json({ 
      message: '数据库表创建成功，示例数据已插入',
      success: true
    })

  } catch (error) {
    console.error('创建表失败:', error)
    return NextResponse.json({ 
      error: '创建表失败', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
