import FileService from '@shopworx/services/api/file.service';

export default ({
  actions: {
    uploadFile: async (_, { fileParam, formData }) => {
      try {
        const { data } = await FileService.uploadFile(fileParam, formData);
        return data;
      } catch (e) {
        throw new Error(e);
      }
    },

    downloadFile: async (_, downloadLink) => {
      try {
        const { data } = await FileService.downloadFile(downloadLink);
        const blob = new Blob([data], { type: 'image/jpeg' });
        return blob;
      } catch (e) {
        return false;
      }
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
