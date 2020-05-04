import { differenceInMilliseconds } from 'date-fns';

export const test = () => null;

/**
 * 
 * @param {string} endTime in HH:mm:ss
 * @param {string} startTime in HH:mm:ss
 */
export const getDurationBetweenTime = (endTime, startTime) => {
  const [endHour, endMin, endSec] = endTime.split(':');
  const [startHour, startMin, startSec] = startTime.split(':');
  let endDate = null;
  const startDate = new Date(
    2020,
    3,
    17,
    parseInt(startHour, 10),
    parseInt(startMin, 10),
    parseInt(startSec || 0, 10),
    0,
  );
  if (startHour > endHour) {
    endDate = new Date(
      2020,
      3,
      18,
      parseInt(endHour, 10),
      parseInt(endMin, 10),
      parseInt(endSec || 0, 10),
      0,
    );
  } else {
    endDate = new Date(
      2020,
      3,
      17,
      parseInt(endHour, 10),
      parseInt(endMin, 10),
      parseInt(endSec || 0, 10),
      0,
    );
  }
  return differenceInMilliseconds(endDate, startDate);
};