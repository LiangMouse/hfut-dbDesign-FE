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
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2 } from "lucide-react"

interface ScoreWithDetails {
  student_id: string
  student_name: string
  course_id: number
  course_name: string
  score: number
  term: string
}

interface Course {
  course_id: number
  course_name: string
}

interface Student {
  student_id: string
  name: string
}

export default function ScoreManagement() {
  const [scores, setScores] = useState<ScoreWithDetails[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTerm, setSelectedTerm] = useState<string>("") 
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentScore, setCurrentScore] = useState<ScoreWithDetails | null>(null)
  const [deletingScore, setDeletingScore] = useState<ScoreWithDetails | null>(null)
  const [formData, setFormData] = useState<Partial<ScoreWithDetails>>({})

  useEffect(() => {
    fetchScores()
    fetchStudents()
    fetchCourses()
  }, [])

  const fetchScores = async () => {
    try {
      const response = await fetch('/api/scores')
      const result = await response.json()
      if (result.scores) {
        setScores(result.scores)
      }
    } catch (error) {
      console.error('获取成绩数据失败:', error)
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

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const result = await response.json()
      if (result.courses) {
        setCourses(result.courses)
      }
    } catch (error) {
      console.error('获取课程数据失败:', error)
    }
  }

  const filteredScores = scores.filter((score) => {
    const matchesSearch =
      score.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      score.student_id.includes(searchTerm) ||
      score.course_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTerm = !selectedTerm || score.term === selectedTerm
    return matchesSearch && matchesTerm
  })

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.student_id === studentId)
    return student?.name || "未知学生"
  }

  const getCourseName = (courseId: number) => {
    const course = courses.find((c) => c.course_id === courseId)
    return course?.course_name || "未知课程"
  }

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: "优秀", variant: "default" as const }
    if (score >= 80) return { level: "良好", variant: "secondary" as const }
    if (score >= 70) return { level: "中等", variant: "outline" as const }
    if (score >= 60) return { level: "及格", variant: "outline" as const }
    return { level: "不及格", variant: "destructive" as const }
  }

  const handleAdd = async () => {
    if (formData.student_id && formData.course_id && formData.score !== undefined && formData.term) {
      try {
        const response = await fetch('/api/scores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_id: formData.student_id,
            course_id: formData.course_id,
            score: formData.score,
            term: formData.term,
          }),
        })

        if (response.ok) {
          await fetchScores() // 重新获取数据
          setFormData({})
          setIsAddDialogOpen(false)
        } else {
          console.error('添加成绩失败')
        }
      } catch (error) {
        console.error('添加成绩失败:', error)
      }
    }
  }

  const handleEdit = async () => {
    if (currentScore && formData.student_id && formData.course_id) {
      try {
        const response = await fetch(`/api/scores/${currentScore.student_id}/${currentScore.course_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          await fetchScores() // 重新获取数据
          setCurrentScore(null)
          setFormData({})
          setIsEditDialogOpen(false)
        } else {
          console.error('更新成绩失败')
        }
      } catch (error) {
        console.error('更新成绩失败:', error)
      }
    }
  }

  const handleDelete = async () => {
    if (!deletingScore) return

    try {
      const response = await fetch(`/api/scores/${deletingScore.student_id}/${deletingScore.course_id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchScores() // 重新获取数据
        setIsDeleteDialogOpen(false)
        setDeletingScore(null)
      } else {
        console.error('删除成绩失败')
      }
    } catch (error) {
      console.error('删除成绩失败:', error)
    }
  }

  const handleDeleteScore = (score: ScoreWithDetails) => {
    setDeletingScore(score)
    setIsDeleteDialogOpen(true)
  }

  const openEditDialog = (score: ScoreWithDetails) => {
    setCurrentScore(score)
    setFormData(score)
    setIsEditDialogOpen(true)
  }

  const terms = ["2024春", "2024秋", "2023春", "2023秋"]

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>成绩管理</CardTitle>
            <CardDescription>正在加载成绩数据...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>成绩管理</CardTitle>
          <CardDescription>管理学生的课程成绩，包括录入、修改和查询功能</CardDescription>
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
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="选择学期" />
              </SelectTrigger>
              <SelectContent>
                {terms.map((term) => (
                  <SelectItem key={term} value={term}>
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  录入成绩
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>录入新成绩</DialogTitle>
                  <DialogDescription>为学生录入课程成绩</DialogDescription>
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
                    <Label htmlFor="course_id" className="text-right">
                      课程
                    </Label>
                    <Select
                      value={formData.course_id?.toString()}
                      onValueChange={(value) => setFormData({ ...formData, course_id: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="选择课程" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.course_id} value={course.course_id.toString()}>
                            {course.course_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="score" className="text-right">
                      成绩
                    </Label>
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.score || ""}
                      onChange={(e) => setFormData({ ...formData, score: Number.parseInt(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="term" className="text-right">
                      学期
                    </Label>
                    <Select value={formData.term} onValueChange={(value) => setFormData({ ...formData, term: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="选择学期" />
                      </SelectTrigger>
                      <SelectContent>
                        {terms.map((term) => (
                          <SelectItem key={term} value={term}>
                            {term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAdd}>录入成绩</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>学号</TableHead>
                  <TableHead>学生姓名</TableHead>
                  <TableHead>课程名称</TableHead>
                  <TableHead>成绩</TableHead>
                  <TableHead>等级</TableHead>
                  <TableHead>学期</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScores.map((score, index) => {
                  const scoreLevel = getScoreLevel(score.score)
                  return (
                    <TableRow key={`${score.student_id}-${score.course_id}-${index}`}>
                      <TableCell className="font-medium">{score.student_id}</TableCell>
                      <TableCell>{score.student_name}</TableCell>
                      <TableCell>{score.course_name}</TableCell>
                      <TableCell className="font-medium">{score.score}</TableCell>
                      <TableCell>
                        <Badge variant={scoreLevel.variant}>{scoreLevel.level}</Badge>
                      </TableCell>
                      <TableCell>{score.term}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(score)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteScore(score)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>修改成绩</DialogTitle>
            <DialogDescription>修改学生的课程成绩</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">学生</Label>
              <div className="col-span-3">{getStudentName(formData.student_id || "")}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">课程</Label>
              <div className="col-span-3">{getCourseName(formData.course_id || 0)}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_score" className="text-right">
                成绩
              </Label>
              <Input
                id="edit_score"
                type="number"
                min="0"
                max="100"
                value={formData.score || ""}
                onChange={(e) => setFormData({ ...formData, score: Number.parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_term" className="text-right">
                学期
              </Label>
              <Select value={formData.term} onValueChange={(value) => setFormData({ ...formData, term: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择学期" />
                </SelectTrigger>
                <SelectContent>
                  {terms.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              您确定要删除 <strong>{deletingScore?.student_name}</strong> 的 <strong>{deletingScore?.course_name}</strong> 成绩吗？
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
