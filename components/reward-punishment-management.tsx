"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { mockRewardPunishments, mockStudents } from "@/lib/mock-data"

interface RewardPunishment {
  rp_id: number
  student_id: string
  type: string
  reason: string
  date: string
}

export default function RewardPunishmentManagement() {
  const [records, setRecords] = useState<RewardPunishment[]>(mockRewardPunishments)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("全部类型")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<RewardPunishment | null>(null)
  const [formData, setFormData] = useState<Partial<RewardPunishment>>({})

  const filteredRecords = records.filter((record) => {
    const student = mockStudents.find((s) => s.student_id === record.student_id)
    const matchesSearch =
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.student_id.includes(searchTerm) ||
      record.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !selectedType || record.type === selectedType
    return matchesSearch && matchesType
  })

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find((s) => s.student_id === studentId)
    return student?.name || "未知学生"
  }

  const getNextId = () => {
    return Math.max(...records.map((r) => r.rp_id), 0) + 1
  }

  const handleAdd = () => {
    if (formData.student_id && formData.type && formData.reason && formData.date) {
      const newRecord: RewardPunishment = {
        rp_id: getNextId(),
        student_id: formData.student_id,
        type: formData.type,
        reason: formData.reason,
        date: formData.date,
      }
      setRecords([...records, newRecord])
      setFormData({})
      setIsAddDialogOpen(false)
    }
  }

  const handleEdit = () => {
    if (currentRecord && formData.rp_id) {
      const updatedRecords = records.map((record) =>
        record.rp_id === currentRecord.rp_id ? { ...record, ...formData } : record,
      )
      setRecords(updatedRecords)
      setCurrentRecord(null)
      setFormData({})
      setIsEditDialogOpen(false)
    }
  }

  const handleDelete = (rpId: number) => {
    setRecords(records.filter((record) => record.rp_id !== rpId))
  }

  const openEditDialog = (record: RewardPunishment) => {
    setCurrentRecord(record)
    setFormData(record)
    setIsEditDialogOpen(true)
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
                        {mockStudents.map((student) => (
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
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(record)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(record.rp_id)}>
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
    </div>
  )
}
