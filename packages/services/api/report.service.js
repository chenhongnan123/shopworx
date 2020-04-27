import ApiService from './api.service';

class ReportService {
  constructor() {
    this.request = ApiService;
  }

  executeReport(reportName, payload) {
    return this.request.post(`/server/executeReport/${reportName}`, payload);
  }
}

export default new ReportService();
