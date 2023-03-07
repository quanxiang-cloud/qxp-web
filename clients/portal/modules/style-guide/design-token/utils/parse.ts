import { setWith } from 'lodash';

import { TokenTypes } from '../constants/constants-types';
import { SetTokenInput, UpdateTokenInput } from '../types/input';
import { AnyTokenList, Token } from '../types/token';
import { isValueToken } from '.';

type TokenSetType = Record<
  string,
  Partial<Record<TokenTypes, Record<string, Token>>>
>;

type TokenEntry = [string, AnyTokenList | TokenSetType];

function checkForTokens({
  parsedTokens,
  token,
  root = null,
}: {
  parsedTokens: Token[];
  token: TokenSetType;
  root?: string | null;
}): [Token[], Token] {
  let returnValue: any;
  if (isValueToken(token)) {
    returnValue = token;
  } else if (typeof token === 'object') {
    Object.entries(token).map(([key, value]) => {
      const [, result] = checkForTokens({
        parsedTokens,
        token: value,
        root: [root, key].filter((n) => n).join('.'),
      });
      if (root && result) {
        parsedTokens.push({ ...result, name: [root, key].join('.') });
      } else if (result) {
        parsedTokens.push({ ...result, name: key });
      }
    });
  } else {
    returnValue = {
      value: token,
    };
  }

  if (returnValue?.name) {
    returnValue.name = returnValue.name.split('/').join('.');
  }
  return [parsedTokens, returnValue];
}

export function convertToTokenArray({
  tokens,
}: {
  tokens: TokenSetType;
}): AnyTokenList {
  const [result] = checkForTokens({
    parsedTokens: [],
    token: tokens,
  });
  return Object.values(result);
}

export function parseTokenValues(
  tokens: SetTokenInput['values'],
): Record<string, AnyTokenList> {
  if (Array.isArray(tokens)) {
    return {
      global: tokens,
    };
  }

  const reducedTokens = Object.entries(tokens)?.reduce<[string, AnyTokenList][]>(
    (prev, [name, parsedGroup]: TokenEntry) => {
      if (Array.isArray(parsedGroup)) {
        prev.push([name, parsedGroup]);
        return prev;
      }

      if (typeof parsedGroup === 'object') {
        const convertedToArray = convertToTokenArray({ tokens: parsedGroup });
        prev.push([name, convertedToArray]);
        return prev;
      }

      return prev;
    },
    [],
  );

  return Object.fromEntries(reducedTokens);
}

export function updateTokenInputToToken(data: UpdateTokenInput): Token {
  return {
    name: data.name,
    value: data.value,
    type: data?.options?.type,
    ...data?.unit ? {
      unit: data.unit,
    } : {},
    ...(data?.options?.description ? {
      description: data.options.description,
    } : {}),
  } as Token;
}

export function stringifyTokens(
  tokens: Record<string, AnyTokenList>,
  exportTokenSets: string[],
  inCludeSet = false,
): string {
  const tokenObj = {};

  exportTokenSets.forEach((tokenSet) => {
    tokens[tokenSet].forEach((token) => {
      const { name, ...tokenWithoutName } = token;
      setWith(
        tokenObj,
        inCludeSet ? [tokenSet, token.name].join('.') : token.name,
        tokenWithoutName,
        Object,
      );
    });
  });

  return JSON.stringify(tokenObj, null, 2);
}
