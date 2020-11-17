import ApiService from './api.service';

class FileService {
  constructor() {
    this.request = ApiService;
  }

  uploadFile(fileParam) {
    return this.request.post(`/server/uploadfile/${fileParam}`);
  }

  downloadFile(downloadLink) {
    return this.request.get(`${downloadLink}?disposition=attachment`, {
      responseType: 'blob',
    });
  }

  deleteFile(elementName, id) {
    return this.request.delete(`/server/deletefile/${id}?elementName=${elementName}`);
  }
}

export default new FileService();
