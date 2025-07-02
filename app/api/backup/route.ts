import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execAsync = promisify(exec)

// 数据备份功能（符合课设要求9）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'backup') {
      // 创建备份
      const backupDir = path.join(process.cwd(), 'backups')
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true })
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupFile = path.join(backupDir, `backup-${timestamp}.sql`)

      const command = `mysqldump -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > "${backupFile}"`

      try {
        await execAsync(command)
        return NextResponse.json({ 
          message: '数据备份成功',
          backupFile: `backup-${timestamp}.sql`
        })
      } catch (error) {
        console.error('备份失败:', error)
        return NextResponse.json({ error: '数据备份失败' }, { status: 500 })
      }

    } else if (action === 'restore') {
      // 数据恢复
      const { backupFile } = body
      const backupPath = path.join(process.cwd(), 'backups', backupFile)

      if (!fs.existsSync(backupPath)) {
        return NextResponse.json({ error: '备份文件不存在' }, { status: 404 })
      }

      const command = `mysql -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} < "${backupPath}"`

      try {
        await execAsync(command)
        return NextResponse.json({ message: '数据恢复成功' })
      } catch (error) {
        console.error('恢复失败:', error)
        return NextResponse.json({ error: '数据恢复失败' }, { status: 500 })
      }
    }

    return NextResponse.json({ error: '无效的操作' }, { status: 400 })

  } catch (error) {
    console.error('备份恢复操作失败:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}

// 获取备份文件列表
export async function GET() {
  try {
    const backupDir = path.join(process.cwd(), 'backups')
    
    if (!fs.existsSync(backupDir)) {
      return NextResponse.json({ backups: [] })
    }

    const files = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.sql'))
      .map(file => {
        const stats = fs.statSync(path.join(backupDir, file))
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime.toISOString()
        }
      })
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())

    return NextResponse.json({ backups: files })
  } catch (error) {
    console.error('获取备份列表失败:', error)
    return NextResponse.json({ error: '获取备份列表失败' }, { status: 500 })
  }
}

// 删除备份文件
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { backupFile } = body

    if (!backupFile) {
      return NextResponse.json({ error: '备份文件名不能为空' }, { status: 400 })
    }

    const backupPath = path.join(process.cwd(), 'backups', backupFile)

    if (!fs.existsSync(backupPath)) {
      return NextResponse.json({ error: '备份文件不存在' }, { status: 404 })
    }

    // 删除文件
    fs.unlinkSync(backupPath)

    return NextResponse.json({ 
      message: '备份文件删除成功',
      deletedFile: backupFile
    })

  } catch (error) {
    console.error('删除备份文件失败:', error)
    return NextResponse.json({ error: '删除备份文件失败' }, { status: 500 })
  }
}
