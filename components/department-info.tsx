"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, GraduationCap, Users } from "lucide-react"
import { mockDepartments, mockMajors, mockClasses, mockStudents } from "@/lib/mock-data"

export default function DepartmentInfo() {
  const getDepartmentStats = (deptId: number) => {
    const majors = mockMajors.filter((m) => m.dept_id === deptId)
    const majorIds = majors.map((m) => m.major_id)
    const classes = mockClasses.filter((c) => majorIds.includes(c.major_id))
    const classIds = classes.map((c) => c.class_id)
    const students = mockStudents.filter((s) => classIds.includes(s.class_id))

    return {
      majorCount: majors.length,
      classCount: classes.length,
      studentCount: students.length,
    }
  }

  const getMajorStats = (majorId: number) => {
    const classes = mockClasses.filter((c) => c.major_id === majorId)
    const classIds = classes.map((c) => c.class_id)
    const students = mockStudents.filter((s) => classIds.includes(s.class_id))

    return {
      classCount: classes.length,
      studentCount: students.length,
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>院系信息总览</CardTitle>
          <CardDescription>查看各院系、专业和班级的基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {mockDepartments.map((department) => {
              const deptStats = getDepartmentStats(department.dept_id)
              const departmentMajors = mockMajors.filter((m) => m.dept_id === department.dept_id)

              return (
                <div key={department.dept_id} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Building className="h-6 w-6 text-blue-600" />
                      <h3 className="text-xl font-semibold">{department.dept_name}</h3>
                    </div>
                    <div className="flex space-x-4 text-sm text-muted-foreground">
                      <span>{deptStats.majorCount} 个专业</span>
                      <span>{deptStats.classCount} 个班级</span>
                      <span>{deptStats.studentCount} 名学生</span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {departmentMajors.map((major) => {
                      const majorStats = getMajorStats(major.major_id)
                      const majorClasses = mockClasses.filter((c) => c.major_id === major.major_id)

                      return (
                        <Card key={major.major_id} className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <GraduationCap className="h-4 w-4 text-blue-600" />
                                <CardTitle className="text-base">{major.major_name}</CardTitle>
                              </div>
                              <Badge variant="secondary">{majorStats.studentCount} 人</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">班级数量:</span>
                                <span className="font-medium">{majorStats.classCount}</span>
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">班级列表:</div>
                                <div className="flex flex-wrap gap-1">
                                  {majorClasses.map((cls) => (
                                    <Badge key={cls.class_id} variant="outline" className="text-xs">
                                      {cls.class_name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>班级详情</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockClasses.map((cls) => {
                const major = mockMajors.find((m) => m.major_id === cls.major_id)
                const department = mockDepartments.find((d) => d.dept_id === major?.dept_id)
                const studentCount = mockStudents.filter((s) => s.class_id === cls.class_id).length

                return (
                  <div key={cls.class_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{cls.class_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {major?.major_name} · {department?.dept_name}
                      </div>
                    </div>
                    <Badge variant="secondary">{studentCount} 人</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>统计信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">院系总数</span>
                </div>
                <span className="text-xl font-bold text-blue-600">{mockDepartments.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                  <span className="font-medium">专业总数</span>
                </div>
                <span className="text-xl font-bold text-green-600">{mockMajors.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">班级总数</span>
                </div>
                <span className="text-xl font-bold text-purple-600">{mockClasses.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">学生总数</span>
                </div>
                <span className="text-xl font-bold text-orange-600">{mockStudents.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
