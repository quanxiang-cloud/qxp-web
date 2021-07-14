import { isObject, isEmpty } from 'lodash';

export function getDefaultValue(sc: ISchema): any {
  const componentProps = sc['x-component-props'] || {};
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
  return defaultValue;
}
