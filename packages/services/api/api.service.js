import axios from 'axios';

class ApiService {
  constructor() {
    this.instance = axios.create({
      baseURL: '',
    });
  }

  setHeader(session) {
    this.instance.defaults.headers.common.sessionId = session;
  }

  removeHeader() {
    this.instance.defaults.headers.common = {}
  }

  request(method, url, data = {}, config = {}) {
    return this.instance({
      method,
      url,
      data,
      config,
    });
  }

  getAxiosInstance() {
    return axios;
  }

  get(url, config = {}) {
    return this.request('GET', url, {}, config);
  }

  post(url, data, config = {}) {
    return this.request('POST', url, data, config);
  }

  put(url, data, config = {}) {
    return this.request('PUT', url, data, config);
  }

  patch(url, data, config = {}) {
    return this.request('PATCH', url, data, config);
  }

  delete(url, config = {}) {
    return this.request('DELETE', url, {}, config);
  }
}

export default new ApiService();
