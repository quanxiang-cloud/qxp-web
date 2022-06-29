import { getBatchGlobalConfig } from '@lib/api/user-config';
import { parseJSON } from '@lib/utils';
import { TYPE_MAPS } from '@portal/modules/style-guide/design-token/constants/constants-types';
import { defaultTokens, GLOBAL_SET } from '@portal/modules/style-guide/design-token/store';
import { BoxShadowToken } from '@portal/modules/style-guide/design-token/types/token';
import {
  TokenTypograpyUnit,
  TokenTypograpyValue,
} from '@portal/modules/style-guide/design-token/types/values';
import { isShadowToken, isTypographyToken } from '@portal/modules/style-guide/design-token/utils';
import {
  addUnitToCssProperty,
  generateWholeBoxShadowStyle,
  replaceMatchValue,
  resolveClassNameByTokenName,
} from '@portal/modules/style-guide/design-token/utils/css';
import { parseTokenValues } from '@portal/modules/style-guide/design-token/utils/parse';
import {
  mergeTokenGroups,
  resolveTokenValues,
} from '@portal/modules/style-guide/design-token/utils/token-helper';
import { useEffect, useState } from 'react';
import { StyleDataItem } from './class-selector';

export function useStyleData(): [boolean, StyleDataItem[]] {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [styleData, setStyleData] = useState<StyleDataItem[]>([]);

  useEffect(() => {
    setIsLoading(true);
    getBatchGlobalConfig([{ key: 'GLOBAL_DESIGN_TOKEN_CONFIG', version: '0.1.0' }])
      .then((res) => {
        const tokenDataString = res.result?.['GLOBAL_DESIGN_TOKEN_CONFIG'];
        const tokenData = tokenDataString ?
          parseJSON(tokenDataString, {
            values: defaultTokens.values,
            usedTokenSet: [GLOBAL_SET],
          }) :
          { values: defaultTokens.values, usedTokenSet: [GLOBAL_SET] };
        return resolveTokenValues(mergeTokenGroups(parseTokenValues(tokenData.values), []));
      })
      .then((resolveTokenValues) => {
        const data = resolveTokenValues.reduce<StyleDataItem[]>((acc, token) => {
          const name = `${token.name.replace(/\./g, '-')}`;
          const type = token.type;
          let _value;
          if (isTypographyToken(token)) {
            _value = addUnitToCssProperty(
              token.value as TokenTypograpyValue,
              token.unit as TokenTypograpyUnit,
            );
          } else if (isShadowToken(token)) {
            _value = { [type]: generateWholeBoxShadowStyle(token as BoxShadowToken) };
          } else if (TYPE_MAPS[token.type]) {
            const res = Object.entries(TYPE_MAPS[token.type]).reduce<StyleDataItem[]>((pre, [key, value]) => {
              const className = resolveClassNameByTokenName(token.name).slice(1);
              const classToken = { ...token, name: className };
              let _className = replaceMatchValue(key, classToken);
              if (_className.endsWith(':hover') || _className.endsWith(':focus')) {
                _className = _className.slice(0, _className.length - 6);
              }
              const _val = replaceMatchValue(value, classToken);
              const [propertyName, propertyValue] = _val.split(':');
              const _propertyName = propertyName.replace(/-([a-z])/g, (match) => match.slice(1).toUpperCase());
              return [
                ...pre,
                { name: _className, value: { [_propertyName]: propertyValue.replace(';', '') }, type },
              ];
            }, []);
            return [...acc, ...res];
          } else {
            _value = addUnitToCssProperty(
              { [token.type]: token.value as string },
              { [token.type]: (token.unit as string) || '' },
            );
          }
          return [...acc, { name, type, value: _value }];
        }, []);
        setStyleData(data);
        setIsLoading(false);
      });
  }, []);

  return [isLoading, styleData];
}
