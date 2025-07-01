"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, Award, Building } from "lucide-react"
import StudentManagement from "@/components/student-management"
import ScoreManagement from "@/components/score-management"
import RewardPunishmentManagement from "@/components/reward-punishment-management"
import DepartmentInfo from "@/components/department-info"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("students")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">高校学籍管理系统</h1>
            </div>
            <div className="text-sm text-gray-500">University Student Information Management System</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">在校学生</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">专业数量</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+2 new majors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">奖励记录</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">院系数量</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Active departments</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="students">学生管理</TabsTrigger>
            <TabsTrigger value="scores">成绩管理</TabsTrigger>
            <TabsTrigger value="rewards">奖惩管理</TabsTrigger>
            <TabsTrigger value="departments">院系信息</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <StudentManagement />
          </TabsContent>

          <TabsContent value="scores" className="space-y-4">
            <ScoreManagement />
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <RewardPunishmentManagement />
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <DepartmentInfo />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
