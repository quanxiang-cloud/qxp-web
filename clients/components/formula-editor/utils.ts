import { RawDraftContentState } from 'draft-js';

import { CustomRule } from './index';

export function toContentState(defaultValue: string, customRules: CustomRule[]): RawDraftContentState {
  const entityMap: any = {};
  const entityRanges: any = [];
  let defaultValueTmp = defaultValue;
  customRules.forEach((rule) => {
    const index = defaultValueTmp.indexOf(rule.key);
    defaultValueTmp = defaultValueTmp.replace(rule.key, rule.name);
    if (index > -1) {
      entityMap[rule.key] = {
        data: rule,
        mutability: 'IMMUTABLE',
        type: 'field',
      };

      entityRanges.push({
        key: rule.key,
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
