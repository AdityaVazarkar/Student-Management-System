const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'http://localhost:8080/api';


async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // response wasn't JSON
    }
    throw new Error(errorMessage);
  }

  // Check if response is empty
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  register: (studentData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(studentData),
  }),

  // Dashboard Stats
  getStats: () => request('/dashboard/stats'),

  // Students
  getStudents: (className = '') => {
    const query = className ? `?className=${encodeURIComponent(className)}` : '';
    return request(`/students${query}`);
  },

  getStudentById: (id) => request(`/students/${id}`),

  updateStudent: (id, data) => request(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  assignClass: (id, className) => request(`/students/${id}/assign-class`, {
    method: 'PATCH',
    body: JSON.stringify({ className }),
  }),

  deleteStudent: (id) => request(`/students/${id}`, {
    method: 'DELETE',
  }),

  // Classrooms
  getClasses: () => request('/classes'),

  createClass: (data) => request('/classes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  deleteClass: (id) => request(`/classes/${id}`, {
    method: 'DELETE',
  }),

  // Homework
  getAllHomework: () => request('/homework'),

  getHomeworkForClass: (className) => request(`/homework/class/${encodeURIComponent(className)}`),

  getHomeworkById: (id) => request(`/homework/${id}`),

  createHomework: (data) => request('/homework', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateHomework: (id, data) => request(`/homework/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  deleteHomework: (id) => request(`/homework/${id}`, {
    method: 'DELETE',
  }),

  // Submissions
  submitHomework: (data) => request('/submissions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getAllSubmissions: () => request('/submissions'),

  getStudentSubmissions: (studentId) => request(`/submissions/student/${studentId}`),

  getHomeworkSubmissions: (homeworkId) => request(`/submissions/homework/${homeworkId}`),

  gradeSubmission: (id, gradeData) => request(`/submissions/${id}/grade`, {
    method: 'PUT',
    body: JSON.stringify(gradeData),
  }),
};
