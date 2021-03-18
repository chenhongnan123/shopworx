import ApiService from './api.service';

class UserService {
  constructor() {
    this.request = ApiService;
  }

  getMe() {
    return this.request.get('/server/users/mydetails');
  }

  getSolution() {
    return this.request.get('/server/solution');
  }

  updateUser(payload) {
    return this.request.put('/server/users', payload);
  }

  activateUser(id) {
    return this.request.get(`/server/users/activate/${id}`);
  }

  deactivateUser(id) {
    return this.request.get(`/server/users/deactivate/${id}`);
  }

  updatePassword(payload) {
    return this.request.put('/server/users/updatepassword', payload);
  }

  inviteUsers(payload) {
    return this.request.post('/server/users', payload);
  }

  resendInvitation(payload) {
    return this.request.post('/server/users/invite', payload);
  }

  setUserSite(id) {
    return this.request.get(`/server/sites/setactive/${id}`);
  }

  getRoles() {
    return this.request.get('/server/role');
  }

  createRole(payload) {
    return this.request.post('/server/role', payload);
  }

  updateRole(payload) {
    return this.request.put('/server/role', payload);
  }

  updateUserRole(userId, roleId) {
    return this.request.put(`/server/users/${userId}/${roleId}`);
  }

  getUsers() {
    return this.request.get('/server/users');
  }

  deleteModuleAccess(roleId) {
    return this.request.delete(`/server/moduleaccess?roleId=${roleId}`);
  }

  deleteWebAppAccess(roleId) {
    return this.request.delete(`/server/webappaccess?roleId=${roleId}`);
  }

  deleteReportsCategoryAccess(roleId) {
    return this.request.delete(`/server/reportscategoryaccess?roleId=${roleId}`);
  }

  deleteReportAccess(roleId) {
    return this.request.delete(`/server/reportaccess?roleId=${roleId}`);
  }

  deleteReportViewAccess(roleId) {
    return this.request.delete(`/server/reportviewaccess/${roleId}`);
  }

  createElementAccess(payload) {
    return this.request.post('/server/elementaccess', payload);
  }

  createSolutionAccess(payload) {
    return this.request.post('/server/solutionaccess', payload);
  }

  createModuleAccess(payload) {
    return this.request.post('/server/moduleaccess', payload);
  }

  createReportAccess(payload) {
    return this.request.post('/server/reportaccess', payload);
  }

  createReportsCategoryAccess(payload) {
    return this.request.post('/server/reportscategoryaccess', payload);
  }

  createReportViewAccess(payload) {
    return this.request.post('/server/reportviewaccess', payload);
  }
}

export default new UserService();
