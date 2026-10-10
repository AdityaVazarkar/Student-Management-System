// fixtures/student-api.fixture.js
const { getEnvironment } = require('../config/environments');
const thresholds = require('../config/thresholds');

const env = getEnvironment();

class StudentApiClient {
  constructor(requestContext) {
    this.request = requestContext;
    this.baseUrl = env.apiUrl;
  }

  async timedRequest(method, endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const start = Date.now();

    let response;
    if (method.toUpperCase() === 'GET') {
      response = await this.request.get(url, options);
    } else if (method.toUpperCase() === 'POST') {
      response = await this.request.post(url, options);
    } else if (method.toUpperCase() === 'PUT') {
      response = await this.request.put(url, options);
    } else if (method.toUpperCase() === 'DELETE') {
      response = await this.request.delete(url, options);
    } else {
      throw new Error(`Unsupported method: ${method}`);
    }

    const durationMs = Date.now() - start;
    return {
      response,
      status: response.status(),
      durationMs,
      data: async () => {
        try {
          return await response.json();
        } catch {
          return await response.text();
        }
      },
    };
  }

  async getHealth() {
    return this.timedRequest('GET', '/v1/students/health');
  }

  async getAllStudents() {
    return this.timedRequest('GET', '/v1/students');
  }

  async getStudentById(id) {
    return this.timedRequest('GET', `/v1/students/${id}`);
  }

  async createStudent(studentData) {
    return this.timedRequest('POST', '/v1/students', {
      data: studentData,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async updateStudent(id, studentData) {
    return this.timedRequest('PUT', `/v1/students/${id}`, {
      data: studentData,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async deleteStudent(id) {
    return this.timedRequest('DELETE', `/v1/students/${id}`);
  }

  async getDynamicRoutes() {
    return this.timedRequest('GET', '/system/routes');
  }
}

module.exports = {
  StudentApiClient,
};
