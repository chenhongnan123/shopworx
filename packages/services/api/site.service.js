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
}

export default new SiteService();
