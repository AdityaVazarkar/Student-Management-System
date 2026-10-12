import React from 'react';
import { 
  GraduationCap, 
  LogOut, 
  Sun, 
  Moon, 
  UserCheck, 
  BookOpen, 
  Users, 
  CheckCircle, 
  LayoutDashboard,
  Layers
} from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  onQuickSwitch, 
  theme, 
  toggleTheme 
}) {
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <header className="navbar">
      <div className="brand" onClick={() => setActiveTab(isAdmin ? 'dashboard' : 'my-homework')}>
        <div className="brand-icon">
          <GraduationCap size={24} />
        </div>
        <div className="brand-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1>EduManage</h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3b82f6', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.05em' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }}></span>
              v2.0 Live
            </span>
          </div>
          <span>{isAdmin ? 'Teacher Admin Console' : 'Student Academic Portal'}</span>
        </div>
      </div>

      {currentUser && (
        <nav className="nav-tabs">
          {isAdmin ? (
            <>
              <button 
                className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={16} />
                Overview
              </button>
              <button 
                className={`nav-tab-btn ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => setActiveTab('students')}
              >
                <Users size={16} />
                Students & Classes
              </button>
              <button 
                className={`nav-tab-btn ${activeTab === 'homework' ? 'active' : ''}`}
                onClick={() => setActiveTab('homework')}
              >
                <BookOpen size={16} />
                Homeworks
              </button>
              <button 
                className={`nav-tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
                onClick={() => setActiveTab('submissions')}
              >
                <CheckCircle size={16} />
                Submissions & Grading
              </button>
              <button 
                className={`nav-tab-btn ${activeTab === 'classes' ? 'active' : ''}`}
                onClick={() => setActiveTab('classes')}
              >
                <Layers size={16} />
                Classes
              </button>
            </>
          ) : (
            <>
              <button 
                className={`nav-tab-btn ${activeTab === 'my-homework' ? 'active' : ''}`}
                onClick={() => setActiveTab('my-homework')}
              >
                <BookOpen size={16} />
                My Homework
              </button>
              <button 
                className={`nav-tab-btn ${activeTab === 'my-submissions' ? 'active' : ''}`}
                onClick={() => setActiveTab('my-submissions')}
              >
                <CheckCircle size={16} />
                Submissions & Grades
              </button>
            </>
          )}
        </nav>
      )}

      <div className="nav-actions">
        {currentUser && (
          <>
            <div className="user-badge">
              <div className="user-avatar">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-meta">
                <span className="user-name">{currentUser.name}</span>
                <span className={`user-role-tag ${isAdmin ? 'tag-admin' : 'tag-student'}`}>
                  {isAdmin ? 'Teacher / Admin' : `Class: ${currentUser.className || 'Unassigned'}`}
                </span>
              </div>
            </div>

            <button 
              className="btn btn-secondary btn-sm" 
              onClick={onQuickSwitch}
              title={`Switch view to ${isAdmin ? 'Student (Alex)' : 'Teacher (Prof. Jenkins)'}`}
            >
              <UserCheck size={14} />
              Switch to {isAdmin ? 'Student' : 'Teacher'}
            </button>
          </>
        )}

        <button 
          className="btn btn-secondary btn-icon" 
          onClick={toggleTheme}
          title="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {currentUser && (
          <button 
            className="btn btn-secondary btn-icon" 
            onClick={onLogout}
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
