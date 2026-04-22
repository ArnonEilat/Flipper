import { DIRECTION } from './types';

type ReplacersMap = {
  [key: string]: string;
};

const map: ReplacersMap = {
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

const isNumeric = (str: string): boolean => str !== '' && !isNaN(Number(str));

const ppRegEx = /(\S+)(\+\+)/;
const mmRegEx = /(\S+)(\-\-)/;
const identifierRegex = /^[A-Za-z_$][\w$]*$/;

const countDecimals = (value: number): number => {
  if (Math.floor(value) === value) {
    return 0;
  }
  return value.toString().split('.')[1].length;
};

const handleNumber = (str: string, dir: DIRECTION): string => {
  const num: number = parseFloat(str);
  const sign = dir === DIRECTION.UP ? 1 : -1;

  if (Number.isInteger(num)) {
    return String(num + sign);
  }

  const decimals = countDecimals(num);
  const step = num > -1 && num < 1 ? 0.1 : 1;
  return (num + sign * step).toFixed(decimals);
};

export const getReplacement = (
  str: string,
  dir: DIRECTION,
  booleanContext: boolean = false,
): string => {
  if (str === '') {
    return '';
  }
  if (isNumeric(str)) {
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

  if (booleanContext) {
    if (str.startsWith('!') && identifierRegex.test(str.slice(1))) {
      return str.slice(1);
    }

    if (identifierRegex.test(str)) {
      return '!' + str;
    }
  }

  return str;
};
