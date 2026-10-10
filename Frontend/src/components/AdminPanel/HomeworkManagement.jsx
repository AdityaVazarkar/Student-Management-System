import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Award, 
  Layers, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  FileText,
  AlertTriangle 
} from 'lucide-react';
import { api } from '../../services/api';

export default function HomeworkManagement({ 
  homeworkList = [], 
  classes = [], 
  currentUser, 
  onRefresh, 
  showToast,
  isCreateOpen,
  setIsCreateOpen 
}) {
  const [editingHomework, setEditingHomework] = useState(null);
  const [deleteConfirmHw, setDeleteConfirmHw] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    targetClass: 'ALL',
    dueDate: '',
    maxPoints: 100,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      targetClass: 'ALL',
      dueDate: '',
      maxPoints: 100,
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createHomework({
        ...formData,
        teacherName: currentUser?.name || 'Prof. Sarah Jenkins',
      });
      showToast('Homework assignment published successfully!', 'success');
      setIsCreateOpen(false);
      resetForm();
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to create homework', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (hw) => {
    setEditingHomework(hw);
    setFormData({
      title: hw.title || '',
      description: hw.description || '',
      subject: hw.subject || '',
      targetClass: hw.targetClass || 'ALL',
      dueDate: hw.dueDate || '',
      maxPoints: hw.maxPoints || 100,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingHomework) return;
    setSaving(true);
    try {
      await api.updateHomework(editingHomework.id, formData);
      showToast('Homework updated successfully!', 'success');
      setEditingHomework(null);
      resetForm();
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to update homework', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteConfirmHw) return;
    setSaving(true);
    try {
      await api.deleteHomework(deleteConfirmHw.id);
      showToast('Homework deleted successfully', 'info');
      setDeleteConfirmHw(null);
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to delete homework', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <h2>Homework & Assignments</h2>
          <span className="section-badge">{homeworkList.length} Assignments</span>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
        >
          <Plus size={16} />
          Create New Homework
        </button>
      </div>

      {/* Homework Grid */}
      <div className="homework-grid">
        {homeworkList.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <FileText size={48} color="var(--text-dim)" style={{ margin: '0 auto 1rem auto' }} />
            <h3>No assignments created yet</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Create your first homework to distribute tasks to students in their respective classes.
            </p>
          </div>
        ) : (
          homeworkList.map((hw) => (
            <div key={hw.id} className="homework-card">
              <div>
                <div className="hw-header">
                  <span className="badge badge-emerald">{hw.subject}</span>
                  <span className={`badge ${hw.targetClass === 'ALL' ? 'badge-blue' : 'badge-purple'}`}>
                    <Layers size={12} /> {hw.targetClass}
                  </span>
                </div>

                <h3 className="hw-title">{hw.title}</h3>
                <p className="hw-description">{hw.description}</p>
              </div>

              <div>
                <div className="hw-meta-list">
                  <div className="hw-meta-item">
                    <span>Due Date:</span>
                    <strong>{hw.dueDate || 'No deadline'}</strong>
                  </div>
                  <div className="hw-meta-item">
                    <span>Max Score:</span>
                    <strong>{hw.maxPoints} Points</strong>
                  </div>
                  <div className="hw-meta-item">
                    <span>Assigned By:</span>
                    <span>{hw.teacherName || 'Teacher'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => openEditModal(hw)}
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => setDeleteConfirmHw(hw)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 1. Modal: Create Homework */}
      {isCreateOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Homework</h3>
              <button className="modal-close-btn" onClick={() => setIsCreateOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Homework Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calculus: Limits & Continuity Problem Set"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics, Physics..."
                    className="form-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Class</label>
                  <select
                    className="form-select"
                    value={formData.targetClass}
                    onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                  >
                    <option value="ALL">All Classes (General)</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Maximum Points</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    className="form-input"
                    value={formData.maxPoints}
                    onChange={(e) => setFormData({ ...formData, maxPoints: parseInt(e.target.value) || 100 })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Assignment Instructions</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Specify problem numbers, required methods, and submission format..."
                  className="form-input form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={saving}
                >
                  <Check size={16} />
                  {saving ? 'Publishing...' : 'Publish Homework'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Edit Homework */}
      {editingHomework && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Homework</h3>
              <button className="modal-close-btn" onClick={() => setEditingHomework(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Homework Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Class</label>
                  <select
                    className="form-select"
                    value={formData.targetClass}
                    onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                  >
                    <option value="ALL">All Classes (General)</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Maximum Points</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    className="form-input"
                    value={formData.maxPoints}
                    onChange={(e) => setFormData({ ...formData, maxPoints: parseInt(e.target.value) || 100 })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Instructions</label>
                <textarea
                  required
                  rows={4}
                  className="form-input form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setEditingHomework(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={saving}
                >
                  <Check size={16} />
                  {saving ? 'Updating...' : 'Update Homework'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Delete Homework Confirmation */}
      {deleteConfirmHw && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ 
                width: 52, 
                height: 52, 
                borderRadius: '50%', 
                background: 'var(--rose-bg)', 
                color: 'var(--rose-text)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <AlertTriangle size={28} />
              </div>
              <h3>Delete Assignment</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Are you sure you want to delete <strong>{deleteConfirmHw.title}</strong>? All student submissions for this homework will also be deleted.
              </p>
            </div>

            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setDeleteConfirmHw(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                disabled={saving}
                onClick={handleDeleteSubmit}
              >
                {saving ? 'Deleting...' : 'Yes, Delete Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
