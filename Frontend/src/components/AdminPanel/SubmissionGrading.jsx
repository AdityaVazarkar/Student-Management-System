import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Award, 
  ExternalLink, 
  Search, 
  X, 
  Check, 
  MessageSquare,
  FileCheck 
} from 'lucide-react';
import { api } from '../../services/api';

export default function SubmissionGrading({ 
  submissions = [], 
  onRefresh, 
  showToast 
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Grading modal state
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeScore, setGradeScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  // Filter submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchesStatus = 
      filterStatus === 'ALL' ? true : s.status === filterStatus;
    const matchesSearch = 
      s.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.homeworkTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentRollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openGradeModal = (sub) => {
    setSelectedSubmission(sub);
    setGradeScore(sub.grade !== null && sub.grade !== undefined ? sub.grade : '');
    setFeedback(sub.feedback || '');
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    setSaving(true);
    try {
      await api.gradeSubmission(selectedSubmission.id, {
        grade: parseInt(gradeScore, 10),
        feedback: feedback.trim(),
      });
      showToast(`Submission graded for ${selectedSubmission.studentName}!`, 'success');
      setSelectedSubmission(null);
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to grade submission', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <h2>Student Submissions & Grading</h2>
          <span className="section-badge">{filteredSubmissions.length} Submissions</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by student name, roll number, or assignment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">All Submission Statuses</option>
          <option value="SUBMITTED">Pending Teacher Grade</option>
          <option value="GRADED">Graded & Completed</option>
        </select>
      </div>

      {/* Submissions Table */}
      <div className="table-responsive">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Assignment</th>
              <th>Submitted On</th>
              <th>Status & Score</th>
              <th>Feedback</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                  No student homework submissions found.
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600 }}>{sub.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Roll: {sub.studentRollNumber} • {sub.studentClass}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{sub.homeworkTitle}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'Recent'}
                    </div>
                  </td>
                  <td>
                    {sub.status === 'GRADED' ? (
                      <span className="badge badge-emerald">
                        <CheckCircle size={12} />
                        Score: {sub.grade} pts
                      </span>
                    ) : (
                      <span className="badge badge-amber">
                        <Clock size={12} />
                        Pending Review
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', maxWidth: '240px', color: 'var(--text-muted)' }}>
                      {sub.feedback ? (
                        <span style={{ fontStyle: 'italic' }}>"{sub.feedback}"</span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>No feedback yet</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openGradeModal(sub)}
                    >
                      <Award size={14} />
                      {sub.status === 'GRADED' ? 'Edit Grade' : 'Grade Work'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Grade Submission Modal */}
      {selectedSubmission && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>Grade Student Submission</h3>
              <button className="modal-close-btn" onClick={() => setSelectedSubmission(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--bg-secondary)', 
              marginBottom: '1.25rem' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>{selectedSubmission.studentName}</strong>
                <span className="badge badge-purple">{selectedSubmission.studentClass}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                Homework: <strong>{selectedSubmission.homeworkTitle}</strong>
              </div>
            </div>

            {/* Student's answer content */}
            <div className="form-group">
              <label className="form-label">Student Submission Content:</label>
              <div style={{ 
                padding: '1rem', 
                borderRadius: 'var(--radius-md)', 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid var(--bg-glass-border)',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                maxHeight: '180px',
                overflowY: 'auto'
              }}>
                {selectedSubmission.content}
              </div>
            </div>

            {selectedSubmission.attachmentUrl && (
              <div style={{ marginBottom: '1.25rem' }}>
                <a 
                  href={selectedSubmission.attachmentUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="badge badge-blue"
                  style={{ textDecoration: 'none' }}
                >
                  <ExternalLink size={12} />
                  View Student Link / File: {selectedSubmission.attachmentUrl}
                </a>
              </div>
            )}

            <form onSubmit={handleGradeSubmit}>
              <div className="form-group">
                <label className="form-label">Awarded Score / Marks</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="500"
                  placeholder="e.g. 95"
                  className="form-input"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teacher Feedback & Comments</label>
                <textarea
                  rows={3}
                  placeholder="Provide personalized remarks, strengths, or suggestions for improvement..."
                  className="form-input form-textarea"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedSubmission(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={saving}
                >
                  <Check size={16} />
                  {saving ? 'Saving...' : 'Submit Grade & Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
