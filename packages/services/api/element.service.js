import ApiService from './api.service';

class ElementService {
  constructor() {
    this.request = ApiService;
  }

  getElement(elementName) {
    return this.request.get(`/server/elements/${elementName}`);
  }
  
  getElementsBySite(id) {
    return this.request.get(`/server/elements/site/${id}`);
  }

  getRecordsByTags(elementName, queryParam, request) {
    return this.request.post(`/server/elements/${elementName}/getrecords${queryParam}`, request);
  }

  createElement(payload) {
    return this.request.post('/server/elements', payload);
  }

  createElementTags(data) {
    return this.request.post('/server/tag/addmultiple', data);
  }
  
  postBulkRecords(elementName, payload) {
    return this.request.post(`/server/elements/${elementName}/createbulkrecords`, payload);
  }
  
  postRecord(elementName, payload) {
    return this.request.post(`/server/elements/${elementName}/records`, payload);
  }

  createWebhook(payload) {
    return this.request.post(`/server/webhook`, payload);
  }

  sendTestModel(payload) {
    return this.request.post(payload.url, payload.payload);
  }

  uploadFiles(elementName, payload) {
    return this.request.post(`/server/uploadfile/${payload.filecontent}/${payload.filename}?elementName=${elementName}&extension=${payload.fileextension}&assetId=${payload.assetid}`, '');
  }

  downloadData(queryParam, payload) {
    return this.request.post(`/server/data/download${queryParam}`, payload);
  }
  
  getRecords(elementName, queryParam) {
    return this.request.get(`/server/elements/${elementName}/records${queryParam}`);
  }
  
  getCollectionRecords(collectionName, queryParam) {
    return this.request.get(`/server/collection/${collectionName}${queryParam}`);
  }

  getTrainingLogsRecords(jobId) {
    return this.request.get(`/logs/${jobId}`);
  }
  
  getRecordById(elementName, id) {
    return this.request.get(`/server/elements/${elementName}/records/${id}`);
  }
  
  deleteRecordById(elementName, id) {
    return this.request.delete(`/server/elements/${elementName}/records/${id}`);
  }
  
  deleteRecordByQuery(elementName, queryParam) {
    return this.request.delete(`/server/elements/${elementName}/records${queryParam}`);
  }
  
  updateRecordById(elementName, id, payload) {
    return this.request.put(`/server/elements/${elementName}/records/${id}`, payload);
  }
  
  updateRecordByQuery(elementName, queryParam, payload) {
    return this.request.put(`/server/elements/${elementName}/records${queryParam}`, payload);
  }

  updateElementStatusById(id, payload) {
    return this.request.put(`/server/elements/schema/${id}`, payload);
  }

  updateTagById(payload) {
    return this.request.put(`/server/tag/updatemultiple`, payload);
  }

  changeElementStatusById(payload, elementId) {
    return this.request.put(`/server/elements/schema/${elementId}`, payload);
  }

  postSocket(functionName, payload) {
    return this.request.post(`/socket.io/linemes/${functionName}`, payload);
  }
}

export default new ElementService();
