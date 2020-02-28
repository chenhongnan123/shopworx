import ApiService from './api.service';

class ReportService {
  constructor() {
    this.request = ApiService;
    this.call = null;
  }

  getReportFilters(reportName) {
    return this.request.get(`/server/reportwithfilters/${reportName}`);
  }

  executeReport(reportName, payload = { startdate: 1548613800000, enddate: 1580454556876 }) {
    if (this.call) {
      this.call.source.cancel('Only one request allowed at a time.');
    }
    const axios = ApiService.getAxiosInstance();
    this.call = {
      source: axios.CancelToken.source(),
      report: reportName,
    };
    return this.request.post(
      `/server/executereport/${reportName}?all=false`,
      payload,
      { cancelToken: this.call.token },
    );
  }
}

export default new ReportService();
