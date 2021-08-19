import { isObject, isEmpty, isArray } from 'lodash';
import fp from 'lodash/fp';

import { Rules } from './index';

export function getDefaultValue(sc: ISchema): any {
  const componentProps = sc['x-component-props'] || {};
  const componentType = sc.type;
  const isArrayType = componentType === 'array';
  const internalProps = (sc as ISchema)?.['x-internal'] || {};

  let defaultValue = sc.default || componentProps?.defaultValue;
  if (!defaultValue) {
    if (
      internalProps.defaultValues?.length || (isObject(internalProps.defaultValues) &&
        !isEmpty(internalProps.defaultValues))
    ) {
      defaultValue = internalProps.defaultValues;
    } else if (internalProps?.defaultValue) {
      defaultValue = internalProps.defaultValue;
    }
  }

  if (isArrayType) {
    return isArray(defaultValue) ? defaultValue : [defaultValue].filter(Boolean);
  }

  return defaultValue;
}

export function schemaRulesTransform(schema: ISchema): Rules {
  const { pipe, get } = fp;
  function toArray<T>(value: T): T[] {
    return isArray(value) ? value : [value].filter(Boolean);
  }
  const getRules = pipe(
    get('x-rules'),
    toArray,
  );
  const getFormats = pipe(
    get('format'),
    toArray,
  );
  return [...getRules(schema), ...getFormats(schema)];
}
