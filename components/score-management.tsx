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
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { mockScores, mockStudents, mockCourses } from "@/lib/mock-data"

interface Score {
  student_id: string
  course_id: number
  score: number
  term: string
}

export default function ScoreManagement() {
  const [scores, setScores] = useState<Score[]>(mockScores)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTerm, setSelectedTerm] = useState<string>("2024春") // Updated default value
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentScore, setCurrentScore] = useState<Score | null>(null)
  const [formData, setFormData] = useState<Partial<Score>>({})

  const filteredScores = scores.filter((score) => {
    const student = mockStudents.find((s) => s.student_id === score.student_id)
    const matchesSearch =
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) || score.student_id.includes(searchTerm)
    const matchesTerm = !selectedTerm || score.term === selectedTerm
    return matchesSearch && matchesTerm
  })

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find((s) => s.student_id === studentId)
    return student?.name || "未知学生"
  }

  const getCourseName = (courseId: number) => {
    const course = mockCourses.find((c) => c.course_id === courseId)
    return course?.course_name || "未知课程"
  }

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: "优秀", variant: "default" as const }
    if (score >= 80) return { level: "良好", variant: "secondary" as const }
    if (score >= 70) return { level: "中等", variant: "outline" as const }
    if (score >= 60) return { level: "及格", variant: "outline" as const }
    return { level: "不及格", variant: "destructive" as const }
  }

  const handleAdd = () => {
    if (formData.student_id && formData.course_id && formData.score !== undefined && formData.term) {
      const newScore: Score = {
        student_id: formData.student_id,
        course_id: formData.course_id,
        score: formData.score,
        term: formData.term,
      }
      setScores([...scores, newScore])
      setFormData({})
      setIsAddDialogOpen(false)
    }
  }

  const handleEdit = () => {
    if (currentScore && formData.student_id && formData.course_id) {
      const updatedScores = scores.map((score) =>
        score.student_id === currentScore.student_id && score.course_id === currentScore.course_id
          ? { ...score, ...formData }
          : score,
      )
      setScores(updatedScores)
      setCurrentScore(null)
      setFormData({})
      setIsEditDialogOpen(false)
    }
  }

  const handleDelete = (studentId: string, courseId: number) => {
    setScores(scores.filter((score) => !(score.student_id === studentId && score.course_id === courseId)))
  }

  const openEditDialog = (score: Score) => {
    setCurrentScore(score)
    setFormData(score)
    setIsEditDialogOpen(true)
  }

  const terms = ["2024春", "2024秋", "2023春", "2023秋"]

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
                        {mockStudents.map((student) => (
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
                        {mockCourses.map((course) => (
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
                      <TableCell>{getStudentName(score.student_id)}</TableCell>
                      <TableCell>{getCourseName(score.course_id)}</TableCell>
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
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(score.student_id, score.course_id)}
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
    </div>
  )
}
