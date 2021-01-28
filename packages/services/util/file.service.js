import FileSaver from 'file-saver';

export const saveFile = (fileData, fileName) => FileSaver.saveAs(fileData, fileName);

