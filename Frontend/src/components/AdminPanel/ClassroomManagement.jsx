import React, { useState } from 'react';
import { Layers, Plus, Trash2, X, Check, Users } from 'lucide-react';
import { api } from '../../services/api';

export default function ClassroomManagement({ 
  classes = [], 
  students = [], 
  onRefresh, 
  showToast 
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!className.trim()) return;
    setSaving(true);
    try {
      await api.createClass({
        name: className.trim(),
        section: section.trim(),
        description: description.trim(),
      });
      showToast(`Class "${className}" created!`, 'success');
      setIsCreateOpen(false);
      setClassName('');
      setSection('');
      setDescription('');
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to create classroom', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClass = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete class "${name}"?`)) return;
    try {
      await api.deleteClass(id);
      showToast(`Class "${name}" deleted`, 'info');
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to delete class', 'error');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <h2>Academic Classrooms & Sections</h2>
          <span className="section-badge">{classes.length} Classes</span>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} />
          Add New Class
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {classes.map((cls) => {
          const studentCount = students.filter(s => s.className === cls.name).length;
          return (
            <div key={cls.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ 
                      width: 38, 
                      height: 38, 
                      borderRadius: 'var(--radius-md)', 
                      background: 'rgba(168, 85, 247, 0.12)', 
                      color: '#c084fc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Layers size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem' }}>{cls.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Section: {cls.section || 'General'}
                      </span>
                    </div>
                  </div>

                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteClass(cls.id, cls.name)}
                    title="Delete Class"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', minHeight: '40px' }}>
                  {cls.description || 'Standard academic curriculum class section.'}
                </p>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '0.75rem 1rem', 
                background: 'var(--bg-secondary)', 
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)' }}>
                  <Users size={15} />
                  <span>Enrolled Students</span>
                </div>
                <strong>{studentCount} Students</strong>
              </div>
            </div>
          );
        })}
      </div>

      {isCreateOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Classroom</h3>
              <button className="modal-close-btn" onClick={() => setIsCreateOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateClass}>
              <div className="form-group">
                <label className="form-label">Class Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 11 - Computer Science"
                  className="form-input"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section Code</label>
                <input
                  type="text"
                  placeholder="e.g. 11-CS"
                  className="form-input"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Stream Info</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of syllabus or stream..."
                  className="form-input form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Check size={16} />
                  {saving ? 'Creating...' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
