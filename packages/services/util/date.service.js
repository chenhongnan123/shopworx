import {
  differenceInMilliseconds,
  formatDistanceToNow,
  formatDistanceStrict,
  isWithinInterval,
  formatDistance,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns';

import {
  enIN,
  zhCN,
  hi,
  de,
  th,
} from 'date-fns/locale';

const locales = {
  'en': enIN,
  'zh': zhCN,
  'hi': hi,
  'de': de,
  'th': th,
}

export const now = () => new Date().getTime();

/**
 * 
 * @param {Date} date
 * @param {Date} baseDate
 * @param {Object} options
 */
export const distanceInWords = (date, baseDate, options = {}) => {
  const selectedLocale = options.locale || 'en';
  const locale = locales[selectedLocale];
  return formatDistance(date, baseDate, { locale });
};

/**
 * 
 * @param {Date} date
 * @param {Date} baseDate
 * @param {Object} options
 */
export const timeDistance = (date, baseDate, options = {}) => {
  const selectedLocale = options.locale || 'en';
  const locale = locales[selectedLocale];
  return formatDistanceStrict(date, baseDate, { locale });
};

/**
 * 
 * @param {Date} date
 * @param {Date} baseDate
 * @param {Object} options
 */
export const distanceInWordsToNow = (date, options = {}) => {
  const selectedLocale = options.locale || 'en';
  const locale = locales[selectedLocale];
  return formatDistanceToNow(date, { locale });
};

/**
 * 
 * @param {Date} date
 */
export const formatDate = (date, form, options = {}) => {
  const selectedLocale = options.locale || 'en';
  const locale = locales[selectedLocale];
  return format(date, form, { locale });
};

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
  let endDate = new Date(
    2020,
    3,
    17,
    parseInt(endHour, 10),
    parseInt(endMin, 10),
    parseInt(endSec || 0, 10),
    0,
  );
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
  } else if (startHour >= endHour && startMin >= endMin) {
    endDate = new Date(
      2020,
      3,
      18,
      parseInt(endHour, 10),
      parseInt(endMin, 10),
      parseInt(endSec || 0, 10),
      0,
    );
  }
  return differenceInMilliseconds(endDate, startDate);
};
