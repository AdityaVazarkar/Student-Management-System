import React, { useState } from 'react';
import { 
  BookOpen, 
  Send, 
  CheckCircle, 
  Clock, 
  Award, 
  Calendar, 
  ExternalLink, 
  X, 
  Check, 
  FileText,
  User,
  Layers,
  Sparkles 
} from 'lucide-react';
import { api } from '../../services/api';

export default function StudentHomework({ 
  currentUser, 
  homeworkList = [], 
  studentSubmissions = [], 
  onRefresh, 
  showToast 
}) {
  const [filter, setFilter] = useState('ALL');

  // Submit Modal state
  const [selectedHw, setSelectedHw] = useState(null);
  const [solutionContent, setSolutionContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Map submissions by homeworkId
  const submissionMap = {};
  studentSubmissions.forEach((sub) => {
    submissionMap[sub.homeworkId] = sub;
  });

  // Filter homework
  const filteredHomework = homeworkList.filter((hw) => {
    const sub = submissionMap[hw.id];
    if (filter === 'PENDING') return !sub;
    if (filter === 'SUBMITTED') return sub && sub.status === 'SUBMITTED';
    if (filter === 'GRADED') return sub && sub.status === 'GRADED';
    return true;
  });

  const openSubmitModal = (hw) => {
    setSelectedHw(hw);
    const existing = submissionMap[hw.id];
    if (existing) {
      setSolutionContent(existing.content || '');
      setAttachmentUrl(existing.attachmentUrl || '');
    } else {
      setSolutionContent('');
      setAttachmentUrl('');
    }
  };

  const handleSubmitHomework = async (e) => {
    e.preventDefault();
    if (!selectedHw || !currentUser) return;
    if (!solutionContent.trim()) {
      showToast('Please enter your solution notes or answers', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitHomework({
        homeworkId: selectedHw.id,
        studentId: currentUser.id,
        content: solutionContent.trim(),
        attachmentUrl: attachmentUrl.trim(),
      });
      showToast('Homework submitted successfully to teacher!', 'success');
      setSelectedHw(null);
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to submit homework', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Student Profile Banner */}
      <div className="glass-card" style={{ marginBottom: '2rem', background: 'var(--accent-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="brand-icon" style={{ width: 54, height: 54, fontSize: '1.4rem' }}>
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>Welcome, {currentUser.name}</h2>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                <span className="badge badge-blue">Roll: {currentUser.rollNumber || 'STU-1001'}</span>
                <span className="badge badge-purple">
                  <Layers size={12} /> {currentUser.className || 'Grade 10 - Section A'}
                </span>
                <span className="badge badge-emerald">{currentUser.email}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--blue-text)' }}>
                {homeworkList.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Assigned</div>
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--emerald-text)' }}>
                {studentSubmissions.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Submitted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Title */}
      <div className="section-header">
        <div className="section-title">
          <h2>Assigned Homework</h2>
          <span className="section-badge">{filteredHomework.length} Available</span>
        </div>

        <div className="filter-bar" style={{ margin: 0 }}>
          <select 
            className="form-select" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Assignments</option>
            <option value="PENDING">Pending Submission</option>
            <option value="SUBMITTED">Submitted (Pending Review)</option>
            <option value="GRADED">Graded & Completed</option>
          </select>
        </div>
      </div>

      {/* Homework Grid */}
      <div className="homework-grid">
        {filteredHomework.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <CheckCircle size={48} color="#34d399" style={{ margin: '0 auto 1rem auto' }} />
            <h3>No homework found</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              You have no assignments matching this filter for your assigned class.
            </p>
          </div>
        ) : (
          filteredHomework.map((hw) => {
            const sub = submissionMap[hw.id];
            const isGraded = sub && sub.status === 'GRADED';
            const isSubmitted = sub && sub.status === 'SUBMITTED';

            return (
              <div key={hw.id} className="homework-card">
                <div>
                  <div className="hw-header">
                    <span className="badge badge-emerald">{hw.subject}</span>
                    {isGraded ? (
                      <span className="badge badge-emerald">
                        <CheckCircle size={12} /> Score: {sub.grade}/{hw.maxPoints} pts
                      </span>
                    ) : isSubmitted ? (
                      <span className="badge badge-amber">
                        <Clock size={12} /> Awaiting Grade
                      </span>
                    ) : (
                      <span className="badge badge-rose">
                        <Clock size={12} /> Not Submitted
                      </span>
                    )}
                  </div>

                  <h3 className="hw-title">{hw.title}</h3>
                  <p className="hw-description">{hw.description}</p>
                </div>

                <div>
                  <div className="hw-meta-list">
                    <div className="hw-meta-item">
                      <span>Due Date:</span>
                      <strong>{hw.dueDate || 'Flexible'}</strong>
                    </div>
                    <div className="hw-meta-item">
                      <span>Max Points:</span>
                      <strong>{hw.maxPoints} pts</strong>
                    </div>
                    <div className="hw-meta-item">
                      <span>Teacher:</span>
                      <span>{hw.teacherName || 'Faculty'}</span>
                    </div>
                  </div>

                  {/* If Graded, Show Teacher Feedback */}
                  {isGraded && (
                    <div style={{ 
                      padding: '0.75rem', 
                      background: 'var(--emerald-bg)', 
                      border: '1px solid var(--emerald-border)', 
                      borderRadius: 'var(--radius-md)', 
                      marginBottom: '1rem',
                      fontSize: '0.82rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--emerald-text)', fontWeight: 700, marginBottom: '0.25rem' }}>
                        <Award size={14} /> Teacher Remarks:
                      </div>
                      <p style={{ color: 'var(--text-main)', fontStyle: 'italic' }}>
                        "{sub.feedback || 'Great job on this assignment!'}"
                      </p>
                    </div>
                  )}

                  {/* Submission Action */}
                  <button
                    className={`btn ${isGraded ? 'btn-secondary' : isSubmitted ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ width: '100%' }}
                    onClick={() => openSubmitModal(hw)}
                  >
                    <Send size={15} />
                    {isGraded ? 'View Submission & Grade' : isSubmitted ? 'Update Submission' : 'Submit Homework'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submission Modal */}
      {selectedHw && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>{submissionMap[selectedHw.id] ? 'Review / Update Submission' : 'Submit Homework'}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedHw(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--bg-secondary)', 
              marginBottom: '1.25rem' 
            }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                {selectedHw.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                Subject: {selectedHw.subject} • Due: {selectedHw.dueDate} • Max: {selectedHw.maxPoints} pts
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                {selectedHw.description}
              </p>
            </div>

            {submissionMap[selectedHw.id]?.status === 'GRADED' && (
              <div style={{ 
                padding: '1rem', 
                borderRadius: 'var(--radius-md)', 
                background: 'var(--emerald-bg)', 
                border: '1px solid var(--emerald-border)',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--emerald-text)' }}>Official Teacher Evaluation</strong>
                  <span className="badge badge-emerald">Score: {submissionMap[selectedHw.id].grade}/{selectedHw.maxPoints}</span>
                </div>
                {submissionMap[selectedHw.id].feedback && (
                  <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', color: 'var(--text-main)' }}>
                    Remarks: "{submissionMap[selectedHw.id].feedback}"
                  </p>
                )}
              </div>
            )}

            <form onSubmit={handleSubmitHomework}>
              <div className="form-group">
                <label className="form-label">Your Solution Notes & Answers</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Type your detailed answers, calculations, code solution, or summary here..."
                  className="form-input form-textarea"
                  value={solutionContent}
                  onChange={(e) => setSolutionContent(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Attachment / Document Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or https://github.com/..."
                  className="form-input"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedHw(null)}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Send size={16} />
                  {submitting ? 'Submitting...' : submissionMap[selectedHw.id] ? 'Update Submission' : 'Submit Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
