import ApiService from './api.service';

class HourService {
  constructor() {
    this.request = ApiService;
  }

  getNonWorkingTime(start, end) {
    return this.request.get(`/server/getnonworkingtime?starttime=${start}&endtime=${end}`);
  }
}

export default new HourService();
