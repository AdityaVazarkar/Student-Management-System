import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import AuthView from './components/AuthView';
import AdminDashboard from './components/AdminPanel/AdminDashboard';
import StudentManagement from './components/AdminPanel/StudentManagement';
import HomeworkManagement from './components/AdminPanel/HomeworkManagement';
import SubmissionGrading from './components/AdminPanel/SubmissionGrading';
import ClassroomManagement from './components/AdminPanel/ClassroomManagement';
import StudentHomework from './components/StudentPanel/StudentHomework';
import StudentSubmissions from './components/StudentPanel/StudentSubmissions';
import { api } from './services/api';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('edumanage_theme') || 'dark');

  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('edumanage_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Application Data States
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Homework modal trigger
  const [isCreateHwOpen, setIsCreateHwOpen] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('edumanage_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Set default tab on login
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'ADMIN') {
        setActiveTab('dashboard');
      } else {
        setActiveTab('my-homework');
      }
    }
  }, [currentUser?.role]);

  // Data fetching
  const refreshData = useCallback(async () => {
    if (!currentUser) return;
    try {
      if (currentUser.role === 'ADMIN') {
        const [statsData, studentsData, classesData, hwData, subsData] = await Promise.all([
          api.getStats().catch(() => ({})),
          api.getStudents().catch(() => []),
          api.getClasses().catch(() => []),
          api.getAllHomework().catch(() => []),
          api.getAllSubmissions().catch(() => []),
        ]);
        setStats(statsData || {});
        setStudents(studentsData || []);
        setClasses(classesData || []);
        setHomeworkList(hwData || []);
        setSubmissions(subsData || []);
      } else {
        // Student view
        const studentClass = currentUser.className || 'Grade 10 - Section A';
        const [classesData, hwData, studentSubs] = await Promise.all([
          api.getClasses().catch(() => []),
          api.getHomeworkForClass(studentClass).catch(() => []),
          api.getStudentSubmissions(currentUser.id).catch(() => []),
        ]);
        setClasses(classesData || []);
        setHomeworkList(hwData || []);
        setStudentSubmissions(studentSubs || []);
      }
    } catch (err) {
      console.error('Failed to refresh data', err);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Auth Handlers
  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('edumanage_user', JSON.stringify(userData));
    showToast(`Welcome back, ${userData.name}!`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('edumanage_user');
    showToast('Signed out successfully', 'info');
  };

  // Instant Quick Switch between Teacher & Student demo accounts
  const handleQuickSwitch = async () => {
    try {
      if (currentUser?.role === 'ADMIN') {
        // Switch to Student (Alex)
        const studentUser = await api.login({ email: 'alex@student.com', password: 'student123' });
        setCurrentUser(studentUser);
        localStorage.setItem('edumanage_user', JSON.stringify(studentUser));
        showToast('Switched to Student Portal (Alex Rivera)', 'info');
      } else {
        // Switch to Teacher Admin
        const teacherUser = await api.login({ email: 'teacher@school.com', password: 'admin123' });
        setCurrentUser(teacherUser);
        localStorage.setItem('edumanage_user', JSON.stringify(teacherUser));
        showToast('Switched to Teacher Admin Console (Prof. Jenkins)', 'info');
      }
    } catch (err) {
      showToast('Could not switch account', 'error');
    }
  };

  // If not logged in, render Auth Portal
  if (!currentUser) {
    return (
      <div className="app-container">
        <AuthView onAuthSuccess={handleAuthSuccess} classes={classes} />
        {/* Toast Container */}
        <div className="toast-container">
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast-${t.type}`}>
              {t.message}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'ADMIN';

  return (
    <div className="app-container">
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onQuickSwitch={handleQuickSwitch}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="main-wrapper">
        {isAdmin ? (
          /* Teacher / Admin Panels */
          <>
            {activeTab === 'dashboard' && (
              <AdminDashboard
                stats={stats}
                students={students}
                homeworkList={homeworkList}
                submissions={submissions}
                setActiveTab={setActiveTab}
                onOpenCreateHomework={() => {
                  setActiveTab('homework');
                  setIsCreateHwOpen(true);
                }}
              />
            )}

            {activeTab === 'students' && (
              <StudentManagement
                students={students}
                classes={classes}
                onRefresh={refreshData}
                showToast={showToast}
              />
            )}

            {activeTab === 'homework' && (
              <HomeworkManagement
                homeworkList={homeworkList}
                classes={classes}
                currentUser={currentUser}
                onRefresh={refreshData}
                showToast={showToast}
                isCreateOpen={isCreateHwOpen}
                setIsCreateOpen={setIsCreateHwOpen}
              />
            )}

            {activeTab === 'submissions' && (
              <SubmissionGrading
                submissions={submissions}
                onRefresh={refreshData}
                showToast={showToast}
              />
            )}

            {activeTab === 'classes' && (
              <ClassroomManagement
                classes={classes}
                students={students}
                onRefresh={refreshData}
                showToast={showToast}
              />
            )}
          </>
        ) : (
          /* Student Panels */
          <>
            {activeTab === 'my-homework' && (
              <StudentHomework
                currentUser={currentUser}
                homeworkList={homeworkList}
                studentSubmissions={studentSubmissions}
                onRefresh={refreshData}
                showToast={showToast}
              />
            )}

            {activeTab === 'my-submissions' && (
              <StudentSubmissions
                submissions={studentSubmissions}
              />
            )}
          </>
        )}
      </main>

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
