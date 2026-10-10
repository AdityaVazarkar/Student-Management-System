import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Edit3, 
  Trash2, 
  BookmarkCheck, 
  X, 
  Phone, 
  Mail, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { api } from '../../services/api';

export default function StudentManagement({ 
  students = [], 
  classes = [], 
  onRefresh, 
  showToast 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');

  // Modals state
  const [assignModalStudent, setAssignModalStudent] = useState(null);
  const [targetClass, setTargetClass] = useState('');

  const [editModalStudent, setEditModalStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    phone: '',
    className: '',
  });

  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState(null);
  const [saving, setSaving] = useState(false);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClassFilter ? s.className === selectedClassFilter : true;
    return matchesSearch && matchesClass;
  });

  // Assign Class Handlers
  const openAssignModal = (student) => {
    setAssignModalStudent(student);
    setTargetClass(student.className || (classes[0]?.name || 'Grade 10 - Section A'));
  };

  const handleSaveClassAssignment = async () => {
    if (!assignModalStudent) return;
    setSaving(true);
    try {
      await api.assignClass(assignModalStudent.id, targetClass);
      showToast(`Assigned ${assignModalStudent.name} to ${targetClass}`, 'success');
      setAssignModalStudent(null);
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to assign class', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Edit Student Handlers
  const openEditModal = (student) => {
    setEditModalStudent(student);
    setEditFormData({
      name: student.name || '',
      email: student.email || '',
      rollNumber: student.rollNumber || '',
      phone: student.phone || '',
      className: student.className || '',
    });
  };

  const handleSaveStudentEdit = async (e) => {
    e.preventDefault();
    if (!editModalStudent) return;
    setSaving(true);
    try {
      await api.updateStudent(editModalStudent.id, editFormData);
      showToast(`Updated student profile for ${editFormData.name}`, 'success');
      setEditModalStudent(null);
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to update student', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Student Handlers
  const handleDeleteStudent = async () => {
    if (!deleteConfirmStudent) return;
    setSaving(true);
    try {
      await api.deleteStudent(deleteConfirmStudent.id);
      showToast(`Deleted student ${deleteConfirmStudent.name}`, 'info');
      setDeleteConfirmStudent(null);
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to delete student', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <h2>Student Management</h2>
          <span className="section-badge">{filteredStudents.length} Students</span>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by student name, roll number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          value={selectedClassFilter}
          onChange={(e) => setSelectedClassFilter(e.target.value)}
        >
          <option value="">All Classes & Sections</option>
          {classes.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
          <option value="Unassigned">Unassigned</option>
        </select>
      </div>

      {/* Student Table */}
      <div className="table-responsive">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Student Details</th>
              <th>Roll Number</th>
              <th>Current Class</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                  No students found matching current filters.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="user-avatar" style={{ width: 36, height: 36 }}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{student.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-blue">
                      {student.rollNumber || 'STU-000'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${student.className && student.className !== 'Unassigned' ? 'badge-purple' : 'badge-amber'}`}>
                      {student.className || 'Unassigned'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {student.phone ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Phone size={12} /> {student.phone}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>No phone</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {/* Assign Class Button */}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openAssignModal(student)}
                        title="Assign or Change Student Class"
                      >
                        <BookmarkCheck size={14} />
                        Assign Class
                      </button>

                      {/* Edit Student Button */}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(student)}
                        title="Edit Student Info"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      {/* Delete Student Button */}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteConfirmStudent(student)}
                        title="Delete Student"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 1. Modal: Assign Class */}
      {assignModalStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Assign Student to Class</h3>
              <button className="modal-close-btn" onClick={() => setAssignModalStudent(null)}>
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Assign <strong>{assignModalStudent.name}</strong> (Roll: {assignModalStudent.rollNumber}) to a classroom batch or section:
            </p>

            <div className="form-group">
              <label className="form-label">Select Classroom</label>
              <select
                className="form-select"
                style={{ width: '100%' }}
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setAssignModalStudent(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                disabled={saving}
                onClick={handleSaveClassAssignment}
              >
                <Check size={16} />
                {saving ? 'Saving...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Edit Student */}
      {editModalStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Student Details</h3>
              <button className="modal-close-btn" onClick={() => setEditModalStudent(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStudentEdit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editFormData.rollNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, rollNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Class</label>
                  <select
                    className="form-select"
                    value={editFormData.className}
                    onChange={(e) => setEditFormData({ ...editFormData, className: e.target.value })}
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setEditModalStudent(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={saving}
                >
                  <Check size={16} />
                  {saving ? 'Updating...' : 'Update Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Delete Confirmation */}
      {deleteConfirmStudent && (
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
              <h3>Confirm Deletion</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Are you sure you want to delete student <strong>{deleteConfirmStudent.name}</strong>? 
                This action will also remove all their submissions.
              </p>
            </div>

            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setDeleteConfirmStudent(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                disabled={saving}
                onClick={handleDeleteStudent}
              >
                {saving ? 'Deleting...' : 'Yes, Delete Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
