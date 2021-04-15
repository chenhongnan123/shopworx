
export const set = property => (state, payload) => (state[property] = payload);

export const toggle = property => state => (state[property] = !state[property]);

export const calculateRowHeight = noOfRows => (window.innerHeight - 192) / noOfRows;


export const getDate = (param) => {
  const requiredDate = new Date();
  const pastDate = requiredDate.getDate() - param;
  requiredDate.setDate(pastDate);
  return requiredDate;
};

export const getStartDate = (dateRange, hourFormat) => {
  if (dateRange) {
    const date = new Date(dateRange[0])
      .setHours(
        (hourFormat[0] || 0),
        (hourFormat[1] || 0),
        (hourFormat[2] || 0),
        0,
      );
    return date;
  }
  return 0;
};

export const getEndDate = (dateRange, hourFormat, serverTime) => {
  if (dateRange) {
    let date = new Date(dateRange[1])
      .setHours(
        (hourFormat[0] || 0),
        (hourFormat[1] || 0),
        (hourFormat[2] || 0),
        0,
      ) + (24 * 60 * 60 * 1000);
    // calculated date > server time then assign server time to end date
    if (date > serverTime) {
      date = serverTime;
    }
    // substract 1 second because query need to go before next day 1st shift start time
    return date - 1000;
  }
  return 0;
};
