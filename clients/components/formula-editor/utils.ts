import { RawDraftContentState, RawDraftEntity, RawDraftEntityRange } from 'draft-js';

import { CustomRule } from './index';

export function escapeRegExp(str: string): string {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// TODO:
function formatValue(value: string): string {
  let result = value;
  let list: any = [];
  const pathTreeValue = window.CONFIG.WebhookPathTreeValue;
  pathTreeValue.forEach((item: any)=>{
    const { name, data, desc } = item;
    data.forEach((item: { value: string; name: any; descPath: string; desc: any; })=>{
      item.value = `$${name}.${item.name}`;
      item.descPath = `${desc}.${item.desc}`;
    });
    list = [...list, ...data];
  });
  list.find((item: { value: string; descPath: string; })=>{
    if (typeof value === 'string' && value?.includes(item.value)) {
      result = value.replace(item.value, item.descPath);
      return true;
    }
  });
  return result;
}

export function toContentState(defaultValue: string, customRules: CustomRule[], isWebhook?: boolean): RawDraftContentState {
  const entityMap: { [key: string]: RawDraftEntity<{ [key: string]: any }>; } = {};
  const entityRanges: RawDraftEntityRange[] = [];
  let defaultValueTmp = defaultValue;
  if (customRules.length) {
    const regex = new RegExp(customRules.filter(({ key }) => !!key).map(({ key }) => {
      return escapeRegExp(key);
    }).sort((a, b) => b.length - a.length).join('|'));
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
  }
  if (isWebhook) {
    defaultValueTmp = formatValue(defaultValueTmp);
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
