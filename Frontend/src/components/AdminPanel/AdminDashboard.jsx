import React from 'react';
import { 
  Users, 
  Layers, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Plus, 
  ArrowRight,
  Award
} from 'lucide-react';

export default function AdminDashboard({ 
  stats, 
  students = [], 
  homeworkList = [], 
  submissions = [], 
  setActiveTab,
  onOpenCreateHomework 
}) {
  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Teacher Control Center</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage student class assignments, homework distribution, and grade student submissions.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={onOpenCreateHomework}>
            <Plus size={16} />
            Create Homework
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="stat-grid">
        <div className="glass-card stat-card" style={{ '--stat-glow': 'rgba(99, 102, 241, 0.2)' }}>
          <div className="stat-icon" style={{ background: 'var(--blue-bg)', color: 'var(--blue-text)' }}>
            <Users size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalStudents || students.length || 0}</span>
            <span className="stat-label">Enrolled Students</span>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ '--stat-glow': 'rgba(168, 85, 247, 0.2)' }}>
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc' }}>
            <Layers size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalClasses || 4}</span>
            <span className="stat-label">Active Classes</span>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ '--stat-glow': 'rgba(234, 179, 8, 0.2)' }}>
          <div className="stat-icon" style={{ background: 'var(--amber-bg)', color: 'var(--amber-text)' }}>
            <BookOpen size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalHomework || homeworkList.length || 0}</span>
            <span className="stat-label">Assignments Published</span>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ '--stat-glow': 'rgba(244, 63, 94, 0.2)' }}>
          <div className="stat-icon" style={{ background: 'var(--rose-bg)', color: 'var(--rose-text)' }}>
            <Clock size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.pendingSubmissions || 0}</span>
            <span className="stat-label">Awaiting Teacher Grading</span>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        
        {/* Quick Students & Classes Overview */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3>Recent Student Registrations</h3>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setActiveTab('students')}
            >
              Manage All Students
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {students.slice(0, 4).map((student) => (
              <div 
                key={student.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '0.75rem 1rem', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: 'var(--radius-md)' 
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{student.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Roll: {student.rollNumber || 'N/A'} • {student.email}
                  </div>
                </div>
                <span className="badge badge-purple">
                  {student.className || 'Unassigned'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Submissions To Grade */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3>Pending Homework Reviews</h3>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setActiveTab('submissions')}
            >
              Open Grading Panel
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {submissions.filter(s => s.status === 'SUBMITTED').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)' }}>
                <CheckCircle size={36} color="#34d399" style={{ margin: '0 auto 0.5rem auto' }} />
                <p>All student homework submissions have been graded!</p>
              </div>
            ) : (
              submissions.filter(s => s.status === 'SUBMITTED').slice(0, 4).map((sub) => (
                <div 
                  key={sub.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '0.75rem 1rem', 
                    background: 'var(--bg-secondary)', 
                    borderRadius: 'var(--radius-md)' 
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sub.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {sub.homeworkTitle} • Class: {sub.studentClass}
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => setActiveTab('submissions')}
                  >
                    <Award size={14} />
                    Grade Now
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
