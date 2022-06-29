import { ShadowValueDetail } from '../shadow-config';

export function getValidMaxValue(stringArray: (string | undefined)[]): string {
  const validValue = (stringArray as string[]).filter((value) => !isNaN(parseInt(value)))
    .sort((a, b) => parseFloat(b) - parseFloat(a));

  if (!validValue.length) return '0';
  return validValue[0];
}

export function isNumberString(value: string): boolean {
  const reg = /^[0-9]+\.?[0-9]*$/;
  return reg.test(value);
}

export function firstWordUpperCase(value: string): string {
  if (!value.trim()) return '';
  const firstChar = value.charAt(0).toUpperCase();
  return firstChar + value.slice(1);
}

export function shadowDetailValueToString(detail: ShadowValueDetail): string {
  const valueArr = [detail.x, detail.y, detail.blur, detail.spread, detail.color];
  if (detail.type === 'inset') {
    return ['inset'].concat(valueArr).join(' ');
  }
  return valueArr.join(' ');
}
