import axios from 'axios';
import ApiService from './api.service';

let source = null;
class AuthService {
  constructor() {
    this.request = ApiService;
  }

  authenticate(data) {
    return this.request.post('/server/authenticate', data);
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

  getServerTime(sessionId) {
    const { CancelToken } = axios;
    source = CancelToken.source();
    // eslint-disable-next-line
    const id = setTimeout(() => {
      source.cancel('timeout');
    }, 3000);
    return axios
      .get('/server/servertime', {
        headers: {
          sessionId,
        },
        cancelToken: source.token
      })
      .then((res) => {
        // eslint-disable-next-line
        clearTimeout(id);
        return res;
      });
  }

  logout() {
    return this.request.get('/server/logout');
  }
}

export default new AuthService();
