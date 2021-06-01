export const getNumber = (name) => {
  const charactersArray = Array.from(name);
  let charactersCodesSum = 0;

  // eslint-disable-next-line
  charactersArray.forEach((charactersArrayItem) => {
    // eslint-disable-next-line
    return charactersCodesSum += charactersArrayItem.charCodeAt(0);
  });

  return charactersCodesSum;
};

export const getModulus = (num, max) => num % max;

export const getDigit = (number, ntn) => Math.floor((number / (10 ** ntn)) % 10);

export const getBoolean = (number, ntn) => (!((getDigit(number, ntn)) % 2));

export const getAngle = (x, y) => (Math.atan2(y, x) * 180) / Math.PI;

export const getUnit = (number, range, index) => {
  const value = number % range;

  if (index && ((getDigit(number, index) % 2) === 0)) {
    return -value;
  }
  return value;
};

export const getRandomColor = (number, colors, range) => colors[(number) % range];

export const getContrast = (hexcolor) => {
  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === '#') {
    // eslint-disable-next-line
    hexcolor = hexcolor.slice(1);
  }

  // Convert to RGB value
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);

  // Get YIQ ratio
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  // Check contrast
  return (yiq >= 128) ? 'black' : 'white';
};
