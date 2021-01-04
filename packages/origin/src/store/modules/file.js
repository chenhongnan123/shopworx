import FileService from '@shopworx/services/api/file.service';
import { saveFile } from '@shopworx/services/util/file.service';

export default ({
  actions: {
    uploadFile: async (_, { fileParam, formData }) => {
      try {
        const { data } = await FileService.uploadFile(fileParam, formData);
        return data;
      } catch (e) {
        return false;
      }
    },

    downloadFile: async (_, downloadLink) => {
      try {
        const { data } = await FileService.downloadFile(downloadLink);
        const fileName = downloadLink.split('/');
        const blob = new Blob([data], { type: 'application/json' });
        await saveFile(blob, `${fileName[4]}.${fileName[5]}`);
      } catch (e) {
        return false;
      }
      return true;
    },

    deleteFile: async (_, { elementName, id }) => {
      try {
        const { data } = await FileService.deleteFile(elementName, id);
        if (data && data.deleted) {
          return data.deleted;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
  },

});
