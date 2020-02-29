import ApiService from './api.service';

class CustomerService {
  constructor() {
    this.request = ApiService;
  }

  completeOnboarding(siteId) {
    return this.request.get(`/server/sites/${siteId}/onboardingcompleted/true`);
  }
}

export default new CustomerService();
