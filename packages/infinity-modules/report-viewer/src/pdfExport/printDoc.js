import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import getDocDefinition from './docDefinition';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function printDoc(printParams, fileName, gridApi, columnApi) {
  const docDefinition = getDocDefinition(
    printParams,
    gridApi,
    columnApi,
  );
  pdfMake.createPdf(docDefinition).download(fileName);
}

export default printDoc;
