import { RawDraftContentState, RawDraftEntity, RawDraftEntityRange } from 'draft-js';

import { CustomRule } from './index';

export function escapeRegExp(str: string): string {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function toContentState(defaultValue: string, customRules: CustomRule[]): RawDraftContentState {
  const entityMap: { [key: string]: RawDraftEntity<{ [key: string]: any }>; } = {};
  const entityRanges: RawDraftEntityRange[] = [];
  const regex = new RegExp(customRules.filter(({ key }) => !!key).map(({ key }) => {
    return escapeRegExp(key);
  }).join('|'));
  let defaultValueTmp = defaultValue;
  let matchArr;
  while ((matchArr = regex.exec(defaultValueTmp)) !== null) {
    const [key] = matchArr;
    const { index } = matchArr;
    const rule = customRules.find((rule) => rule.key === key);
    if (rule) {
      entityMap[index] = {
        data: rule,
        mutability: 'IMMUTABLE',
        type: 'variable',
      };

      entityRanges.push({
        key: index,
        length: rule.name.length,
        offset: index,
      });

      const valueArr = defaultValueTmp.split('');
      valueArr.splice(matchArr.index, key.length, rule.name);
      defaultValueTmp = valueArr.join('');
    }
  }

  return {
    blocks: [
      {
        key: 'ExpressionBlock',
        depth: 0,
        inlineStyleRanges: [],
        data: {},
        type: 'unstyled',
        text: defaultValueTmp,
        entityRanges,
      },
    ],
    entityMap,
  };
}

// export function getSelectionCoords(): { x: number, y: number } {
//   const doc = window.document;
//   let sel; let range; let rects; let rect;
//   let x = 0; let y = 0;
//   if (window.getSelection) {
//     sel = window.getSelection();
//     if (sel?.rangeCount) {
//       range = sel.getRangeAt(0).cloneRange();
//       if (range.getClientRects) {
//         range.collapse(true);
//         rects = range.getClientRects();
//         if (rects.length > 0) {
//           rect = rects[0];
//         }
//         if (rect) {
//           x = rect.left;
//           y = rect.top;
//         }
//       }

//       if ((x === 0 && y === 0) || rect === undefined) {
//         const span = doc.createElement('span');
//         if (span.getClientRects) {
//           span.appendChild(doc.createTextNode('\u200b'));
//           range.insertNode(span);
//           rect = span.getClientRects()[0];
//           x = rect.left;
//           y = rect.top;
//           const spanParent = span.parentNode;
//           spanParent?.removeChild(span);
//           spanParent?.normalize();
//         }
//       }
//     }
//   }
//   return { x, y };
// }
