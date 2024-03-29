import Papa from 'papaparse';

class CSVParser {
  parse(file, options = {
    header: true,
    skipEmptyLines: true,
    encoding: 'UTF-8',
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

  unparse(data) {
    return Papa.unparse(data);
  }
}

export default CSVParser;
