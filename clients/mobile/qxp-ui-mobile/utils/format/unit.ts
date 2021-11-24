import { CSSProperties } from 'react';
import { isDef, inBrowser, isNumeric } from '..';

export function addUnit(value?: string | number): string | undefined {
  if (!isDef(value)) {
    return undefined;
  }

  const _value = String(value);
  return isNumeric(_value) ? `${_value}px` : _value;
}

export function getSizeStyle(originSize?: string | number, originStyle?: CSSProperties): CSSProperties {
  if (isDef(originSize)) {
    const size = addUnit(originSize);
    return {
      ...(originStyle || {}),
      width: size,
      height: size,
    };
  }
  return originStyle || {};
}

export function getZIndexStyle(zIndex?: string | number): CSSProperties {
  const style: CSSProperties = {};
  if (zIndex !== undefined) {
    style.zIndex = +zIndex;
  }
  return style;
}

// cache
let rootFontSize: number;

function getRootFontSize(): number {
  if (!rootFontSize) {
    const doc = document.documentElement;
    const fontSize = doc.style.fontSize || window.getComputedStyle(doc).fontSize;

    rootFontSize = parseFloat(fontSize);
  }

  return rootFontSize;
}

function convertRem(value: string): number {
  const _value = value.replace(/rem/g, '');
  return +_value * getRootFontSize();
}

function convertVw(value: string): number {
  const _value = value.replace(/vw/g, '');
  return (+_value * window.innerWidth) / 100;
}

function convertVh(value: string): number {
  const _value = value.replace(/vh/g, '');
  return (+_value * window.innerHeight) / 100;
}

export function unitToPx(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }

  if (inBrowser) {
    if (value.indexOf('rem') !== -1) {
      return convertRem(value);
    }
    if (value.indexOf('vw') !== -1) {
      return convertVw(value);
    }
    if (value.indexOf('vh') !== -1) {
      return convertVh(value);
    }
  }

  return parseFloat(value);
}
