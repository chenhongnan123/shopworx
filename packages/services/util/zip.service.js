import JSZip from 'jszip';
import { saveAs } from 'file-saver';

class ZipService {
  constructor() {
    this.instance = new JSZip();
  }

  addFile({ fileName, fileContent }) {
    this.instance.file(fileName, fileContent);
  }

  removeFile({ fileName }) {
    this.instance.remove(fileName);
  }

  addFolder({ folderName }) {
    this.instance.folder(folderName);
  }

  generateZip(type = 'blob') {
    return this.instance.generateAsync({ type, stream: true });
  }

  downloadFile(file, fileName) {
    saveAs(file, fileName);
  }
}

export default new ZipService();
