import { DIRECTION } from './types';

type replacersMap = {
  [key: string]: string;
};

const map: replacersMap = {
  true: 'false',
  '===': '!==',
  '==': '!=',
  '>': '<',
  '>=': '<=',
  const: 'let',
  of: 'in',
  '||': '&&',
  '+': '-',
  '--': '++',
  '+=': '-=',
  '*=': '/=',
};

const isNumeric = (num: any) => !isNaN(num);

const ppRegEx = /(\S+)(\+\+)/;
const mmRegEx = /(\S+)(\-\-)/;

const countDecimals = (value: number) => {
  if (Math.floor(value) === value) {
    return 0;
  }
  return value.toString().split('.')[1].length || 0;
};

const handleNumber = (str: string, dir: DIRECTION): string => {
  const num: number = parseFloat(str);

  if (Number.isInteger(num)) {
    if (dir === DIRECTION.UP) {
      return String(num + 1);
    }
    const numToReturn = num - 1;
    if (numToReturn < 0) {
      return '' + numToReturn;
    }
    return String(numToReturn);
  }

  const decimals = countDecimals(num);
  if (num > 0 && num < 1) {
    if (dir === DIRECTION.UP) {
      return (num + 0.1).toFixed(decimals);
    }
    return (num - 0.1).toFixed(decimals);
  }

  if (dir === DIRECTION.UP) {
    return (num + 1).toFixed(decimals);
  }

  return (num - 1).toFixed(decimals);
};

export const getReplacement = (str: string, dir: DIRECTION): string => {
  if (str === '') {
    return '';
  }
  if (isNumeric(str) === true) {
    return handleNumber(str, dir);
  }

  for (const p in map) {
    if (str === p) {
      return map[p];
    }
    if (str === map[p]) {
      return p;
    }
  }

  const ppArr = ppRegEx.exec(str);

  if (Array.isArray(ppArr) && ppArr.length > 1) {
    return ppArr[1] + '--';
  }

  const mmArr = mmRegEx.exec(str);

  if (Array.isArray(mmArr) && mmArr.length > 1) {
    return mmArr[1] + '++';
  }

  // if (str.length === 1) {
  //   const charCode: number = str.charCodeAt(0);
  //   if (dir === DIRECTION.UP) {
  //     return String.fromCodePoint(charCode + 1);
  //   }
  //   return String.fromCodePoint(charCode - 1);
  // }

  return str;
};
