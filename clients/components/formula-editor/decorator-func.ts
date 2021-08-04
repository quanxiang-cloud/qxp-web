import {
  ContentBlock,
  ContentState,
} from 'draft-js';

import operators from './operator';
import functions from './function';

export function escapeRegExp(str: string): string {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function handleFieldHighlight(
  contentBlock: ContentBlock,
  callback: any,
  contentState: ContentState,
  nameStr: string[],
): void {
  const text = contentBlock.getText();
  let matchArr; let start;
  const regex = new RegExp(nameStr.filter((str) => !!str).join('|'), 'g');
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
  let start; let matchArr;
  const regex = new RegExp(operators.map(({ content }) => escapeRegExp(content)).join('|'), 'g');
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

export function handleFuncHighlight(contentBlock: ContentBlock, callback: any): void {
  const text = contentBlock.getText();
  let start; let matchArr;
  const regex = new RegExp(functions.map(({ name }) => `${name}\\(`).join('|'), 'g');
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

export function handleSymbolHighlight(contentBlock: ContentBlock, callback: any): void {
  const text = contentBlock.getText();
  let start; let matchArr;
  const regex = new RegExp(['\\(', '\\)'].join('|'), 'g');
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}
