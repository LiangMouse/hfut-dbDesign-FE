"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Building, GraduationCap, Users, Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Department {
  dept_id: number
  dept_name: string
}

interface Major {
  major_id: number
  major_name: string
  dept_id: number
  dept_name: string
}

interface Class {
  class_id: number
  class_name: string
  major_id: number
  major_name: string
  dept_name: string
}

export default function DepartmentInfoComplete() {
  const { toast } = useToast()
  const [departments, setDepartments] = useState<Department[]>([])
  const [majors, setMajors] = useState<Major[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog states
  const [showDeptDialog, setShowDeptDialog] = useState(false)
  const [showMajorDialog, setShowMajorDialog] = useState(false)
  const [showClassDialog, setShowClassDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingDept, setEditingDept] = useState<Department | null>(null)
  const [editingMajor, setEditingMajor] = useState<Major | null>(null)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [deletingItem, setDeletingItem] = useState<{type: string, id: number, name: string} | null>(null)

  // Form states
  const [deptForm, setDeptForm] = useState({ dept_name: '' })
  const [majorForm, setMajorForm] = useState({ major_name: '', dept_id: '' })
  const [classForm, setClassForm] = useState({ class_name: '', major_id: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [deptsRes, majorsRes, classesRes] = await Promise.all([
        fetch('/api/academics?type=departments'),
        fetch('/api/academics?type=majors'),
        fetch('/api/academics?type=classes')
      ])

      const [deptsData, majorsData, classesData] = await Promise.all([
        deptsRes.json(),
        majorsRes.json(),
        classesRes.json()
      ])

      setDepartments(deptsData.departments || [])
      setMajors(majorsData.majors || [])
      setClasses(classesData.classes || [])
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // Department operations
  const handleAddDept = () => {
    setEditingDept(null)
    setDeptForm({ dept_name: '' })
    setShowDeptDialog(true)
  }

  const handleEditDept = (dept: Department) => {
    setEditingDept(dept)
    setDeptForm({ dept_name: dept.dept_name })
    setShowDeptDialog(true)
  }

  const handleSaveDept = async () => {
    // 验证表单
    if (!deptForm.dept_name.trim()) {
      toast({
        title: "验证失败",
        description: "请输入院系名称",
        variant: "destructive",
      })
      return
    }

    try {
      const method = editingDept ? 'PUT' : 'POST'
      
      if (editingDept) {
        // PUT request for update
        const response = await fetch('/api/academics', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'department',
            id: editingDept.dept_id,
            ...deptForm
          })
        })
        
        if (response.ok) {
          setShowDeptDialog(false)
          await fetchData()
          toast({
            title: "更新成功",
            description: "院系信息已更新",
          })
        } else {
          const errorData = await response.json()
          toast({
            title: "更新失败",
            description: errorData.error || '更新院系失败',
            variant: "destructive",
          })
        }
      } else {
        // POST request for create
        const response = await fetch('/api/academics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'department',
            ...deptForm
          })
        })
        
        if (response.ok) {
          setShowDeptDialog(false)
          await fetchData()
          toast({
            title: "添加成功",
            description: "院系已成功添加",
          })
        } else {
          const errorData = await response.json()
          toast({
            title: "添加失败",
            description: errorData.error || '添加院系失败',
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error('保存院系失败:', error)
      toast({
        title: "保存失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDept = (dept: Department) => {
    setDeletingItem({ type: 'department', id: dept.dept_id, name: dept.dept_name })
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deletingItem) return

    try {
      const response = await fetch(`/api/academics?type=${deletingItem.type}&id=${deletingItem.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchData()
        setShowDeleteDialog(false)
        setDeletingItem(null)
        toast({
          title: "删除成功",
          description: `${getTypeName(deletingItem.type)} "${deletingItem.name}" 已被删除`,
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "删除失败", 
          description: errorData.error || '删除操作失败',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('删除失败:', error)
      toast({
        title: "删除失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case 'department': return '院系'
      case 'major': return '专业'
      case 'class': return '班级'
      default: return '项目'
    }
  }

  // Major operations
  const handleAddMajor = () => {
    setEditingMajor(null)
    setMajorForm({ major_name: '', dept_id: '' })
    setShowMajorDialog(true)
  }

  const handleEditMajor = (major: Major) => {
    setEditingMajor(major)
    setMajorForm({ major_name: major.major_name, dept_id: major.dept_id.toString() })
    setShowMajorDialog(true)
  }

  const handleSaveMajor = async () => {
    // 验证表单
    if (!majorForm.major_name.trim()) {
      toast({
        title: "验证失败",
        description: "请输入专业名称",
        variant: "destructive",
      })
      return
    }
    
    if (!majorForm.dept_id) {
      toast({
        title: "验证失败",
        description: "请选择所属院系",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingMajor) {
        // PUT request for update
        const response = await fetch('/api/academics', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'major',
            id: editingMajor.major_id,
            major_name: majorForm.major_name,
            dept_id: parseInt(majorForm.dept_id)
          })
        })
        
        if (response.ok) {
          setShowMajorDialog(false)
          await fetchData()
          toast({
            title: "更新成功",
            description: "专业信息已更新",
          })
        } else {
          const errorData = await response.json()
          toast({
            title: "更新失败",
            description: errorData.error || '更新专业失败',
            variant: "destructive",
          })
        }
      } else {
        // POST request for create
        const response = await fetch('/api/academics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'major',
            major_name: majorForm.major_name,
            dept_id: parseInt(majorForm.dept_id)
          })
        })
        
        if (response.ok) {
          setShowMajorDialog(false)
          await fetchData()
          toast({
            title: "添加成功",
            description: "专业已成功添加",
          })
        } else {
          const errorData = await response.json()
          toast({
            title: "添加失败",
            description: errorData.error || '添加专业失败',
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error('保存专业失败:', error)
      toast({
        title: "保存失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMajor = (major: Major) => {
    setDeletingItem({ type: 'major', id: major.major_id, name: major.major_name })
    setShowDeleteDialog(true)
  }

  // Class operations
  const handleAddClass = () => {
    setEditingClass(null)
    setClassForm({ class_name: '', major_id: '' })
    setShowClassDialog(true)
  }

  const handleEditClass = (classItem: Class) => {
    setEditingClass(classItem)
    setClassForm({ class_name: classItem.class_name, major_id: classItem.major_id.toString() })
    setShowClassDialog(true)
  }

  const handleSaveClass = async () => {
    // 验证表单
    if (!classForm.class_name.trim()) {
      toast({
        title: "验证失败",
        description: "请输入班级名称",
        variant: "destructive",
      })
      return
    }
    
    if (!classForm.major_id) {
      toast({
        title: "验证失败",
        description: "请选择所属专业",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingClass) {
        // PUT request for update
        const response = await fetch('/api/academics', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'class',
            id: editingClass.class_id,
            class_name: classForm.class_name,
            major_id: parseInt(classForm.major_id),
            student_count: 0
          })
        })
        
        if (response.ok) {
          setShowClassDialog(false)
          await fetchData()
          toast({
            title: "更新成功",
            description: "班级信息已更新",
          })
        } else {
          const errorData = await response.json()
          toast({
            title: "更新失败",
            description: errorData.error || '更新班级失败',
            variant: "destructive",
          })
        }
      } else {
        // POST request for create
        const response = await fetch('/api/academics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'class',
            class_name: classForm.class_name,
            major_id: parseInt(classForm.major_id),
            student_count: 0
          })
        })
        
        if (response.ok) {
          setShowClassDialog(false)
          await fetchData()
          toast({
            title: "添加成功",
            description: "班级已成功添加",
          })
        } else {
          const errorData = await response.json()
          toast({
            title: "添加失败",
            description: errorData.error || '添加班级失败',
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error('保存班级失败:', error)
      toast({
        title: "保存失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClass = (classItem: Class) => {
    setDeletingItem({ type: 'class', id: classItem.class_id, name: classItem.class_name })
    setShowDeleteDialog(true)
  }

  if (loading) {
    return <div className="text-center py-8">加载中...</div>
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            院系管理
          </TabsTrigger>
          <TabsTrigger value="majors" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            专业管理
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            班级管理
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>院系列表</CardTitle>
              <Button size="sm" className="flex items-center gap-2" onClick={handleAddDept}>
                <Plus className="h-4 w-4" />
                添加院系
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>院系ID</TableHead>
                    <TableHead>院系名称</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.dept_id}>
                      <TableCell>{dept.dept_id}</TableCell>
                      <TableCell>{dept.dept_name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditDept(dept)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteDept(dept)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="majors" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>专业列表</CardTitle>
              <Button size="sm" className="flex items-center gap-2" onClick={handleAddMajor}>
                <Plus className="h-4 w-4" />
                添加专业
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>专业ID</TableHead>
                    <TableHead>专业名称</TableHead>
                    <TableHead>所属院系</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {majors.map((major) => (
                    <TableRow key={major.major_id}>
                      <TableCell>{major.major_id}</TableCell>
                      <TableCell>{major.major_name}</TableCell>
                      <TableCell>{major.dept_name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditMajor(major)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteMajor(major)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>班级列表</CardTitle>
              <Button size="sm" className="flex items-center gap-2" onClick={handleAddClass}>
                <Plus className="h-4 w-4" />
                添加班级
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>班级ID</TableHead>
                    <TableHead>班级名称</TableHead>
                    <TableHead>专业</TableHead>
                    <TableHead>院系</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((classItem) => (
                    <TableRow key={classItem.class_id}>
                      <TableCell>{classItem.class_id}</TableCell>
                      <TableCell>{classItem.class_name}</TableCell>
                      <TableCell>{classItem.major_name}</TableCell>
                      <TableCell>{classItem.dept_name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditClass(classItem)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteClass(classItem)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Department Dialog */}
      <Dialog open={showDeptDialog} onOpenChange={setShowDeptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDept ? '编辑院系' : '添加院系'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dept_name">院系名称</Label>
              <Input
                id="dept_name"
                value={deptForm.dept_name}
                onChange={(e) => setDeptForm({...deptForm, dept_name: e.target.value})}
                placeholder="请输入院系名称"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeptDialog(false)}>取消</Button>
            <Button onClick={handleSaveDept}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Major Dialog */}
      <Dialog open={showMajorDialog} onOpenChange={setShowMajorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMajor ? '编辑专业' : '添加专业'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="major_name">专业名称</Label>
              <Input
                id="major_name"
                value={majorForm.major_name}
                onChange={(e) => setMajorForm({...majorForm, major_name: e.target.value})}
                placeholder="请输入专业名称"
              />
            </div>
            <div>
              <Label htmlFor="dept_select">所属院系</Label>
              <Select value={majorForm.dept_id} onValueChange={(value) => setMajorForm({...majorForm, dept_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择院系" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.dept_id} value={dept.dept_id.toString()}>
                      {dept.dept_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMajorDialog(false)}>取消</Button>
            <Button onClick={handleSaveMajor}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Class Dialog */}
      <Dialog open={showClassDialog} onOpenChange={setShowClassDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClass ? '编辑班级' : '添加班级'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="class_name">班级名称</Label>
              <Input
                id="class_name"
                value={classForm.class_name}
                onChange={(e) => setClassForm({...classForm, class_name: e.target.value})}
                placeholder="请输入班级名称"
              />
            </div>
            <div>
              <Label htmlFor="major_select">所属专业</Label>
              <Select value={classForm.major_id} onValueChange={(value) => setClassForm({...classForm, major_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择专业" />
                </SelectTrigger>
                <SelectContent>
                  {majors.map((major) => (
                    <SelectItem key={major.major_id} value={major.major_id.toString()}>
                      {major.major_name} ({major.dept_name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClassDialog(false)}>取消</Button>
            <Button onClick={handleSaveClass}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除{getTypeName(deletingItem?.type || '')} <strong>"{deletingItem?.name}"</strong> 吗？
              <br />
              此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
