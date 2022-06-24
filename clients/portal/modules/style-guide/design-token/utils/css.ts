import { isShadowToken, isTypographyToken } from '.';
import { BoxShadowTypes, TYPE_MAPS } from '../constants/constants-types';
import { BoxShadowToken, Token, TypographyToken } from '../types/token';
import { TokenBoxshadowUnit, TokenBoxshadowValue } from '../types/values';
import { aliasRegex } from './aliases';
import { ResolvedToken } from './token-helper';

function resolveClassNameByTokenName(name: string): string {
  return `.${name.split('.').join('-')}`;
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
        return (
          acc +
          `${name}: ${generateWholeBoxShadowStyle(token as BoxShadowToken)};`
        );
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
  const shadowType = type === BoxShadowTypes.OUTSET ? '' : ' inset';
  const partialValue = Object.keys(unit).reduce<string>(
    (acc, cur) =>
      acc +
      (cur in boxShadow ?
        `${boxShadow[cur as keyof TokenBoxshadowValue]}${
          unit[cur as keyof TokenBoxshadowUnit]
        } ` :
        ''),
    '',
  );

  return `${partialValue}${color}${shadowType}`;
}

export function generateWholeBoxShadowStyle(token: BoxShadowToken): string {
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
  return boxShadowStyle;
}

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

export function generateClasses(tokens: ResolvedToken<Token>[]): string {
  const classStyles = tokens
    .filter((t) => !t.resolveFailed)
    .reduce<string>((acc, token) => {
      if (isTypographyToken(token)) {
        return acc + generateTypoGraphyClass(token as TypographyToken);
      }
      if (isShadowToken(token)) {
        return acc + generateBoxShadowClass(token as BoxShadowToken);
      }
      if (TYPE_MAPS[token.type]) {
        return acc + generateMapingTypeClass(token);
      }

      return acc + generateNormalClass(token);
    }, '');

  return classStyles;
}

export function generateNormalClass(token: ResolvedToken<Token>): string {
  const className = resolveClassNameByTokenName(token.name);
  const styleValue = objectToCss(
    { [token.type]: token.value as string },
    {
      [token.type]: (token.unit as string) || '',
    },
  );
  return `${className}{${styleValue}}`;
}

export function generateTypoGraphyClass(
  token: ResolvedToken<TypographyToken>,
): string {
  const className = resolveClassNameByTokenName(token.name);
  return `${className}{${objectToCss(token.value, token.unit)}}`;
}

export function generateBoxShadowClass(
  token: ResolvedToken<BoxShadowToken>,
): string {
  const className = resolveClassNameByTokenName(token.name);
  return `${className}{box-shadow:${generateWholeBoxShadowStyle(token)}}`;
}

export function generateMapingTypeClass(token: ResolvedToken<Token>): string {
  const map = TYPE_MAPS[token.type] || {};
  return Object.entries(map).reduce((acc, [key, value]) => {
    const className = resolveClassNameByTokenName(token.name).slice(1);
    const classToken = {
      ...token,
      name: className,
    };
    const _className = replaceMatchValue(key, classToken);
    const _value = replaceMatchValue(value, classToken);
    return acc + `.${_className}{${_value}}`;
  }, '');
}

export function replaceMatchValue(
  cssString: string,
  reflectMap: ResolvedToken<Token>,
): string {
  const matches = cssString.match(aliasRegex) || [];
  let newStr = cssString;
  matches.forEach((matchStr) => {
    const key = matchStr.slice(
      1,
      matchStr.length - 1,
    ) as keyof ResolvedToken<Token>;
    if (typeof reflectMap[key] === 'string') {
      newStr = newStr.replace(matchStr, reflectMap[key] as string);
    }
  });
  return newStr;
}

export function generateCss(tokens: ResolvedToken<Token>[]): string {
  return generateCssVarible(tokens) + generateClasses(tokens);
}
