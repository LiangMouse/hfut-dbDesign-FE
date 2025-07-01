# 高校学籍管理系统

实现思路

- AI 实现前端

```md
prompt:
你是一名擅长前端开发的大学生，请根据以下要求，为“高校学籍管理系统”生成前端页面代码，使用 React + Tailwind CSS + Ant Design + Vite。

## 任务目标

- 构建一个简约风格的 Web 前端页面，用于展示和演示数据库的增删改查功能。
- 不需要复杂的路由和登录认证，仅演示核心功能。

## 技术要求

- 使用 React + TailwindCSS + Ant Design + Vite。
- npm run dev:prod 模式：请求 `http://localhost:7001/api`（配置 Vite 的代理解决跨域）。
- npm run dev:test 模式：请求本地 JSON 文件（请 mock 几个数据并保存在本地 json 文件中）。

## API 接口

- 所有接口详见下方 OpenAPI 文档（yaml 格式）。

## 建议功能模块

- 学生信息管理（增删改查）
- 班级/专业/院系信息查看
- 成绩录入和修改
- 奖惩信息管理
```

## 数据库信息

数据表

- student

  | 字段名         | 类型        | 描述                 |
  | -------------- | ----------- | -------------------- |
  | student_id     | CHAR(10)    | 主键，学号           |
  | name           | VARCHAR(50) | 姓名                 |
  | gender         | CHAR(2)     | 性别，仅限“男”或“女” |
  | birth_date     | DATE        | 出生日期             |
  | class_id       | INT         | 外键，所属班级       |
  | admission_year | INT         | 入学年份             |

- class

  | 字段名        | 类型        | 描述                           |
  | ------------- | ----------- | ------------------------------ |
  | class_id      | INT         | 主键                           |
  | class_name    | VARCHAR(50) | 班级名称                       |
  | major_id      | INT         | 外键，所属专业                 |
  | student_count | INT         | 班级学生人数（用于触发器更新） |

- major（专业）

  | 字段名     | 类型        | 描述           |
  | ---------- | ----------- | -------------- |
  | major_id   | INT         | 主键           |
  | major_name | VARCHAR(50) | 专业名称       |
  | dept_id    | INT         | 外键，所属院系 |

- department 院系

  | 字段名    | 类型        | 描述     |
  | --------- | ----------- | -------- |
  | dept_id   | INT         | 主键     |
  | dept_name | VARCHAR(50) | 院系名称 |

- score 成绩表

  | 字段名     | 类型        | 描述              |
  | ---------- | ----------- | ----------------- |
  | student_id | CHAR(10)    | 外键，学生编号    |
  | course_id  | INT         | 外键，课程编号    |
  | score      | INT         | 成绩              |
  | term       | VARCHAR(10) | 学期，如“2024 春” |

- 奖惩表

  | 字段名     | 类型        | 描述           |
  | ---------- | ----------- | -------------- |
  | rp_id      | INT         | 主键           |
  | student_id | CHAR(10)    | 外键，学生编号 |
  | type       | VARCHAR(10) | “奖励”或“惩罚” |
  | reason     | TEXT        | 原因           |
  | date       | DATE        | 记录时间       |

## Api

```yam
openapi: 3.0.0
info:
  title: 高校学籍管理系统 API
  version: 1.0.0
  description: 最小实现的学生学籍系统接口文档

servers:
  - url: http://localhost:3000

paths:
  /students:
    get:
      summary: 获取学生列表
      parameters:
        - in: query
          name: name
          schema: { type: string }
        - in: query
          name: class_id
          schema: { type: integer }
        - in: query
          name: page
          schema: { type: integer }
        - in: query
          name: limit
          schema: { type: integer }
      responses:
        '200':
          description: 成功返回学生列表
    post:
      summary: 添加学生
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Student'
      responses:
        '201':
          description: 添加成功

  /students/{student_id}:
    get:
      summary: 获取学生详情
      parameters:
        - in: path
          name: student_id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: 学生信息
    put:
      summary: 修改学生信息
      parameters:
        - in: path
          name: student_id
          required: true
          schema: { type: string }
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Student'
      responses:
        '200':
          description: 修改成功
    delete:
      summary: 删除学生
      parameters:
        - in: path
          name: student_id
          required: true
          schema: { type: string }
      responses:
        '204':
          description: 删除成功

  /students/{student_id}/transcript:
    get:
      summary: 获取学生成绩单
      parameters:
        - in: path
          name: student_id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: 成绩单信息

  /students/{student_id}/summary:
    get:
      summary: 查询学生的学号、姓名、班级、专业、院系（视图）
      parameters:
        - in: path
          name: student_id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: 学生视图信息

  /scores:
    post:
      summary: 添加成绩
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Score'
      responses:
        '201':
          description: 添加成功

  /scores:
    get:
      summary: 查询成绩
      parameters:
        - in: query
          name: student_id
          schema: { type: string }
      responses:
        '200':
          description: 成绩列表

  /scores/{student_id}/{course_id}:
    put:
      summary: 修改成绩
      parameters:
        - in: path
          name: student_id
          required: true
          schema: { type: string }
        - in: path
          name: course_id
          required: true
          schema: { type: integer }
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                score:
                  type: integer
      responses:
        '200':
          description: 修改成功

    delete:
      summary: 删除成绩
      parameters:
        - in: path
          name: student_id
          required: true
          schema: { type: string }
        - in: path
          name: course_id
          required: true
          schema: { type: integer }
      responses:
        '204':
          description: 删除成功

components:
  schemas:
    Student:
      type: object
      required: [student_id, name, gender, class_id, admission_year]
      properties:
        student_id:
          type: string
          example: "20240001"
        name:
          type: string
        gender:
          type: string
          enum: [男, 女]
        birth_date:
          type: string
          format: date
        class_id:
          type: integer
        admission_year:
          type: integer

    Score:
      type: object
      required: [student_id, course_id, score, term]
      properties:
        student_id:
          type: string
        course_id:
          type: integer
        score:
          type: integer
        term:
          type: string
          example: "2024春"

```
