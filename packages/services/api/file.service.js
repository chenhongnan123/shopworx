import ApiService from './api.service';

class FileService {
  constructor() {
    this.request = ApiService;
  }

  uploadFile(fileParam, formData) {
    return this.request.post(`/server/uploadfile/${fileParam}`, formData, {
      'Content-Type': 'multipart/form-data',
    });
  }

  downloadFile(downloadLink) {
    return this.request.get(`${downloadLink}?disposition=attachment`, {
      responseType: 'blob',
    });
  }

  getInlineImage(downloadLink) {
    return this.request.get(`${downloadLink}?disposition=inline`, {
      responseType: 'blob',
    });
  }

  getImageFile(filename) {
    return this.request.get(`/server/media/image/${filename}`, {
      responseType: 'blob',
    });
  }

  deleteFile(elementName, id) {
    return this.request.delete(`/server/deletefile/${id}?elementName=${elementName}`);
  }
}

export default new FileService();
