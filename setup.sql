-- 创建数据库
CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

-- 院系表
CREATE TABLE department (
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(50) NOT NULL
);

-- 专业表
CREATE TABLE major (
    major_id INT PRIMARY KEY AUTO_INCREMENT,
    major_name VARCHAR(50) NOT NULL,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES department(dept_id)
);

-- 班级表
CREATE TABLE class (
    class_id INT PRIMARY KEY AUTO_INCREMENT,
    class_name VARCHAR(50) NOT NULL,
    major_id INT,
    student_count INT DEFAULT 0,
    FOREIGN KEY (major_id) REFERENCES major(major_id)
);

-- 学生表
CREATE TABLE student (
    student_id CHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    gender ENUM('男', '女') NOT NULL,
    birth_date DATE,
    class_id INT,
    admission_year INT,
    FOREIGN KEY (class_id) REFERENCES class(class_id)
);

-- 课程表
CREATE TABLE course (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL
);

-- 成绩表
CREATE TABLE score (
    student_id CHAR(10),
    course_id INT,
    score INT,
    term VARCHAR(10),
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);

-- 奖惩表
CREATE TABLE reward_punishment (
    rp_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id CHAR(10),
    type ENUM('奖励', '惩罚') NOT NULL,
    reason TEXT,
    date DATE,
    FOREIGN KEY (student_id) REFERENCES student(student_id)
);

-- 插入示例数据
INSERT INTO department (dept_name) VALUES 
('计算机科学与技术学院'),
('电子信息工程学院'),
('机械工程学院'),
('经济管理学院');

INSERT INTO major (major_name, dept_id) VALUES 
('计算机科学与技术', 1),
('软件工程', 1),
('网络工程', 1),
('电子信息工程', 2),
('通信工程', 2),
('机械设计制造及其自动化', 3),
('工商管理', 4),
('会计学', 4);

INSERT INTO class (class_name, major_id) VALUES 
('计科2021-1班', 1),
('计科2021-2班', 1),
('软工2021-1班', 2),
('网工2021-1班', 3),
('电信2021-1班', 4);

INSERT INTO student (student_id, name, gender, birth_date, class_id, admission_year) VALUES 
('20210001', '张三', '男', '2003-05-12', 1, 2021),
('20210002', '李四', '女', '2003-11-08', 1, 2021),
('20210003', '王五', '男', '2003-03-25', 2, 2021),
('20210004', '赵六', '女', '2003-07-30', 3, 2021),
('20210005', '钱七', '男', '2003-09-15', 4, 2021);

INSERT INTO course (course_name) VALUES 
('高等数学'),
('大学英语'),
('数据结构'),
('操作系统'),
('数据库原理');

INSERT INTO score (student_id, course_id, score, term) VALUES 
('20210001', 1, 92, '2024春'),
('20210002', 3, 86, '2024春'),
('20210003', 2, 78, '2024春'),
('20210004', 4, 88, '2024春'),
('20210005', 5, 67, '2024春');

INSERT INTO reward_punishment (student_id, type, reason, date) VALUES 
('20210001', '奖励', '获得国家奖学金', '2024-04-20'),
('20210003', '惩罚', '旷课累计10学时', '2024-03-15'),
('20210002', '奖励', '学院编程大赛一等奖', '2024-05-10');
