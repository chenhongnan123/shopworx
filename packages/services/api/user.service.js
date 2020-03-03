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
  
  isUsernameAvailable(username) {
    return this.request.get(`/server/users/isUsernameAvailable/${username}`);
  }

  getUserById(id) {
    return this.request.get(`/server/users/${id}`);
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
}

export default new UserService();