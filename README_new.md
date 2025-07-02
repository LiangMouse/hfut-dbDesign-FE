# HFUT 高校学籍管理系统

合肥工业大学 2022 级数据库课程设计，基于 **Next.js + TypeScript + Tailwind CSS** 构建的高校学籍管理系统前端应用。

[🤖 开源 AI 友好的提示词](./Prompt.md)

## 📋 项目概述

这是一个完整的高校学籍管理系统，包含学生信息管理、成绩管理、奖惩记录管理、院系管理等核心功能模块。系统采用现代化的 Web 技术栈，提供直观友好的用户界面和完整的数据管理功能。

## ✨ 主要功能

### 🎓 学生管理
- 学生信息的增删改查
- 学生详细信息查看
- 学生成绩单查看
- 学生综合信息汇总

### 📖 成绩管理
- 成绩录入与修改
- 成绩查询与统计
- 课程成绩管理
- 成绩数据导出

### 🏆 奖惩管理
- 奖励记录管理
- 处分记录管理
- 奖惩信息查询
- 奖惩统计分析

### 🏛️ 院系管理
- 院系信息维护
- 专业信息管理
- 组织架构管理

### 📊 统计查询
- 数据统计分析
- 多维度查询
- 可视化图表展示

### 💾 数据备份
- 数据库备份功能
- 备份文件管理
- 数据恢复操作

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: Radix UI + shadcn/ui
- **状态管理**: React Hooks
- **数据库**: SQLite (开发环境)
- **部署**: Vercel / Node.js

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm 或 yarn 或 pnpm

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/LiangMouse/hfut-dbDesign-FE.git
   cd hfut-dbDesign-FE
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   ```

4. **访问应用**
   
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 数据库配置

项目包含完整的数据库结构设计，详见 `setup.sql` 文件。数据库包含以下主要表：

- `students` - 学生信息表
- `courses` - 课程信息表
- `scores` - 成绩表
- `rewards_punishments` - 奖惩记录表
- `academics` - 院系信息表

## 📁 项目结构

```
hfut-dbDesign-FE/
├── app/                    # Next.js App Router 页面
│   ├── api/               # API 路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── ui/               # UI 基础组件
│   ├── student-management.tsx     # 学生管理
│   ├── score-management.tsx       # 成绩管理
│   ├── reward-punishment-management.tsx  # 奖惩管理
│   ├── department-management.tsx  # 院系管理
│   ├── statistics-query.tsx      # 统计查询
│   └── backup-management.tsx     # 备份管理
├── lib/                   # 工具库
│   ├── database.ts        # 数据库配置
│   └── utils.ts           # 工具函数
├── public/                # 静态资源
├── setup.sql             # 数据库初始化脚本
└── README.md             # 项目说明
```

## 🎨 UI 设计

- 采用现代化的扁平设计风格
- 响应式布局，支持多端访问
- 统一的组件设计语言
- 直观的交互体验
- 无障碍访问支持

## 🔧 开发指南

### 代码规范

- 使用 TypeScript 进行类型约束
- 遵循 React Hooks 最佳实践
- 采用函数式组件开发
- 统一的代码格式化标准

### 组件开发

- 所有 UI 组件基于 shadcn/ui
- 统一使用 `variant="destructive"` 样式的删除按钮
- 组件间保持一致的设计语言
- 注重组件的复用性和可维护性

## 🚢 部署说明

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量（如需要）
4. 自动部署完成

### 传统服务器部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **启动生产服务器**
   ```bash
   npm start
   ```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进项目！

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，欢迎通过 GitHub Issues 联系。

---

**此项目仅供学习交流使用** 🎓
