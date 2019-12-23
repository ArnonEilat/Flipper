/** @format */

import { Range } from 'vscode';

/** @format */

export enum DIRECTION {
  UP,
  DONE,
}

export interface WordNRange {
  word: string;
  range: Range;
}

export const emptyWordNRange: WordNRange = {
  word: '',
  range: new Range(0, 0, 0, 0),
};
