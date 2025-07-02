"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2 } from "lucide-react"

interface RewardPunishment {
  rp_id: number
  student_id: string
  student_name: string
  type: string
  reason: string
  date: string
}

interface Student {
  student_id: string
  name: string
}

export default function RewardPunishmentManagement() {
  const [records, setRecords] = useState<RewardPunishment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<RewardPunishment | null>(null)
  const [deletingRecord, setDeletingRecord] = useState<RewardPunishment | null>(null)
  const [formData, setFormData] = useState<Partial<RewardPunishment>>({})

  useEffect(() => {
    fetchRecords()
    fetchStudents()
  }, [])

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/rewards-punishments')
      const result = await response.json()
      if (result.rewards_punishments) {
        setRecords(result.rewards_punishments)
      }
    } catch (error) {
      console.error('获取奖惩记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      const result = await response.json()
      if (result.students) {
        setStudents(result.students.map((s: any) => ({
          student_id: s.student_id,
          name: s.name
        })))
      }
    } catch (error) {
      console.error('获取学生数据失败:', error)
    }
  }

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.student_id.includes(searchTerm) ||
      record.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !selectedType || record.type === selectedType
    return matchesSearch && matchesType
  })

  const getStudentName = (studentId: string) => {
    const record = records.find((r) => r.student_id === studentId)
    return record?.student_name || "未知学生"
  }

  const getNextId = () => {
    return Math.max(...records.map((r) => r.rp_id), 0) + 1
  }

  const handleAdd = async () => {
    if (formData.student_id && formData.type && formData.reason && formData.date) {
      try {
        const response = await fetch('/api/rewards-punishments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_id: formData.student_id,
            type: formData.type,
            reason: formData.reason,
            date: formData.date,
          }),
        })

        if (response.ok) {
          await fetchRecords() // 重新获取数据
          setFormData({})
          setIsAddDialogOpen(false)
        } else {
          console.error('添加奖惩记录失败')
        }
      } catch (error) {
        console.error('添加奖惩记录失败:', error)
      }
    }
  }

  const handleEdit = async () => {
    if (currentRecord && formData.rp_id) {
      try {
        const response = await fetch(`/api/rewards-punishments/${currentRecord.rp_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          await fetchRecords() // 重新获取数据
          setCurrentRecord(null)
          setFormData({})
          setIsEditDialogOpen(false)
        } else {
          console.error('更新奖惩记录失败')
        }
      } catch (error) {
        console.error('更新奖惩记录失败:', error)
      }
    }
  }

  const handleDelete = async () => {
    if (!deletingRecord) return

    try {
      const response = await fetch(`/api/rewards-punishments/${deletingRecord.rp_id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchRecords() // 重新获取数据
        setIsDeleteDialogOpen(false)
        setDeletingRecord(null)
      } else {
        console.error('删除奖惩记录失败')
      }
    } catch (error) {
      console.error('删除奖惩记录失败:', error)
    }
  }

  const handleDeleteRecord = (record: RewardPunishment) => {
    setDeletingRecord(record)
    setIsDeleteDialogOpen(true)
  }

  const openEditDialog = (record: RewardPunishment) => {
    setCurrentRecord(record)
    // 格式化日期为 YYYY-MM-DD 格式以便在日期输入框中正确显示
    const formattedDate = record.date 
      ? new Date(record.date).toISOString().split('T')[0] 
      : '';
    
    setFormData({
      ...record,
      date: formattedDate
    })
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>奖惩信息管理</CardTitle>
            <CardDescription>正在加载奖惩记录...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>奖惩信息管理</CardTitle>
          <CardDescription>管理学生的奖励和惩罚记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索学生姓名、学号或事由..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="全部类型">全部类型</SelectItem>
                <SelectItem value="奖励">奖励</SelectItem>
                <SelectItem value="惩罚">惩罚</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  添加记录
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>添加奖惩记录</DialogTitle>
                  <DialogDescription>为学生添加奖励或惩罚记录</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="student_id" className="text-right">
                      学生
                    </Label>
                    <Select
                      value={formData.student_id}
                      onValueChange={(value) => setFormData({ ...formData, student_id: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="选择学生" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.student_id} value={student.student_id}>
                            {student.name} ({student.student_id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      类型
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="奖励">奖励</SelectItem>
                        <SelectItem value="惩罚">惩罚</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reason" className="text-right">
                      事由
                    </Label>
                    <Textarea
                      id="reason"
                      value={formData.reason || ""}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="col-span-3"
                      placeholder="请输入奖惩事由..."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      日期
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date || ""}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAdd}>添加记录</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>记录ID</TableHead>
                  <TableHead>学号</TableHead>
                  <TableHead>学生姓名</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>事由</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.rp_id}>
                    <TableCell className="font-medium">{record.rp_id}</TableCell>
                    <TableCell>{record.student_id}</TableCell>
                    <TableCell>{getStudentName(record.student_id)}</TableCell>
                    <TableCell>
                      <Badge variant={record.type === "奖励" ? "default" : "destructive"}>{record.type}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={record.reason}>
                      {record.reason}
                    </TableCell>
                    <TableCell>{record.date ? new Date(record.date).toLocaleDateString('zh-CN') : '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(record)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteRecord(record)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>编辑奖惩记录</DialogTitle>
            <DialogDescription>修改奖惩记录信息</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">学生</Label>
              <div className="col-span-3">{getStudentName(formData.student_id || "")}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_type" className="text-right">
                类型
              </Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="奖励">奖励</SelectItem>
                  <SelectItem value="惩罚">惩罚</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_reason" className="text-right">
                事由
              </Label>
              <Textarea
                id="edit_reason"
                value={formData.reason || ""}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="col-span-3"
                placeholder="请输入奖惩事由..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_date" className="text-right">
                日期
              </Label>
              <Input
                id="edit_date"
                type="date"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEdit}>保存修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除 <strong>{deletingRecord?.student_name}</strong> 的{deletingRecord?.type === '奖励' ? '奖励' : '惩罚'}记录吗？
              <br />
              <strong>类型：</strong>{deletingRecord?.type} - <strong>原因：</strong>{deletingRecord?.reason}
              <br />
              此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
