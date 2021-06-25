import { RawDraftContentState, RawDraftEntity, RawDraftEntityRange } from 'draft-js';

import { CustomRule } from './index';

export function toContentState(defaultValue: string, customRules: CustomRule[]): RawDraftContentState {
  const entityMap: { [key: string]: RawDraftEntity<{ [key: string]: any; }>; } = {};
  const entityRanges: RawDraftEntityRange[] = [];
  let defaultValueTmp = defaultValue;
  customRules.forEach((rule) => {
    const index = defaultValueTmp.indexOf(rule.key);
    defaultValueTmp = defaultValueTmp.replace(rule.key, rule.name);
    if (index > -1) {
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
    }
  });

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
