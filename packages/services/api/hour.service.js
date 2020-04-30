import ApiService from './api.service';

class HourService {
  constructor() {
    this.request = ApiService;
  }

  getNonWorkingTime(start, end) {
    return this.request.get(`/server/nonworkingtime/${start}/${end}`);
  }
}

export default new HourService();
