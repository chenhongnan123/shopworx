import ApiService from './api.service';

class HourService {
  constructor() {
    this.request = ApiService;
  }

  getNonWorkingTime(start, end) {
    return this.request.get(`/server/getnonworkingtime?starttime=${start}&endtime=${end}`);
  }

  getPlanEndTime(start, duration) {
    return this.request.get(`/server/getplanendtime?starttime=${start}&duration=${duration}`);
  }
}

export default new HourService();
