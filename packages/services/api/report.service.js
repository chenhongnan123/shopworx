import ApiService from './api.service';

class ReportService {
  constructor() {
    this.request = ApiService;
  }

  executeReport(reportName, payload) {
    return this.request.post(`/server/executereport/${reportName}/?all=false`, payload);
  }

  getReportViews(reportCategoryId) {
    return this.request.get(`/server/reportview/reportscategory/${reportCategoryId}`);
  }

  createReportView(payload) {
    return this.request.post('/server/reportview', payload);
  }

  updateReportView(payload) {
    return this.request.put('/server/reportview', payload);
  }

  getReportMappings(reportViewId) {
    return this.request.get(`/server/reportviewmapping/reportview/${reportViewId}`);
  }

  getInsightCategories() {
    return this.request.get(`/server/insightcategory`);
  }
  
  getInsightViews(insightCategoryId, parentId = 0) {
    return this.request.get(`/server/insightview/${insightCategoryId}/${parentId}`);
  }
}

export default new ReportService();
