"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { BarChart3, PieChart as PieChartIcon } from "lucide-react"

interface StatisticsData {
  [key: string]: any
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function StatisticsQuery() {
  const [selectedType, setSelectedType] = useState("")
  const [data, setData] = useState<StatisticsData[]>([])
  const [loading, setLoading] = useState(false)
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar')

  // 查询统计数据
  const handleQuery = async () => {
    if (!selectedType) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/statistics?type=${selectedType}`)
      const result = await response.json()
      
      if (result.data) {
        setData(result.data)
      }
    } catch (error) {
      console.error('查询统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 统计类型选项
  const statisticsTypes = [
    { value: 'student_count_by_class', label: '按班级统计学生人数' },
    { value: 'student_count_by_major', label: '按专业统计学生人数' },
    { value: 'student_count_by_department', label: '按院系统计学生人数' },
    { value: 'average_score_by_course', label: '按课程统计平均成绩' },
    { value: 'score_distribution', label: '成绩分布统计' },
    { value: 'reward_punishment_summary', label: '奖惩情况统计' },
  ]

  // 渲染表格
  const renderTable = () => {
    if (data.length === 0) return null

    const columns = Object.keys(data[0])
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column} className="capitalize">
                {getColumnLabel(column)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column}>
                  {formatCellValue(row[column], column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  // 自定义X轴标签组件，支持换行
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props
    const maxLength = 8 // 每行最大字符数
    
    if (!payload?.value) return null
    
    const text = payload.value
    const lines = []
    
    if (text.length <= maxLength) {
      lines.push(text)
    } else {
      // 按字符分割，每行不超过maxLength个字符
      for (let i = 0; i < text.length; i += maxLength) {
        lines.push(text.substring(i, i + maxLength))
      }
    }
    
    return (
      <g transform={`translate(${x},${y})`}>
        {lines.map((line, index) => (
          <text
            key={index}
            x={0}
            y={index * 16 + 8}
            textAnchor="middle"
            fill="#666"
            fontSize="12"
          >
            {line}
          </text>
        ))}
      </g>
    )
  }

  // 渲染图表
  const renderChart = () => {
    if (data.length === 0) return null

    // 过滤掉值为0或无效的数据，避免饼状图显示空项目
    const chartData = data
      .map((item, index) => {
        const name = item.class_name || item.major_name || item.dept_name || item.course_name || item.grade_level || item.type || `项目${index + 1}`
        return {
          ...item,
          name: name.length > 15 ? name.substring(0, 12) + '...' : name, // 截断过长的标签
          fullName: name, // 保留完整名称用于Tooltip
          value: item.student_count || item.count || item.avg_score || 0
        }
      })
      .filter(item => item.value > 0) // 过滤掉值为0的项目

    // 如果所有数据都被过滤掉了，显示提示信息
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px] text-gray-500">
          <p>暂无有效数据用于图表显示</p>
        </div>
      )
    }

    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent, value }: any) => {
                // 只显示百分比大于5%的标签，避免标签重叠
                if (percent < 0.05) return ''
                return `${name} ${((percent || 0) * 100).toFixed(0)}%`
              }}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              // 添加内边距避免标签重叠
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any, name: any) => [value, getValueLabel()]}
              labelFormatter={(label: any, payload: any) => {
                const fullName = payload?.[0]?.payload?.fullName || label
                return `项目: ${fullName}`
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            interval={0}
            tick={<CustomXAxisTick />}
            height={80}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: any, name: any) => [value, getValueLabel()]}
            labelFormatter={(label: any) => `项目: ${label}`}
          />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // 获取列标签
  const getColumnLabel = (column: string) => {
    const labels: { [key: string]: string } = {
      class_name: '班级',
      major_name: '专业',
      dept_name: '院系',
      course_name: '课程',
      student_count: '学生人数',
      avg_score: '平均成绩',
      max_score: '最高分',
      min_score: '最低分',
      grade_level: '成绩等级',
      count: '数量',
      percentage: '百分比',
      type: '类型',
      value: '数值'
    }
    return labels[column] || column
  }

  // 根据统计类型获取合适的数值标签
  const getValueLabel = () => {
    switch (selectedType) {
      case 'student_count_by_class':
      case 'student_count_by_major':
      case 'student_count_by_department':
        return '学生人数'
      case 'average_score_by_course':
        return '平均成绩'
      case 'score_distribution':
      case 'reward_punishment_summary':
        return '数量'
      default:
        return '数值'
    }
  }

  // 格式化单元格值
  const formatCellValue = (value: any, column: string) => {
    if (column === 'avg_score' && typeof value === 'number') {
      return value.toFixed(2)
    }
    if (column === 'percentage' && typeof value === 'number') {
      return `${value}%`
    }
    return value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>统计查询</CardTitle>
        <CardDescription>
          各类信息的统计分析和可视化展示
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-4">
          <div className="flex gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="选择统计类型" />
              </SelectTrigger>
              <SelectContent>
                {statisticsTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={handleQuery} disabled={!selectedType || loading}>
              {loading ? '查询中...' : '执行查询'}
            </Button>
          </div>

          {data.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                柱状图
              </Button>
              <Button
                variant={chartType === 'pie' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('pie')}
              >
                <PieChartIcon className="h-4 w-4 mr-2" />
                饼图
              </Button>
            </div>
          )}
        </div>

        {data.length > 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">图表展示</h3>
              {renderChart()}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">详细数据</h3>
              {renderTable()}
            </div>
          </div>
        )}

        {data.length === 0 && selectedType && !loading && (
          <div className="text-center text-muted-foreground py-8">
            暂无统计数据
          </div>
        )}
      </CardContent>
    </Card>
  )
}
