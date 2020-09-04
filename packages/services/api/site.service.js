import ApiService from './api.service';

class SiteService {
  constructor() {
    this.request = ApiService;
  }

  completeOnboarding(siteId) {
    return this.request.get(`/server/sites/${siteId}/onboardingcompleted/true`);
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

  getMasterSolutions() {
    return this.request.get('/server/solution/getallforsite');
  }
}

export default new SiteService();
