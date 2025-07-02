"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, Award, Building, BarChart3, Database } from "lucide-react"
import StudentManagement from "@/components/student-management"
import ScoreManagement from "@/components/score-management"
import RewardPunishmentManagement from "@/components/reward-punishment-management"
import DepartmentInfo from "@/components/department-management"
import StatisticsQuery from "@/components/statistics-query"
import BackupManagement from "@/components/backup-management"

interface OverviewStats {
  studentCount: number
  majorCount: number
  rewardCount: number
  deptCount: number
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("students")
  const [stats, setStats] = useState<OverviewStats>({
    studentCount: 0,
    majorCount: 0,
    rewardCount: 0,
    deptCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/statistics?type=overview')
        const result = await response.json()
        if (result.data) {
          setStats(result.data)
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">高校学籍管理系统</h1>
            </div>
            <div className="text-sm text-gray-500">HFUT Student Management System</div>
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
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.studentCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">专业数量</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.majorCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">奖惩记录</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.rewardCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">院系数量</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.deptCount}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="students">学生管理</TabsTrigger>
            <TabsTrigger value="scores">成绩管理</TabsTrigger>
            <TabsTrigger value="rewards">奖惩管理</TabsTrigger>
            <TabsTrigger value="departments">院系管理</TabsTrigger>
            <TabsTrigger value="statistics">统计查询</TabsTrigger>
            <TabsTrigger value="backup">数据备份</TabsTrigger>
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

          <TabsContent value="statistics" className="space-y-4">
            <StatisticsQuery />
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <BackupManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
