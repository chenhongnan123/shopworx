import ApiService from './api.service';

class CustomerService {
  constructor() {
    this.request = ApiService;
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
