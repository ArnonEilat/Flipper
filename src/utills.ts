import { WordNRange, emptyWordNRange } from './types';
import { Position, Range, Selection, TextEditor } from 'vscode';

export const cssRegex: RegExp = /(\d*\.?\d+)\s?(px|em|vh|vw|ms|ex|%|in|cn|mm|pt|pc+)/;

const cssColor: RegExp = /(rgb[a]*|hsl[a]*)\([\-]*(\d*\.?\d+)/;

const isCssUnit = (str: string): boolean => cssRegex.test(str);

const isCssColorStart = (str: string): boolean => cssColor.test(str);

const shouldRightTrim = (str: string): boolean => {
  const lastChar = str[str.length - 1];

  switch (lastChar) {
    case ';':
    case ')':
    case ']':
    case '%':
    case ';':
    case ',':
    case ' ':
    case '}':
    case '{':
      return true;
    default:
      return false;
  }
};

const shouldLeftTrim = (str: string): boolean => {
  const firstChar = str[0];

  if (str.startsWith('={')) {
    return true;
  }
  switch (firstChar) {
    case '(':
    case '[':
    case '{':
    case ',':
    case ' ':
      return true;
    default:
      return false;
  }
};

export const getWordNRange = (
  selection: Selection,
  editor: TextEditor,
  regex: RegExp,
): WordNRange => {
  const { active } = selection;

  let range = editor.document.getWordRangeAtPosition(active, regex);

  if (!range) {
    return emptyWordNRange;
  }

  let word: string = editor.document.getText(range);

  while (shouldRightTrim(word)) {
    const { line, character } = range.end;
    const endPos: Position = new Position(line, character - 1);
    range = new Range(range.start, endPos);
    word = editor.document.getText(range);
  }

  while (shouldLeftTrim(word)) {
    const { line, character } = range.start;
    const startPos: Position = new Position(line, character + 1);
    range = new Range(startPos, range.end);
    word = editor.document.getText(range);
  }

  if (isCssColorStart(word)) {
    const { line, character } = range.start;
    const isAlpha = word[3] === 'a';
    const add = isAlpha ? 5 : 4;
    const startPos: Position = new Position(line, character + add);
    range = new Range(startPos, range.end);
    word = editor.document.getText(range);
  }

  if (isCssUnit(word)) {
    const { line, character } = range.end;
    const endPos: Position = new Position(line, character - 2);
    range = new Range(range.start, endPos);
    word = editor.document.getText(range);
  }

  return { range, word };
};
