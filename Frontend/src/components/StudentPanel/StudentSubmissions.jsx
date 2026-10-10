import React from 'react';
import { CheckCircle, Clock, Award, ExternalLink, Calendar, FileText } from 'lucide-react';

export default function StudentSubmissions({ submissions = [] }) {
  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <h2>My Submission History & Grades</h2>
          <span className="section-badge">{submissions.length} Submissions</span>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <FileText size={48} color="var(--text-dim)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No submissions yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            When you complete and submit homework, your submissions and grades will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {submissions.map((sub) => (
            <div key={sub.id} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{sub.homeworkTitle}</h3>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    <span>Submitted on: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Class: {sub.studentClass}</span>
                  </div>
                </div>

                {sub.status === 'GRADED' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.9rem', padding: '0.4rem 0.85rem' }}>
                      <Award size={16} /> Score: {sub.grade} pts
                    </span>
                  </div>
                ) : (
                  <span className="badge badge-amber" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                    <Clock size={14} /> Under Teacher Review
                  </span>
                )}
              </div>

              {/* Student's answer */}
              <div style={{ 
                padding: '0.85rem 1rem', 
                borderRadius: 'var(--radius-md)', 
                background: 'var(--bg-secondary)', 
                fontSize: '0.875rem',
                lineHeight: 1.6,
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Submitted Answer:
                </div>
                <p>{sub.content}</p>

                {sub.attachmentUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <a 
                      href={sub.attachmentUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="badge badge-blue" 
                      style={{ textDecoration: 'none' }}
                    >
                      <ExternalLink size={12} /> Solution Link: {sub.attachmentUrl}
                    </a>
                  </div>
                )}
              </div>

              {/* Feedback */}
              {sub.status === 'GRADED' && (
                <div style={{ 
                  padding: '0.85rem 1rem', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'var(--emerald-bg)', 
                  border: '1px solid var(--emerald-border)',
                  fontSize: '0.875rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald-text)', fontWeight: 700, marginBottom: '0.2rem' }}>
                    <CheckCircle size={15} /> Teacher Feedback & Remarks:
                  </div>
                  <p style={{ color: 'var(--text-main)', fontStyle: 'italic' }}>
                    "{sub.feedback || 'Good effort and completed requirements.'}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
