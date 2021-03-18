import ApiService from './api.service';

class SiteService {
  constructor() {
    this.request = ApiService;
  }

  completeOnboarding(siteId) {
    return this.request.get(`/server/sites/${siteId}/onboardingcompleted/true`);
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
}

export default new SiteService();
