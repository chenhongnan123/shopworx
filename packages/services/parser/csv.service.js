import Papa from 'papaparse';

class CSVParser {
  parse(file, options = {
    header: true,
    skipEmptyLines: true,
  }) {
    return new Promise((resolve, reject) => {
      const opt = Object.assign(options, {
        error: (err, file, inputElem, reason) => reject({
          err,
          file,
          inputElem,
          reason,
        }),
        complete: results => resolve(results),
      });
      Papa.parse(file, opt);
    });
  }
}

export default CSVParser;
