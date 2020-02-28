import Cookies from 'js-cookie';

class SessionService {
  getSession() {
    return Cookies.get('sessionId');
  }

  setSession(session) {
    return Cookies.set('sessionId', session, { path: '/' });
  }

  removeSession() {
    return Cookies.remove('sessionId');
  }
}

export default new SessionService();
