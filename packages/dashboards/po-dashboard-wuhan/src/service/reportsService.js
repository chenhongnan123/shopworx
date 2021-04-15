import Service from '@/plugins/axios';

// const reqConfig = { timeout: 45000 };
const reqConfig = {};
// const base = '/server/executereport';

export default {
  getReport(base,reportName, customerId, userId, postData, queryParams, headers) {
    try {
      const query = queryParams || '';
      const url = `/server/${base}/${reportName}?customerid=${customerId}&userid=${userId}${query}`;
      return Service.post(url, postData, headers);
    } catch (e) {
      throw new Error(e);
    }
  },
  getElement(element, customerId, userId, queryParams, headers) {
    try {
      const query = queryParams || '';
      const url = `/server/elements/${element}/records?customerid=${customerId}&userid=${userId}${query}`;
      return Service.get(url, headers);
    } catch (e) {
      throw new Error(e);
    }
  },
  getServe(reportName, customerId, userId, queryParams, headers) {
    try {
      const query = queryParams || '';
      const url = `/server/${reportName}?customerid=${customerId}&userid=${userId}${query}`;
      return Service.get(url, headers);
    } catch (e) {
      throw new Error(e);
    }
  },
  postServe(reportName, customerId, userId, queryParams, payload, headers) {
    try {
      const query = queryParams || '';
      const url = `/server/${reportName}?customerid=${customerId}&userid=${userId}${query}`;
      return Service.post(url, payload, headers);
    } catch (e) {
      throw new Error(e);
    }
  },
  getJson(filename) {
    try {
      const url = filename;
      return Service.get(url, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
};
