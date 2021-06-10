import { transform, isEqual, isArray, isObject } from 'lodash';

export function difference(
  origObj: Record<string, unknown>, newObj: Record<string, unknown>,
): Record<string, any> {
  function changes(newObj: Record<string, unknown>, origObj: Record<string, unknown>): Record<string, any> {
    let arrayIndexCounter = 0;
    return transform(newObj, function(
      result: Record<string, unknown>,
      value: any,
      key,
    ) {
      if (!isEqual(value, origObj[key])) {
        // eslint-disable-next-line no-plusplus
        const resultKey = isArray(origObj) ? arrayIndexCounter++ : key;
        result[resultKey] = (isObject(value) && isObject(origObj[key])) && !(value as any)._id ?
          changes(
            value as Record<string, unknown>,
            origObj[key] as Record<string, unknown>,
          ) : value;
      }
    });
  }
  return changes(newObj, origObj);
}

export function getOperateButtonPer(wIndex: number, authority: number) :boolean {
  const weightArr = authority.toString(2).split('').reverse();
  if (weightArr.length < 7) {
    for (let index = 0; index < 7 - weightArr.length; index += 1) {
      weightArr.push('0');
    }
  }
  if (weightArr[wIndex - 1] === '0') {
    return false;
  }

  return true;
}

