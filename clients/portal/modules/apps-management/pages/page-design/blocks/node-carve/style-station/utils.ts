import { CSSProperties } from 'react';
import { camelCase, kebabCase } from 'lodash';

export type PartialCSSProperties<T extends keyof CSSProperties> = Partial<Pick<CSSProperties, T>>

export function matchCssClassBrackets(cssString: string): string[] {
  const classBracketsReg = /[\w.-]+{((.|\n)*?)}/g;
  return cssString?.match(classBracketsReg) || [];
}

export function jsonObjToFormattedCssString(
  cssObj: Record<string, string | number>,
  selector: string,
): string {
  const cssStringArray = Object.keys(cssObj).map((key) => {
    const cssPropKey = kebabCase(key);
    const cssPropValue = cssObj[key];
    return `\t${cssPropKey}:${cssPropValue};\n`;
  });

  const cssFormateString = `${selector}{\n${cssStringArray.join('')}}`;
  return cssFormateString;
}

export function cssStringToJsonObj(formattedCssString?: string): CSSProperties | undefined {
  if (!formattedCssString) return;

  const cssClassStringArray = matchCssClassBrackets(formattedCssString);

  if (!cssClassStringArray.length) return;

  const firstCssClassString = cssClassStringArray[0];

  if (!firstCssClassString) return;

  const keyReg = /([\w-]+):/;
  const valueReg = /:([^:;]+);/;
  const cssPropReg = /[^:;\s][a-z-]+:[^:;]+;/g;
  const classContentString = firstCssClassString?.trim()?.match(/\{([\s\S]*)\}$/)?.[1];

  if (!classContentString) return;

  const cssPropsRawArray = classContentString?.match(cssPropReg) || [];

  if (!cssPropsRawArray.length) return {};

  const cssPropsKeyValueArray = cssPropsRawArray.map((cssPropString) => {
    const key = camelCase(keyReg.exec(cssPropString)?.[1]);
    const _value = valueReg.exec(cssPropString)?.[1].trim();
    const numValue = Number(_value);
    const value = _value && isNaN(numValue) ? _value : numValue;
    return [key, value];
  });
  const cssProperties = Object.fromEntries(cssPropsKeyValueArray);
  return cssProperties;
}

export function getClearObjectValueFromKeys(keys: string[]): Record<string, string> {
  const clearedObj = Object.fromEntries(keys.map((key) => [key, '']));
  return clearedObj;
}
