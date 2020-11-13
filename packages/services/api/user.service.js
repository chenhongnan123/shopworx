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

  createAccess(payload) {
    return this.request.post('server/moduleaccess', payload);
  }
}

export default new UserService();
