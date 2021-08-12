import {
  ContentBlock,
  ContentState,
} from 'draft-js';

import { FUNCS, LOGICAL_OPERATORS, ARITHMETIC_OPERATORS, COLLECTION_OPERATORS } from './constants';
import { escapeRegExp } from './utils';

export function handleFieldHighlight(
  contentBlock: ContentBlock,
  callback: any,
  contentState: ContentState,
  nameStr: string[],
): void {
  const text = contentBlock.getText();
  let matchArr; let start;
  const regex = new RegExp(nameStr.filter((name) => !!name).map((name) => escapeRegExp(name)).join('|'), 'g');
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

export function handleOperatorHighlight(
  contentBlock: ContentBlock,
  callback: any,
): void {
  const text = contentBlock.getText();
  let matchArr; let start = 0; let end = 0;
  const regex = new RegExp(LOGICAL_OPERATORS.map((operator) => escapeRegExp(operator)).join('|'), 'g');
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    end = start + matchArr[0].length;
    if (!contentBlock.getEntityAt(start)) {
      callback(start, end);
    }
  }
}

export function handleFuncHighlight(contentBlock: ContentBlock, callback: any): void {
  const text = contentBlock.getText();
  let start; let matchArr;
  const regex = new RegExp([...FUNCS, ...COLLECTION_OPERATORS].map(({ name }) => `${name}`).join('|'), 'g');
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

export function handleSymbolHighlight(contentBlock: ContentBlock, callback: any): void {
  const text = contentBlock.getText();
  let start; let matchArr;
  const regex = new RegExp(ARITHMETIC_OPERATORS.map((symbol) => escapeRegExp(symbol)).join('|'), 'g');
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    if (!contentBlock.getEntityAt(start)) {
      callback(start, start + matchArr[0].length);
    }
  }
}
