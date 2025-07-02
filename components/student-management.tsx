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
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Student {
  student_id: string
  name: string
  gender: string
  birth_date: string
  class_id: number
  admission_year: number
  class_name?: string
  major_name?: string
  dept_name?: string
}

interface Class {
  class_id: number
  class_name: string
  major_name: string
}

interface Score {
  course_name: string
  score: number
  course_type: string
  semester: string
}

export default function StudentManagement() {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isTranscriptDialogOpen, setIsTranscriptDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState<Partial<Student>>({})
  const [transcript, setTranscript] = useState<Score[]>([])

  // 计算年龄的辅助函数
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0
    
    try {
      const birth = new Date(birthDate)
      const today = new Date()
      
      // 检查日期是否有效
      if (isNaN(birth.getTime())) return 0
      
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      
      // 确保年龄在合理范围内
      return age >= 0 && age <= 150 ? age : 0
    } catch (error) {
      console.error('计算年龄时出错:', error)
      return 0
    }
  }

  useEffect(() => {
    fetchStudents()
    fetchClasses()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      const data = await response.json()
      if (data.students) {
        setStudents(data.students)
      }
    } catch (error) {
      console.error('获取学生数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/academics?type=classes')
      const data = await response.json()
      if (data.classes) {
        setClasses(data.classes)
      }
    } catch (error) {
      console.error('获取班级数据失败:', error)
    }
  }

  const fetchTranscript = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}/transcript`)
      const data = await response.json()
      if (data.transcript) {
        setTranscript(data.transcript)
      } else {
        setTranscript([])
      }
    } catch (error) {
      console.error('获取成绩单失败:', error)
      setTranscript([])
    }
  }

  const handleAddStudent = async () => {
    // 表单验证
    if (!formData.student_id?.trim()) {
      toast({
        title: "验证失败",
        description: "请输入学号",
        variant: "destructive",
      })
      return
    }
    if (!formData.name?.trim()) {
      toast({
        title: "验证失败",
        description: "请输入姓名",
        variant: "destructive",
      })
      return
    }
    if (!formData.gender) {
      toast({
        title: "验证失败",
        description: "请选择性别",
        variant: "destructive",
      })
      return
    }
    if (!formData.birth_date) {
      toast({
        title: "验证失败",
        description: "请选择出生日期",
        variant: "destructive",
      })
      return
    }
    if (!formData.class_id) {
      toast({
        title: "验证失败",
        description: "请选择班级",
        variant: "destructive",
      })
      return
    }
    if (!formData.admission_year) {
      toast({
        title: "验证失败",
        description: "请选择入学年份",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchStudents()
        setIsAddDialogOpen(false)
        setFormData({})
        toast({
          title: "成功",
          description: "学生添加成功",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "添加失败",
          description: errorData.error || '添加学生失败',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('添加学生失败:', error)
      toast({
        title: "添加失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleEditStudent = async () => {
    if (!editingStudent) return

    // 表单验证
    if (!formData.student_id?.trim()) {
      toast({
        title: "验证失败",
        description: "请输入学号",
        variant: "destructive",
      })
      return
    }
    if (!formData.name?.trim()) {
      toast({
        title: "验证失败",
        description: "请输入姓名",
        variant: "destructive",
      })
      return
    }
    if (!formData.gender) {
      toast({
        title: "验证失败",
        description: "请选择性别",
        variant: "destructive",
      })
      return
    }
    if (!formData.birth_date) {
      toast({
        title: "验证失败",
        description: "请选择出生日期",
        variant: "destructive",
      })
      return
    }
    if (!formData.class_id) {
      toast({
        title: "验证失败",
        description: "请选择班级",
        variant: "destructive",
      })
      return
    }
    if (!formData.admission_year) {
      toast({
        title: "验证失败",
        description: "请选择入学年份",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/students/${editingStudent.student_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchStudents()
        setIsEditDialogOpen(false)
        setEditingStudent(null)
        setFormData({})
        toast({
          title: "成功",
          description: "学生信息更新成功",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "编辑失败",
          description: errorData.error || '编辑学生失败',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('编辑学生失败:', error)
      toast({
        title: "编辑失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleDeleteStudent = async (student: Student) => {
    setDeletingStudent(student)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteStudent = async () => {
    if (!deletingStudent) return

    try {
      const response = await fetch(`/api/students/${deletingStudent.student_id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchStudents()
        setIsDeleteDialogOpen(false)
        setDeletingStudent(null)
        toast({
          title: "删除成功",
          description: `学生 ${deletingStudent.name} 已被删除`,
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "删除失败",
          description: errorData.error || '删除学生失败',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('删除学生失败:', error)
      toast({
        title: "删除失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const openAddDialog = () => {
    setFormData({})
    setIsAddDialogOpen(true)
  }

  const openEditDialog = (student: Student) => {
    setEditingStudent(student)
    // 格式化日期为 YYYY-MM-DD 格式以便在日期输入框中正确显示
    const formattedBirthDate = student.birth_date 
      ? new Date(student.birth_date).toISOString().split('T')[0] 
      : '';
    
    setFormData({
      student_id: student.student_id,
      name: student.name,
      gender: student.gender,
      birth_date: formattedBirthDate,
      class_id: student.class_id,
      admission_year: student.admission_year,
    })
    setIsEditDialogOpen(true)
  }

  const openTranscriptDialog = async (student: Student) => {
    setViewingStudent(student)
    await fetchTranscript(student.student_id)
    setIsTranscriptDialogOpen(true)
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = selectedClass === "all" || student.class_id.toString() === selectedClass
    return matchesSearch && matchesClass
  })

  if (loading) {
    return <div className="flex justify-center items-center h-64">加载中...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>学生管理</CardTitle>
          <CardDescription>管理学生信息，包括添加、编辑和删除学生</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索学生姓名或学号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="选择班级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有班级</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.class_id} value={cls.class_id.toString()}>
                    {cls.class_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              添加学生
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>学号</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>性别</TableHead>
                  <TableHead>出生日期</TableHead>
                  <TableHead>年龄</TableHead>
                  <TableHead>班级</TableHead>
                  <TableHead>专业</TableHead>
                  <TableHead>入学年份</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.student_id}>
                    <TableCell className="font-medium">{student.student_id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Badge variant={student.gender === "男" ? "default" : "secondary"}>
                        {student.gender}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.birth_date ? new Date(student.birth_date).toLocaleDateString('zh-CN') : '-'}</TableCell>
                    <TableCell>{student.birth_date ? calculateAge(student.birth_date) + '岁' : '-'}</TableCell>
                    <TableCell>{student.class_name}</TableCell>
                    <TableCell>{student.major_name}</TableCell>
                    <TableCell>{student.admission_year}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openTranscriptDialog(student)}
                          title="查看成绩单"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(student)}
                          title="编辑学生"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteStudent(student)}
                          title="删除学生"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              没有找到匹配的学生
            </div>
          )}
        </CardContent>
      </Card>

      {/* 添加学生对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>添加新学生</DialogTitle>
            <DialogDescription>
              填写学生的基本信息
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student_id" className="text-right">
                学号
              </Label>
              <Input
                id="student_id"
                value={formData.student_id || ""}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                className="col-span-3"
                placeholder="请输入学号"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                姓名
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                placeholder="请输入姓名"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                性别
              </Label>
              <Select
                value={formData.gender || ""}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="男">男</SelectItem>
                  <SelectItem value="女">女</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birth_date" className="text-right">
                出生日期
              </Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date || ""}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="class_id" className="text-right">
                班级
              </Label>
              <Select
                value={formData.class_id?.toString() || ""}
                onValueChange={(value) => setFormData({ ...formData, class_id: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择班级" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.class_id} value={cls.class_id.toString()}>
                      {cls.class_name} - {cls.major_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="admission_year" className="text-right">
                入学年份
              </Label>
              <Select
                value={formData.admission_year?.toString() || ""}
                onValueChange={(value) => setFormData({ ...formData, admission_year: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择入学年份" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}年
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddStudent}>添加学生</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑学生对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>编辑学生信息</DialogTitle>
            <DialogDescription>
              修改学生的基本信息
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_student_id" className="text-right">
                学号
              </Label>
              <Input
                id="edit_student_id"
                value={formData.student_id || ""}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                className="col-span-3"
                placeholder="请输入学号"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_name" className="text-right">
                姓名
              </Label>
              <Input
                id="edit_name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                placeholder="请输入姓名"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_gender" className="text-right">
                性别
              </Label>
              <Select
                value={formData.gender || ""}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="男">男</SelectItem>
                  <SelectItem value="女">女</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_birth_date" className="text-right">
                出生日期
              </Label>
              <Input
                id="edit_birth_date"
                type="date"
                value={formData.birth_date || ""}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_class_id" className="text-right">
                班级
              </Label>
              <Select
                value={formData.class_id?.toString() || ""}
                onValueChange={(value) => setFormData({ ...formData, class_id: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择班级" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.class_id} value={cls.class_id.toString()}>
                      {cls.class_name} - {cls.major_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_admission_year" className="text-right">
                入学年份
              </Label>
              <Select
                value={formData.admission_year?.toString() || ""}
                onValueChange={(value) => setFormData({ ...formData, admission_year: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择入学年份" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}年
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditStudent}>保存修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 成绩单对话框 */}
      <Dialog open={isTranscriptDialogOpen} onOpenChange={setIsTranscriptDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>学生成绩单</DialogTitle>
            <DialogDescription>
              {viewingStudent?.name} ({viewingStudent?.student_id}) 的成绩单
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {transcript.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>课程名称</TableHead>
                    <TableHead>课程类型</TableHead>
                    <TableHead>学期</TableHead>
                    <TableHead>成绩</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transcript.map((score, index) => (
                    <TableRow key={index}>
                      <TableCell>{score.course_name}</TableCell>
                      <TableCell>{score.course_type}</TableCell>
                      <TableCell>{score.semester}</TableCell>
                      <TableCell>
                        <Badge variant={score.score >= 60 ? "default" : "destructive"}>
                          {score.score}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                该学生暂无成绩记录
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除学生 <strong>{deletingStudent?.name}</strong>（学号：{deletingStudent?.student_id}）吗？
              <br />
              此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStudent} className="bg-red-600 hover:bg-red-700">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
