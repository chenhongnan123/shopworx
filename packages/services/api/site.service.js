import ApiService from './api.service';

class SiteService {
  constructor() {
    this.request = ApiService;
  }

  completeOnboarding(siteId) {
    return this.request.get(`/server/sites/${siteId}/onboardingcompleted/true`);
  }

  addSmsProvider(payload) {
    return this.request.post('/server/smsprovider', payload);
  }

  addWebapp(payload) {
    return this.request.post('/server/webapp', payload);
  }

  addReport(payload) {
    return this.request.post('/server/addreport', payload);
  }

  addReportView(payload) {
    return this.request.post('/server/reportview', payload);
  }

  addReportViewMapping(payload) {
    return this.request.post('/server/reportviewmapping', payload);
  }

  addInsightView(payload) {
    return this.request.post('/server/insightview', payload);
  }

  addLicense(payload) {
    return this.request.post('/server/customerlicense', payload);
  }

  getLicense(customerId, siteId) {
    return this.request.get(`/server/customerlicense/${customerId}/${siteId}`);
  }

  getApp(roleId, appId) {
    return this.request.get(`/server/webappaccess/${roleId}/${appId}`);
  }

  getBusinessTime(timestamp) {
    return this.request.get(`/server/businesstime/?timestamp=${timestamp}`);
  }

  getBusinessHours() {
    return this.request.get('/server/elements/getbusinesshours');
  }

  getMasterSolutions() {
    return this.request.get('/server/solution/getallforsite');
  }

  getReports() {
    return this.request.get('/server/reports?withFilters=false');
  }

  getWebApps() {
    return this.request.get('/server/webapp');
  }

  getInsights() {
    return this.request.get('/server/insightview');
  }
}

export default new SiteService();
