import { checkAndEvaluateMath } from './index';
import { isValueToken } from '.';
import { Token, TypographyToken } from '../types/token';

// alias wrappered with {}
export const aliasRegex = /{([^}]*)}/g;

export function checkIfContainsAlias(token: string): boolean {
  return Boolean(token.match(aliasRegex));
}

export const findReferences = (tokenValue: Token['value']): RegExpMatchArray | null => {
  return tokenValue.toString().match(aliasRegex);
};

export const findMatchingReferences = (
  tokenValue: string,
  valueToLookFor: string,
): string[] => {
  const references = findReferences(tokenValue);

  if (!references) {
    return [];
  }

  return references.filter((ref) => {
    const name = ref.slice(1, ref.length - 1);
    if (name === valueToLookFor) return ref;
  });
};

export const replaceReferences = (
  tokenValue: string,
  oldName: string,
  newName: string,
): string => {
  if (tokenValue.includes(oldName)) {
    const references = findMatchingReferences(tokenValue, oldName);
    let newValue = tokenValue;
    references.forEach((reference) => {
      newValue = newValue.replace(reference, `{${newName}}`);
    });
    return newValue;
  }

  return tokenValue;
};

export function getAliasValue(
  token: Token | Token['value'],
  tokens: Token[] = [],
): string | null {
  let returnedValue: string | null = isValueToken(token) ?
    ((token as Token).value as string) :
    (token as string);

  const tokenReferences = findReferences(returnedValue) || [];

  if (tokenReferences?.length > 0) {
    const resolvedReferences = tokenReferences.map((ref) => {
      const aliasName = ref.slice(1, ref.length - 1);

      if ((typeof token === 'object' && aliasName === (token as Token).name) || aliasName === token) {
        return null;
      }

      const foundToken = tokens.find((t) => t.name === aliasName);

      if (foundToken) {
        return getAliasValue(foundToken, tokens);
      }

      return ref;
    });

    tokenReferences.forEach((reference, index) => {
      const resolved = checkAndEvaluateMath(resolvedReferences[index] as string);
      returnedValue = (returnedValue as string).replace(reference, resolved);
    });
  }

  if (returnedValue) {
    const remainingReferences = findReferences(returnedValue);
    if (!remainingReferences) {
      return checkAndEvaluateMath(returnedValue);
    }
  }

  return checkAndEvaluateMath(returnedValue);
}

export function checkIfAlias(token: Token | Token['value'], allTokens: Token[] = []): boolean {
  let aliasToken = false;
  if (typeof token === 'string') {
    aliasToken = checkIfContainsAlias(token);
  } else if ((token as Token).type === 'typography') {
    aliasToken = Object.values(((token as TypographyToken).value)).some((attr) =>
      Boolean(attr.match(aliasRegex)),
    );
  } else {
    aliasToken = checkIfAlias((token as Token).value.toString(), allTokens);
  }

  if (aliasToken) {
    const aliasValue = getAliasValue(token, allTokens);
    return aliasValue !== null;
  }
  return false;
}
