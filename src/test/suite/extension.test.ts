import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { Range, Selection, TextDocument, TextEditor } from 'vscode';
import { flip } from '../../extension';
import { DIRECTION } from '../../types';

const findLine = (txt: string, needle: string): number => {
  const lines = txt.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === needle.trim()) {
      return i;
    }
  }

  return -1;
};

const fPath = path.join(__dirname, '../../../src/test/suite', 'fixture.txt');
const text = fs.readFileSync(fPath, 'utf8');

const getTextEditor = (cb: (textEditor: TextEditor) => any) => {
  return vscode.workspace
    .openTextDocument(fPath)
    .then((doc: TextDocument) => vscode.window.showTextDocument(doc))
    .then((textEditor: TextEditor) => {
      return cb(textEditor);
    });
};

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Add one within parentheses', () => {
    return getTextEditor((textEditor: TextEditor) => {
      const lnNum = findLine(text, 'String.fromCharCode(0);');
      textEditor.selection = new Selection(lnNum, 20, lnNum, 21);
      return flip(DIRECTION.UP).then(() => {
        const rng = new Range(lnNum, 0, lnNum, 40);
        const actual = textEditor.document.getText(rng);

        assert.equal(actual, 'String.fromCharCode(1);');
        return Promise.resolve();
      });
    });
  });

  test('Substract 2 within parentheses', () => {
    return getTextEditor((textEditor: TextEditor) => {
      const lnNum = findLine(text, 'String.fromCharCode(0);');
      textEditor.selection = new Selection(lnNum, 20, lnNum, 21);

      const resolver = () => {
        const rng = new Range(lnNum, 0, lnNum, 40);
        const actual = textEditor.document.getText(rng);

        assert.equal(actual, 'String.fromCharCode(-2);');
        return Promise.resolve();
      };

      return flip(DIRECTION.DONE).then(() => {
        flip(DIRECTION.DONE).then(resolver);
      });
    });
  });

  test(`Change 'const' to 'let'`, () => {
    return getTextEditor((textEditor: TextEditor) => {
      const lnNum = findLine(text, 'const something = 4;');
      textEditor.selection = new Selection(lnNum, 0, lnNum, 4);

      return flip(DIRECTION.DONE).then(() => {
        const rng = new Range(lnNum, 0, lnNum, 40);
        const actual = textEditor.document.getText(rng);
        assert.equal(actual.trim(), 'let something = 4;');
        return Promise.resolve();
      });
    });
  });

  test(`Change 'true' to 'false'`, () => {
    return getTextEditor(textEditor => {
      const lnNum = findLine(text, 'if(true === false){');

      textEditor.selection = new Selection(lnNum, 3, lnNum, 7);

      return flip(DIRECTION.DONE).then(() => {
        const rng = new Range(lnNum, 0, lnNum, 40);
        const actual = textEditor.document.getText(rng);

        assert.equal(actual.trim(), 'if(false === false){');

        return Promise.resolve();
      });
    });
  });

  test(`Change '++' to '--'`, () => {
    return getTextEditor(textEditor => {
      const lnNum = findLine(
        text,
        'for (let index = 0; index < 67; index++) {}',
      );

      textEditor.selection = new Selection(lnNum, 38, lnNum, 39);

      return flip(DIRECTION.DONE).then(() => {
        const rng = new Range(lnNum, 0, lnNum, 47);
        const actual = textEditor.document.getText(rng);

        assert.equal(
          actual.trim(),
          'for (let index = 0; index < 67; index--) {}',
        );

        return Promise.resolve();
      });
    });
  });

  test(`Change '<' to '>'`, () => {
    return getTextEditor(textEditor => {
      const lnNum = findLine(
        text,
        'for (let index = 0; index < 67; index++) {}',
      );

      textEditor.selection = new Selection(lnNum, 26, lnNum, 27);

      return flip(DIRECTION.DONE).then(() => {
        const rng = new Range(lnNum, 0, lnNum, 47);
        const actual = textEditor.document.getText(rng);

        assert.equal(
          actual.trim(),
          'for (let index = 0; index > 67; index--) {}',
        );

        return Promise.resolve();
      });
    });
  });

  test(`Change '===' to '!=='`, () => {
    return getTextEditor(textEditor => {
      const lnNum = findLine(text, 'if(a === b){}');

      textEditor.selection = new Selection(lnNum, 7, lnNum, 8);

      return flip(DIRECTION.DONE).then(() => {
        const rng = new Range(lnNum, 0, lnNum, 47);
        const actual = textEditor.document.getText(rng);

        assert.equal(actual.trim(), 'if(a !== b){}');

        return Promise.resolve();
      });
    });
  });

  test(`Change 'something={true} to 'something={false}'`, () => {
    return getTextEditor(textEditor => {
      const lnNum = findLine(text, 'something={true}');

      textEditor.selection = new Selection(lnNum, 12, lnNum, 13);

      return flip(DIRECTION.DONE).then(() => {
        const rng = new Range(lnNum, 0, lnNum, 17);
        const actual = textEditor.document.getText(rng);

        assert.equal(actual.trim(), 'something={false}');

        return Promise.resolve();
      });
    });
  });
});
