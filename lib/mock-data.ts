// lib/mock-data.ts
// -----------------------------------------------------------------------------
// Centralised mock-data source for the demo application.
// Every dataset used in the UI components is declared and exported here
// -----------------------------------------------------------------------------

/* ---------------------------- Department level ---------------------------- */
export const mockDepartments = [
  { dept_id: 1, dept_name: "计算机科学与技术学院" },
  { dept_id: 2, dept_name: "电子信息工程学院" },
  { dept_id: 3, dept_name: "机械工程学院" },
  { dept_id: 4, dept_name: "经济管理学院" },
]

/* --------------------------------- Majors --------------------------------- */
export const mockMajors = [
  { major_id: 1, major_name: "计算机科学与技术", dept_id: 1 },
  { major_id: 2, major_name: "软件工程", dept_id: 1 },
  { major_id: 3, major_name: "网络工程", dept_id: 1 },
  { major_id: 4, major_name: "电子信息工程", dept_id: 2 },
  { major_id: 5, major_name: "通信工程", dept_id: 2 },
  { major_id: 6, major_name: "机械设计制造及其自动化", dept_id: 3 },
  { major_id: 7, major_name: "工商管理", dept_id: 4 },
  { major_id: 8, major_name: "会计学", dept_id: 4 },
]

/* -------------------------------- Classes --------------------------------- */
export const mockClasses = [
  { class_id: 1, class_name: "计科2021-1班", major_id: 1, student_count: 30 },
  { class_id: 2, class_name: "计科2021-2班", major_id: 1, student_count: 28 },
  { class_id: 3, class_name: "软工2021-1班", major_id: 2, student_count: 32 },
  { class_id: 4, class_name: "网工2021-1班", major_id: 3, student_count: 27 },
  { class_id: 5, class_name: "电信2021-1班", major_id: 4, student_count: 29 },
]

/* ---------------------------- Students (sample) --------------------------- */
export const mockStudents = [
  {
    student_id: "20210001",
    name: "张三",
    gender: "男",
    birth_date: "2003-05-12",
    class_id: 1,
    admission_year: 2021,
  },
  {
    student_id: "20210002",
    name: "李四",
    gender: "女",
    birth_date: "2003-11-08",
    class_id: 1,
    admission_year: 2021,
  },
  {
    student_id: "20210003",
    name: "王五",
    gender: "男",
    birth_date: "2003-03-25",
    class_id: 2,
    admission_year: 2021,
  },
  {
    student_id: "20210004",
    name: "赵六",
    gender: "女",
    birth_date: "2003-07-30",
    class_id: 3,
    admission_year: 2021,
  },
  {
    student_id: "20210005",
    name: "钱七",
    gender: "男",
    birth_date: "2003-09-15",
    class_id: 4,
    admission_year: 2021,
  },
]

/* -------------------------------- Courses --------------------------------- */
export const mockCourses = [
  { course_id: 1, course_name: "高等数学" },
  { course_id: 2, course_name: "大学英语" },
  { course_id: 3, course_name: "数据结构" },
  { course_id: 4, course_name: "操作系统" },
  { course_id: 5, course_name: "数据库原理" },
]

/* --------------------------------- Scores --------------------------------- */
export const mockScores = [
  { student_id: "20210001", course_id: 1, score: 92, term: "2024春" },
  { student_id: "20210002", course_id: 3, score: 86, term: "2024春" },
  { student_id: "20210003", course_id: 2, score: 78, term: "2024春" },
  { student_id: "20210004", course_id: 4, score: 88, term: "2024春" },
  { student_id: "20210005", course_id: 5, score: 67, term: "2024春" },
]

/* ----------------------- Reward & Punishment Records ---------------------- */
export const mockRewardPunishments = [
  {
    rp_id: 1,
    student_id: "20210001",
    type: "奖励",
    reason: "获得国家奖学金",
    date: "2024-04-20",
  },
  {
    rp_id: 2,
    student_id: "20210003",
    type: "惩罚",
    reason: "旷课累计 10 学时",
    date: "2024-03-15",
  },
  {
    rp_id: 3,
    student_id: "20210002",
    type: "奖励",
    reason: "学院编程大赛一等奖",
    date: "2024-05-10",
  },
]
