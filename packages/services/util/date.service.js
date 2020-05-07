import {
  differenceInMilliseconds,
  formatDistanceToNow,
  isWithinInterval,
  formatDistance,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns';

export const now = () => new Date().getTime();

/**
 * 
 * @param {Date} date
 * @param {Date} baseDate
 * @param {Object} options
 */
export const distanceInWords = (date, baseDate, optoins = {}) => formatDistance(date, baseDate, optoins);

/**
 * 
 * @param {Date} date
 * @param {Date} baseDate
 * @param {Object} options
 */
export const distanceInWordsToNow = (date, optoins = {}) => formatDistanceToNow(date, optoins);

/**
 * 
 * @param {Date} date
 */
export const formatDate = (date, form) => format(date, form);

/**
 * 
 * @param {Date} date
 */
export const dayStart = (date) => startOfDay(date);

/**
 * 
 * @param {Date} date
 */
export const dayEnd = (date) => endOfDay(date);

/**
 * 
 * @param {Date} date
 * @param {Object} interval in { start: <Date>, end: <Date> }
 */
export const isWithinRange = (date, interval) => isWithinInterval(date, interval);

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
