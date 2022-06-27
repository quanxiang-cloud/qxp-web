import { getAliasValue } from './aliases';
import { checkIfAlias, checkIfContainsAlias } from './aliases';
import { Token } from '../types/token';

export type ResolvedToken<T extends Token> = T & { rawValue?: Token['value'], resolveFailed?: boolean };

export function findAllAliases(tokens: Token[]): Token[] {
  return tokens.filter((token) => checkIfAlias(token, tokens));
}

export function resolveTokenValues<T extends Token>(
  tokens: ResolvedToken<T>[],
  previousCount = 0,
): ResolvedToken<T>[] {
  const aliases = findAllAliases(tokens);
  let resolvedTokens: ResolvedToken<T>[] = tokens;
  resolvedTokens = tokens.map(
    (t: ResolvedToken<T>, i: number, tokensInProgress: ResolvedToken<T>[]) => {
      let resolvedValue;
      let resolveFailed;
      if (['typography', 'boxShadow'].includes(t.type)) {
        if (Array.isArray(t.value)) {
          resolvedValue = t.value.map((item) =>
            Object.entries(item).reduce<Record<string, string | null>>(
              (acc, [key, value]: [string, Token['value']]) => {
                acc[key] = getAliasValue(value, tokensInProgress);
                return acc;
              },
              {},
            ),
          );
        } else {
          resolvedValue = Object.entries(t.value).reduce<Record<string, string | null>>(
            (acc, [key, value]: [string, Token['value']]) => {
              acc[key] = getAliasValue(value, tokensInProgress);
              return acc;
            },
            {},
          );
        }
      } else {
        resolvedValue = getAliasValue(t, tokensInProgress);
        resolveFailed = resolvedValue === null || checkIfContainsAlias(resolvedValue);
      }

      return {
        ...t,
        value: resolvedValue,
        rawValue: t.rawValue || t.value,
        resolveFailed,
      };
    },
  );

  if (aliases.length > 0 && (previousCount > aliases.length || !previousCount)) {
    return resolveTokenValues(resolvedTokens, aliases.length);
  }
  return resolvedTokens;
}

export function mergeTokenGroups(
  tokens: Record<string, Token[]>,
  usedSets: string[] = [],
): Token[] {
  const mergedTokens: Token[] = [];
  Object.entries(tokens)
    .reverse()
    .forEach(([groupName, tokenList]: [string, Token[]]) => {
      if (usedSets.length === 0 || usedSets.includes(groupName)) {
        tokenList.forEach((token) => {
          if (!mergedTokens.some((t) => t.name === token.name)) {
            mergedTokens.push({
              ...token,
              parent: groupName,
            });
          }
        });
      }
    });
  return mergedTokens;
}
