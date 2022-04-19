import { isShadowToken, isTypographyToken } from '.';
import { BoxShadowTypes } from '../constants/constants-types';
import { BoxShadowToken, Token } from '../types/token';
import {
  TokenBoxshadowUnit,
  TokenBoxshadowValue,
  TokenTypograpyUnit,
  TokenTypograpyValue,
} from '../types/values';
import { ResolvedToken } from './token-helper';

function objectToCss(
  obj: Record<string, string>,
  unit: Record<string, string>,
): string {
  return Object.entries(obj)
    .map(([k, v]) => {
      const _k = k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
      const _v = k in unit ? `${v}${unit[k]}` : v;
      return `${_k}:${_v};`;
    })
    .join('');
}

export function generateCss(tokens: ResolvedToken<Token>[]): string {
  return generateCssVarible(tokens) + generateTypoGraphyClass(tokens);
}

export function generateCssVarible(tokens: ResolvedToken<Token>[]): string {
  const cssVarible = tokens
    .filter((t) => !t.resolveFailed)
    .reduce<string>((acc, token) => {
      const name = `--${token.name.split('.').join('-')}`;
      if (isTypographyToken(token)) {
        return acc;
      }
      if (isShadowToken(token)) {
        return acc + generateBoxShadowCssVarible(name, token as BoxShadowToken);
      }
      const value = token.value + (token.unit ? token.unit?.toString() : '');

      return acc + `${name}:${value};`;
    }, '');
  return `:root{${cssVarible}}`;
}

export function generateBoxShadowStyle(
  boxShadow: TokenBoxshadowValue,
  unit: TokenBoxshadowUnit,
): string {
  const { color, type } = boxShadow;
  const shadowType = type === BoxShadowTypes.OUTSET ? '' : 'inset';
  const partialValue = Object.keys(unit).reduce<string>(
    (acc, cur) => acc + cur in boxShadow ?
      `${boxShadow[cur as keyof TokenBoxshadowValue]}${unit[cur as keyof TokenBoxshadowUnit]}` : '',
    '',
  );

  return `${partialValue}${color} ${shadowType}`;
}

export function generateTypoGraphyStyle(
  value: TokenTypograpyValue,
  unit: TokenTypograpyUnit,
): string {
  return objectToCss(value, unit);
}

export function generateBoxShadowCssVarible(
  prefix: string,
  token: BoxShadowToken,
): string {
  let boxShadowStyle = '';
  if (Array.isArray(token.value)) {
    boxShadowStyle = token.value
      .map((shadow, index) => {
        return generateBoxShadowStyle(
          shadow,
          (token.unit as TokenBoxshadowUnit[])[index],
        );
      })
      .join(',');
  } else {
    boxShadowStyle = generateBoxShadowStyle(
      token.value as TokenBoxshadowValue,
      token.unit as TokenBoxshadowUnit,
    );
  }
  return `${prefix}: ${boxShadowStyle};`;
}

export function generateTypoGraphyClass(
  tokens: ResolvedToken<Token>[],
): string {
  const classStyles = tokens
    .filter((t) => !t.resolveFailed && isTypographyToken(t))
    .reduce<string>((acc, token) => {
      const className = `.${token.name.split('.').join('-')}`;
      return (
        acc +
        `${className}{${generateTypoGraphyStyle(
          token.value as TokenTypograpyValue,
          token.unit as TokenTypograpyUnit,
        )}}`
      );
    }, '');
  return classStyles;
}
