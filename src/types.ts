/** @format */

import { Range } from 'vscode';

export enum DIRECTION {
  UP,
  DONE,
}

export interface WordNRange {
  range: Range;
  word: string;
}

export const emptyWordNRange: WordNRange = {
  word: '',
  range: new Range(0, 0, 0, 0),
};
