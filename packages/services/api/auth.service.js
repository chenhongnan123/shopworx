import ApiService from './api.service';

class AuthService {
  constructor() {
    this.request = ApiService;
  }

  authenticate(data) {
    return this.request.post('/server/authenticate', data);
  }

  authenticateOriginUser(data) {
    return this.request.post('/server/authenticatesuperuser', data);
  }

  authenticateWithOtp(data) {
    return this.request.post('/server/authenticatewithotp', data);
  }

  generateOtp(data) {
    return this.request.post('/server/otp/generate', data);
  }

  resetPassword(data) {
    return this.request.post('/server/users/resetuserpassword', data);
  }

  logout() {
    return this.request.get('/server/logout');
  }
}

export default new AuthService();
