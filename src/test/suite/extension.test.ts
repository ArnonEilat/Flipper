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
    .then((textEditor: TextEditor) => cb(textEditor));
};

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  setup(async () => {
    const doc = await vscode.workspace.openTextDocument(fPath);
    const editor = await vscode.window.showTextDocument(doc);
    if (doc.getText() !== text) {
      const fullRange = new Range(
        doc.positionAt(0),
        doc.positionAt(doc.getText().length),
      );
      await editor.edit(b => b.replace(fullRange, text));
    }
  });

  test('Add one within parentheses', () => {
    return getTextEditor(async (textEditor: TextEditor) => {
      const lnNum = findLine(text, 'String.fromCharCode(0);');
      textEditor.selection = new Selection(lnNum, 20, lnNum, 21);
      await flip(DIRECTION.UP);
      const rng = new Range(lnNum, 0, lnNum, 40);
      const actual = textEditor.document.getText(rng);

      assert.equal(actual, 'String.fromCharCode(1);');
    });
  });

  test('Substract 2 within parentheses', () => {
    return getTextEditor(async (textEditor: TextEditor) => {
      const lnNum = findLine(text, 'String.fromCharCode(0);');
      textEditor.selection = new Selection(lnNum, 20, lnNum, 21);

      await flip(DIRECTION.DONE);
      await flip(DIRECTION.DONE);

      const rng = new Range(lnNum, 0, lnNum, 40);
      const actual = textEditor.document.getText(rng);
      assert.equal(actual, 'String.fromCharCode(-2);');
    });
  });

  test(`Change 'const' to 'let'`, () => {
    return getTextEditor(async (textEditor: TextEditor) => {
      const lnNum = findLine(text, 'const something = 4;');
      textEditor.selection = new Selection(lnNum, 0, lnNum, 4);

      await flip(DIRECTION.DONE);
      const rng = new Range(lnNum, 0, lnNum, 40);
      const actual = textEditor.document.getText(rng);
      assert.equal(actual.trim(), 'let something = 4;');
    });
  });

  test(`Change 'true' to 'false'`, () => {
    return getTextEditor(async textEditor => {
      const lnNum = findLine(text, 'if(true === false){');

      textEditor.selection = new Selection(lnNum, 3, lnNum, 7);

      await flip(DIRECTION.DONE);
      const rng = new Range(lnNum, 0, lnNum, 40);
      const actual = textEditor.document.getText(rng);

      assert.equal(actual.trim(), 'if(false === false){');
    });
  });

  test(`Change '++' to '--'`, () => {
    return getTextEditor(async textEditor => {
      const lnNum = findLine(
        text,
        'for (let index = 0; index < 67; index++) {}',
      );

      textEditor.selection = new Selection(lnNum, 38, lnNum, 39);

      await flip(DIRECTION.DONE);
      const rng = new Range(lnNum, 0, lnNum, 47);
      const actual = textEditor.document.getText(rng);

      assert.equal(
        actual.trim(),
        'for (let index = 0; index < 67; index--) {}',
      );
    });
  });

  test(`Change '<' to '>'`, () => {
    return getTextEditor(async textEditor => {
      const lnNum = findLine(
        text,
        'for (let index = 0; index < 67; index++) {}',
      );

      textEditor.selection = new Selection(lnNum, 26, lnNum, 27);

      await flip(DIRECTION.DONE);
      const rng = new Range(lnNum, 0, lnNum, 47);
      const actual = textEditor.document.getText(rng);

      assert.equal(
        actual.trim(),
        'for (let index = 0; index > 67; index++) {}',
      );
    });
  });

  test(`Change '===' to '!=='`, () => {
    return getTextEditor(async textEditor => {
      const lnNum = findLine(text, 'if(a === b){}');

      textEditor.selection = new Selection(lnNum, 7, lnNum, 8);

      await flip(DIRECTION.DONE);
      const rng = new Range(lnNum, 0, lnNum, 47);
      const actual = textEditor.document.getText(rng);

      assert.equal(actual.trim(), 'if(a !== b){}');
    });
  });

  test(`Negate identifier: 'someCondition' to '!someCondition'`, () => {
    return getTextEditor(async textEditor => {
      const lnNum = findLine(text, 'if (someCondition) {}');

      textEditor.selection = new Selection(lnNum, 8, lnNum, 9);

      await flip(DIRECTION.UP);
      const rng = new Range(lnNum, 0, lnNum, 30);
      const actual = textEditor.document.getText(rng);

      assert.equal(actual.trim(), 'if (!someCondition) {}');
    });
  });

  test(`Identifier outside boolean context is not negated`, () => {
    return getTextEditor(async textEditor => {
      const lnNum = findLine(text, 'foo(bar);');

      textEditor.selection = new Selection(lnNum, 5, lnNum, 6);

      await flip(DIRECTION.UP);
      const rng = new Range(lnNum, 0, lnNum, 20);
      const actual = textEditor.document.getText(rng);

      assert.equal(actual.trim(), 'foo(bar);');
    });
  });

  test(`Un-negate identifier: '!negated' to 'negated'`, () => {
    return getTextEditor(async textEditor => {
      const lnNum = findLine(text, 'if (!negated) {}');

      textEditor.selection = new Selection(lnNum, 8, lnNum, 9);

      await flip(DIRECTION.DONE);
      const rng = new Range(lnNum, 0, lnNum, 30);
      const actual = textEditor.document.getText(rng);

      assert.equal(actual.trim(), 'if (negated) {}');
    });
  });

  test(`Change 'something={true} to 'something={false}'`, () => {
    return getTextEditor(async textEditor => {
      const lnNum = findLine(text, 'something={true}');

      textEditor.selection = new Selection(lnNum, 12, lnNum, 13);

      await flip(DIRECTION.DONE);
      const rng = new Range(lnNum, 0, lnNum, 17);
      const actual = textEditor.document.getText(rng);

      assert.equal(actual.trim(), 'something={false}');
    });
  });
});
