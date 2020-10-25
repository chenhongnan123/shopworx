export const sortAlphaNum = (a, b) => {
  const aA = a.replace(/[^a-zA-Z]/g, '');
  const bA = b.replace(/[^a-zA-Z]/g, '');
  if (aA === bA) {
    const aN = parseInt(a.replace(/[^0-9]/g, ''), 10);
    const bN = parseInt(b.replace(/[^0-9]/g, ''), 10);
    return aN === bN ? 0 : aN > bN ? 1 : -1;
  }
  return aA > bA ? 1 : -1;
}

export const sortArray = (sourceArray, key) => {
  const sortByKey = (a, b) => a[key].localeCompare(b[key], 'en', { numeric: true });
  return sourceArray.sort(sortByKey);
};
