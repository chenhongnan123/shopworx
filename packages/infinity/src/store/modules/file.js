import FileService from '@shopworx/services/api/file.service';
import { saveFile } from '@shopworx/services/util/file.service';

export default ({
  actions: {
    downloadFile: async (_, downloadLink) => {
      try {
        const { data } = await FileService.downloadFile(downloadLink);
        await saveFile(data, 'abc.txt');
        if (data && data.results) {
          return data.results;
        }
      } catch (e) {
        return false;
      }
      return false;
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
