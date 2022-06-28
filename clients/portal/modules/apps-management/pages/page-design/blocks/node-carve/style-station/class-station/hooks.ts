import { getBatchGlobalConfig } from '@lib/api/user-config';
import { parseJSON } from '@lib/utils';
import { defaultTokens, GLOBAL_SET } from '@portal/modules/style-guide/design-token/store';
import { parseTokenValues } from '@portal/modules/style-guide/design-token/utils/parse';
import { mergeTokenGroups, resolveTokenValues } from '@portal/modules/style-guide/design-token/utils/token-helper';
import { useEffect, useState } from 'react';
import { StyleDataItem } from './class-selector';

export function useStyleData(): [ boolean, StyleDataItem[] ] {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [styleData, setStyleData] = useState<StyleDataItem[]>([]);

  useEffect(() => {
    setIsLoading(true);
    getBatchGlobalConfig([
      { key: 'GLOBAL_DESIGN_TOKEN_CONFIG', version: '0.1.0' },
    ]).then((res) => {
      const tokenDataString = res.result?.['GLOBAL_DESIGN_TOKEN_CONFIG'];
      const tokenData = tokenDataString ?
        parseJSON(tokenDataString, {
          values: defaultTokens.values,
          usedTokenSet: [GLOBAL_SET],
        }) :
        { values: defaultTokens.values, usedTokenSet: [GLOBAL_SET] };
      return resolveTokenValues(mergeTokenGroups(parseTokenValues(tokenData.values), []));
    }).then((resolveTokenValues) => {
      const data = resolveTokenValues.map((style) => {
        const name = `${style.name.replace(/\./g, '-')}`;
        const _value: any = style.value;
        const type = style.type;
        const unit: any = style.unit;
        let value: any;
        if (type === 'typography') {
          value = Object.assign({}, _value);
          const unitKeys = Object.keys(unit);
          const valueKeys = Object.keys(_value).filter((key) => unitKeys.includes(key));
          valueKeys.forEach((key) => {
            value[key] = value[key] + unit[key];
          });
        } else {
          value = { [type]: _value + (unit || '') };
        }
        return { name, value, type };
      });
      setStyleData(data);
      setIsLoading(false);
    });
  }, []);

  return [isLoading, styleData];
}
