"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Database, AlertCircle, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

interface BackupFile {
  filename: string
  size: number
  created: string
}

export default function BackupManagement() {
  const { toast } = useToast()
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [deletingBackup, setDeletingBackup] = useState<string | null>(null)
  const [restoringBackup, setRestoringBackup] = useState<string | null>(null)

  // 获取备份列表
  const fetchBackups = async () => {
    try {
      const response = await fetch('/api/backup')
      const data = await response.json()
      
      if (data.backups) {
        setBackups(data.backups)
      }
    } catch (error) {
      console.error('获取备份列表失败:', error)
    }
  }

  // 创建备份
  const handleBackup = async () => {
    setLoading(true)
    setMessage("")
    
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'backup' }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setMessage(`备份成功: ${result.backupFile}`)
        toast({
          title: "备份成功",
          description: `备份文件 "${result.backupFile}" 已创建`,
        })
        fetchBackups()
      } else {
        setMessage(`备份失败: ${result.error}`)
        toast({
          title: "备份失败",
          description: result.error || '备份操作失败',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('备份失败:', error)
      setMessage('备份操作失败')
      toast({
        title: "备份失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 恢复数据
  const handleRestore = (backupFile: string) => {
    setRestoringBackup(backupFile)
    setShowRestoreDialog(true)
  }

  const confirmRestore = async () => {
    if (!restoringBackup) return
    
    setLoading(true)
    setMessage("")
    
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'restore', backupFile: restoringBackup }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setMessage('数据恢复成功')
        toast({
          title: "恢复成功",
          description: "数据已成功恢复",
        })
      } else {
        setMessage(`恢复失败: ${result.error}`)
        toast({
          title: "恢复失败",
          description: result.error || '恢复操作失败',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('恢复失败:', error)
      setMessage('恢复操作失败')
      toast({
        title: "恢复失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setShowRestoreDialog(false)
      setRestoringBackup(null)
    }
  }

  // 删除备份文件
  const handleDeleteBackup = (filename: string) => {
    setDeletingBackup(filename)
    setShowDeleteDialog(true)
  }

  const confirmDeleteBackup = async () => {
    if (!deletingBackup) return

    setLoading(true)
    setMessage("")
    
    try {
      const response = await fetch('/api/backup', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ backupFile: deletingBackup }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setMessage(`备份文件 ${deletingBackup} 已删除`)
        toast({
          title: "删除成功",
          description: `备份文件 "${deletingBackup}" 已被删除`,
        })
        fetchBackups()
      } else {
        setMessage(`删除失败: ${result.error}`)
        toast({
          title: "删除失败",
          description: result.error || '删除备份文件失败',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('删除失败:', error)
      setMessage('删除操作失败')
      toast({
        title: "删除失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setShowDeleteDialog(false)
      setDeletingBackup(null)
    }
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  useEffect(() => {
    fetchBackups()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          数据备份与恢复
        </CardTitle>
        <CardDescription>
          管理数据库备份文件，支持数据备份和恢复功能
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleBackup} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            {loading ? '备份中...' : '创建备份'}
          </Button>
          
          <Button variant="outline" onClick={fetchBackups}>
            刷新列表
          </Button>
        </div>

        {message && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>备份文件名</TableHead>
              <TableHead>文件大小</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {backups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  暂无备份文件
                </TableCell>
              </TableRow>
            ) : (
              backups.map((backup) => (
                <TableRow key={backup.filename}>
                  <TableCell className="font-medium">{backup.filename}</TableCell>
                  <TableCell>{formatFileSize(backup.size)}</TableCell>
                  <TableCell>{formatDate(backup.created)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(backup.filename)}
                        disabled={loading}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        恢复
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBackup(backup.filename)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>注意事项：</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>备份文件保存在服务器的 backups 目录中</li>
            <li>恢复操作将完全覆盖当前数据库内容</li>
            <li>建议在进行重要操作前先创建备份</li>
            <li>请定期清理旧的备份文件以节省存储空间</li>
          </ul>
        </div>
      </CardContent>

      {/* 删除确认对话框 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除备份文件</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除备份文件 <strong>"{deletingBackup}"</strong> 吗？
              <br />
              此操作无法撤销，请谨慎操作。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBackup} className="bg-red-600 hover:bg-red-700">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 恢复确认对话框 */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认恢复数据</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要恢复到备份文件 <strong>"{restoringBackup}"</strong> 吗？
              <br />
              <span className="text-red-600 font-medium">警告：此操作将完全覆盖当前数据库内容，无法撤销！</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRestore} className="bg-orange-600 hover:bg-orange-700">
              确认恢复
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
