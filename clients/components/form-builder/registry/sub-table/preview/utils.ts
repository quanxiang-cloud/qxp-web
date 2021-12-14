import { isObject, isEmpty, isArray } from 'lodash';
import fp from 'lodash/fp';
import { omit } from 'ramda';

import { Rules } from './index';

export function getDefaultValue(sc: ISchema): any {
  const componentProps = sc['x-component-props'] || {};
  const componentType = sc.type;
  const isArrayType = componentType === 'array';

  let defaultValue = sc.default || componentProps?.defaultValue;
  if (!defaultValue) {
    if (
      componentProps.defaultValues?.length || (isObject(componentProps.defaultValues) &&
        !isEmpty(componentProps.defaultValues))
    ) {
      defaultValue = componentProps.defaultValues;
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

export function omitParentFromSchema(schema: ISchema): ISchema {
  return JSON.parse(JSON.stringify(omit(['parent'], schema)));
}
