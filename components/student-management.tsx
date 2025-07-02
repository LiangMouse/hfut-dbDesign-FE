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
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { mockStudents, mockClasses, mockMajors, mockDepartments } from "@/lib/mock-data"

interface Student {
  student_id: string
  name: string
  gender: string
  birth_date: string
  class_id: number
  admission_year: number
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("all") // Updated default value to 'all'
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Student>>({})

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.student_id.includes(searchTerm)
    const matchesClass = selectedClass === "all" || student.class_id.toString() === selectedClass
    return matchesSearch && matchesClass
  })

  const getClassName = (classId: number) => {
    const classInfo = mockClasses.find((c) => c.class_id === classId)
    return classInfo?.class_name || "未知班级"
  }

  const getMajorName = (classId: number) => {
    const classInfo = mockClasses.find((c) => c.class_id === classId)
    if (!classInfo) return "未知专业"
    const majorInfo = mockMajors.find((m) => m.major_id === classInfo.major_id)
    return majorInfo?.major_name || "未知专业"
  }

  const getDepartmentName = (classId: number) => {
    const classInfo = mockClasses.find((c) => c.class_id === classId)
    if (!classInfo) return "未知院系"
    const majorInfo = mockMajors.find((m) => m.major_id === classInfo.major_id)
    if (!majorInfo) return "未知院系"
    const deptInfo = mockDepartments.find((d) => d.dept_id === majorInfo.dept_id)
    return deptInfo?.dept_name || "未知院系"
  }

  const handleAdd = () => {
    if (formData.student_id && formData.name && formData.gender && formData.class_id && formData.admission_year) {
      const newStudent: Student = {
        student_id: formData.student_id,
        name: formData.name,
        gender: formData.gender,
        birth_date: formData.birth_date || "",
        class_id: formData.class_id,
        admission_year: formData.admission_year,
      }
      setStudents([...students, newStudent])
      setFormData({})
      setIsAddDialogOpen(false)
    }
  }

  const handleEdit = () => {
    if (currentStudent && formData.student_id) {
      const updatedStudents = students.map((student) =>
        student.student_id === currentStudent.student_id ? { ...student, ...formData } : student,
      )
      setStudents(updatedStudents)
      setCurrentStudent(null)
      setFormData({})
      setIsEditDialogOpen(false)
    }
  }

  const handleDelete = (studentId: string) => {
    setStudents(students.filter((student) => student.student_id !== studentId))
  }

  const openEditDialog = (student: Student) => {
    setCurrentStudent(student)
    setFormData(student)
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (student: Student) => {
    setCurrentStudent(student)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>学生信息管理</CardTitle>
          <CardDescription>管理学生的基本信息，包括增加、删除、修改和查询功能</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索学生姓名或学号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="选择班级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部班级</SelectItem>
                {mockClasses.map((cls) => (
                  <SelectItem key={cls.class_id} value={cls.class_id.toString()}>
                    {cls.class_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  添加学生
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>添加新学生</DialogTitle>
                  <DialogDescription>填写学生的基本信息</DialogDescription>
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
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gender" className="text-right">
                      性别
                    </Label>
                    <Select
                      value={formData.gender}
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
                      value={formData.class_id?.toString()}
                      onValueChange={(value) => setFormData({ ...formData, class_id: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="选择班级" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockClasses.map((cls) => (
                          <SelectItem key={cls.class_id} value={cls.class_id.toString()}>
                            {cls.class_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="admission_year" className="text-right">
                      入学年份
                    </Label>
                    <Input
                      id="admission_year"
                      type="number"
                      value={formData.admission_year || ""}
                      onChange={(e) => setFormData({ ...formData, admission_year: Number.parseInt(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAdd}>添加学生</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>学号</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>性别</TableHead>
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
                      <Badge variant={student.gender === "男" ? "default" : "secondary"}>{student.gender}</Badge>
                    </TableCell>
                    <TableCell>{getClassName(student.class_id)}</TableCell>
                    <TableCell>{getMajorName(student.class_id)}</TableCell>
                    <TableCell>{student.admission_year}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openViewDialog(student)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(student)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(student.student_id)}>
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
            <DialogTitle>编辑学生信息</DialogTitle>
            <DialogDescription>修改学生的基本信息</DialogDescription>
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
                disabled
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
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_gender" className="text-right">
                性别
              </Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
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
                value={formData.class_id?.toString()}
                onValueChange={(value) => setFormData({ ...formData, class_id: Number.parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择班级" />
                </SelectTrigger>
                <SelectContent>
                  {mockClasses.map((cls) => (
                    <SelectItem key={cls.class_id} value={cls.class_id.toString()}>
                      {cls.class_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_admission_year" className="text-right">
                入学年份
              </Label>
              <Input
                id="edit_admission_year"
                type="number"
                value={formData.admission_year || ""}
                onChange={(e) => setFormData({ ...formData, admission_year: Number.parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEdit}>保存修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>学生详细信息</DialogTitle>
            <DialogDescription>查看学生的完整信息</DialogDescription>
          </DialogHeader>
          {currentStudent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">学号:</Label>
                <div className="col-span-3">{currentStudent.student_id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">姓名:</Label>
                <div className="col-span-3">{currentStudent.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">性别:</Label>
                <div className="col-span-3">
                  <Badge variant={currentStudent.gender === "男" ? "default" : "secondary"}>
                    {currentStudent.gender}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">出生日期:</Label>
                <div className="col-span-3">{currentStudent.birth_date || "未填写"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">班级:</Label>
                <div className="col-span-3">{getClassName(currentStudent.class_id)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">专业:</Label>
                <div className="col-span-3">{getMajorName(currentStudent.class_id)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">院系:</Label>
                <div className="col-span-3">{getDepartmentName(currentStudent.class_id)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">入学年份:</Label>
                <div className="col-span-3">{currentStudent.admission_year}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
