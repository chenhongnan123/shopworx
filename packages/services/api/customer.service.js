import ApiService from './api.service';

class CustomerService {
  constructor() {
    this.request = ApiService;
  }

  addCustomer(payload) {
    return this.request.post('/server/customer', payload);
  }

  addSite(siteName, payload) {
    return this.request.post(`/server/sites/${siteName}`, payload);
  }

  getCustomers() {
    return this.request.get('/server/customer');
  }

  getCustomerSites(customerId) {
    return this.request.get(`/server/sites/customer/${customerId}`);
  }

  setActiveCustomer(customerId) {
    return this.request.get(`/server/customer/setactive/${customerId}`);
  }

  setActiveSite(siteId) {
    return this.request.get(`/server/sites/setactive/${siteId}`);
  }
}

export default new CustomerService();
