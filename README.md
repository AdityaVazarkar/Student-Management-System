# EduManage - Student Management & Academic Homework System

A full-stack modern web application built with **Java Spring Boot**, **React.js**, and **Vanilla CSS** featuring dedicated **Teacher/Admin** and **Student** portals.

---

## 🚀 Key Features

### 👨‍🏫 Teacher / Admin Portal
- **Dashboard Overview**: Real-time stats on enrolled students, active classrooms, assignments published, and pending reviews.
- **Student Management**:
  - View all registered students with roll numbers and contact info.
  - **Assign Students to Classes / Change Section**: Easily assign students to classrooms (e.g., *Grade 10 - Section A*, *Grade 11 - Science*).
  - **Edit Student Details**: Modify student name, email, roll number, phone, and class.
  - **Delete Student**: Remove student and automatically clean up their submissions.
- **Homework & Assignment Management**:
  - Create new homework specifying title, subject, target class (or `ALL`), due date, maximum points, and detailed instructions.
  - Edit and delete homework assignments.
- **Submissions & Grading Center**:
  - View all student homework submissions.
  - Filter by pending review or graded.
  - Review student answers and solution links.
  - Award score/marks out of maximum points.
  - Provide personalized teacher feedback comments.
- **Classroom Management**:
  - Add and manage classrooms, sections, and stream descriptions.

---

### 🎒 Student Portal
- **Registration & Authentication**:
  - Student self-registration with Full Name, Email, Password, Roll Number, Phone, and Class.
  - Secure login with role-based dashboard access.
- **My Homework**:
  - View all assignments targeted to the student's assigned class or all classes.
  - Filter by *Pending Submission*, *Submitted*, and *Graded*.
  - Full assignment details (Subject, Deadline, Instructions, Maximum points).
- **Homework Submission**:
  - Submit detailed answer notes and optional file/document links (Google Drive, GitHub, PDF).
  - Option to update submission before grading.
- **Grades & Feedback View**:
  - View official scores awarded by the teacher.
  - Read teacher feedback and commentary.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 21, Spring Boot 4.1.1, Spring Data JPA, Lombok |
| **Database** | H2 Database (In-Memory with automatic schema management) |
| **Frontend** | React 19, JavaScript, Vite |
| **Styling** | Vanilla CSS (Custom Design System with Glassmorphism & Micro-animations) |
| **Icons** | Lucide React |

---

## ⚡ Instant Demo Credentials

The backend comes pre-seeded with sample data and accounts:

| Role | Email | Password | Details |
|---|---|---|---|
| **Teacher / Admin** | `teacher@school.com` | `admin123` | Prof. Sarah Jenkins |
| **Student (Grade 10-A)** | `alex@student.com` | `student123` | Alex Rivera (Roll: `STU-1001`) |
| **Student (Grade 10-A)** | `emma@student.com` | `student123` | Emma Watson (Roll: `STU-1002`) |
| **Student (Grade 11-Sci)**| `liam@student.com` | `student123` | Liam Chen (Roll: `STU-1101`) |

*Tip: The UI features 1-Click Demo Login buttons and a "Switch to Teacher / Student" button in the navigation bar to test both perspectives immediately!*

---

## 🏃‍♂️ How to Run Locally

### 1. Backend (Spring Boot)
```bash
cd StudentRegistration

# Package and run
./mvnw clean package -DskipTests
java -jar target/StudentRegistration-0.0.1-SNAPSHOT.jar
```
*Backend runs at `http://localhost:8080`.*
*H2 Console is available at `http://localhost:8080/h2-console`.*

### 2. Frontend (React JS)
```bash
cd Frontend

# Install dependencies and start dev server
npm install
npm run dev
```
*Frontend runs at `http://localhost:3000`.*

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` - Register new student account
- `POST /api/auth/login` - Authenticate student or teacher

### Student Management
- `GET /api/students` - List all students (optional `?className=...`)
- `GET /api/students/{id}` - Get student by ID
- `PUT /api/students/{id}` - Edit student profile
- `PATCH /api/students/{id}/assign-class` - Assign or change student's class
- `DELETE /api/students/{id}` - Delete student and their submissions

### Homework
- `GET /api/homework` - List all homework assignments
- `GET /api/homework/class/{className}` - Get assignments for a specific class
- `POST /api/homework` - Create new homework assignment
- `PUT /api/homework/{id}` - Update homework
- `DELETE /api/homework/{id}` - Delete homework

### Submissions & Grading
- `POST /api/submissions` - Submit or update homework answer
- `GET /api/submissions` - List all submissions
- `GET /api/submissions/student/{studentId}` - Get submissions by student
- `GET /api/submissions/homework/{homeworkId}` - Get submissions for an assignment
- `PUT /api/submissions/{id}/grade` - Grade submission and provide feedback

### Dashboard & Classrooms
- `GET /api/dashboard/stats` - Total counts and submission stats
- `GET /api/classes` - List all classrooms
- `POST /api/classes` - Create new classroom
