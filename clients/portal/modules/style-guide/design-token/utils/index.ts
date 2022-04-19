import { setWith, defaultsDeep } from 'lodash';
import { Parser } from 'expr-eval';

import tokenTypes from '../config/tokenTypes';
import { Token, TokenTypeSchema } from '../types/token';
import { TokenTypes } from '../constants/constants-types';
export interface TokenListType extends TokenTypeSchema {
  values: Token[];
}

const parser = new Parser();

export function checkAndEvaluateMath(expr: string): string {
  try {
    const val = parser.evaluate(expr);
    return (+val.toFixed(3)).toString();
  } catch (ex) {
    return expr;
  }
}

export function isValueToken(token: unknown): boolean {
  return (
    typeof token === 'object' &&
    (typeof (token as Token)?.value === 'string' ||
      typeof (token as Token)?.value === 'number' ||
      typeof (token as Token)?.value === 'object')
  );
}

export function isTypographyToken(token: unknown): boolean {
  if (typeof token !== 'object') return false;
  return (token as Token).type === TokenTypes.TYPOGRAPHY;
}

export function isShadowToken(token: unknown): boolean {
  if (typeof token !== 'object') return false;
  return (token as Token).type === TokenTypes.BOX_SHADOW;
}

export function isSingleToken(token: unknown): boolean {
  return (
    typeof token === 'object' &&
    'value' in (token as Token) &&
    'type' in (token as Token) &&
    'name' in (token as Token)
  );
}

export function createTokensObject(
  tokens: Token[],
  tokenFilter = '',
): Record<string, { values: Token[]; type?: TokenTypes }> {
  if (tokens.length > 0) {
    const obj = tokens.reduce<Record<string, { values: Token[]; type?: TokenTypes }>>((acc, cur) => {
      if (
        tokenFilter === '' ||
        (cur.name as string)?.toLowerCase().search(tokenFilter?.toLowerCase()) >= 0
      ) {
        const propToSet = cur.type;
        acc[propToSet] = acc[propToSet] || { values: {} };
        acc[propToSet].values = acc[propToSet].values || {};
        setWith(acc[propToSet].values, cur.name, {
          ...cur,
          type: propToSet,
        }, Object);
      }
      return acc;
    }, {});
    return obj;
  }
  return {};
}

export function mappedTokens(tokens: Token[], tokenFilter: string): [string, TokenListType][] {
  const tokenObj: Record<string, TokenListType> = {};
  defaultsDeep(tokenObj, tokenTypes);
  Object.entries(createTokensObject(tokens, tokenFilter)).forEach(
    ([key, group]: [string, { values: Token[]; type?: TokenTypes }]) => {
      tokenObj[key] = {
        ...tokenObj[key],
        values: group.values,
      };
    },
  );
  defaultsDeep(tokenObj, tokenTypes);
  return Object.entries(tokenObj);
}
