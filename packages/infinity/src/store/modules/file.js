import FileService from '@shopworx/services/api/file.service';
import { saveFile } from '@shopworx/services/util/file.service';

export default ({
  actions: {
    downloadFile: async (_, downloadLink) => {
      try {
        const { data } = await FileService.downloadFile(downloadLink);
        // check here
        const fileName = downloadLink.split('/');
        console.log(data);
        const blob = new Blob([data], { type: 'application/json' });
        console.log(blob);
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
