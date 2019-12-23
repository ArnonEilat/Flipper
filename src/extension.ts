import {
  commands,
  Disposable,
  ExtensionContext,
  TextEditor,
  TextEditorEdit,
  window,
} from 'vscode';
import { getReplacement } from './flipper';
import { DIRECTION, emptyWordNRange, WordNRange } from './types';
import { getWordNRange, cssRegex } from './utills';

const shouldIgnore = (word: string) => {
  switch (word) {
    case '':
    case '=':
    case '}':
    case '{':
    case '*':
    case '/':
      return true;
    default:
      return false;
  }
};

const regexArr = [
  /\(*\-*\d+\)(;)*/,
  cssRegex,
  /(?<=\()\S+/,
  /\S+/,
  /\[.*\]/,
  /(\d*\.?\d+)(?=deg)/,
  /(?=={)(.+)}/,
];

export const flip = (dir: DIRECTION) => {
  const editor: TextEditor = window.activeTextEditor as TextEditor;

  if (!editor) {
    const msg: string = 'Error occurred while trying to get editor instance';
    window.showErrorMessage(msg);
    return Promise.reject();
  }

  const editCallback = (builder: TextEditorEdit) => {
    for (const selection of editor.selections) {
      let replacement = '';
      let wNr: WordNRange = emptyWordNRange;

      for (const re of regexArr) {
        wNr = getWordNRange(selection, editor, re);
        replacement = getReplacement(wNr.word, dir);
        if (replacement !== wNr.word) {
          break;
        }
      }

      if (shouldIgnore(wNr.word)) {
        continue;
      }

      builder.replace(wNr.range, replacement);
    }
  };

  return editor.edit(editCallback);
};

export const activate = (context: ExtensionContext) => {
  const flipUp: Disposable = commands.registerCommand(`flipper.flipUp`, () =>
    flip(DIRECTION.UP),
  );
  context.subscriptions.push(flipUp);

  const flipDone: Disposable = commands.registerCommand(
    `flipper.flipDone`,
    () => flip(DIRECTION.DONE),
  );
  context.subscriptions.push(flipDone);
};
