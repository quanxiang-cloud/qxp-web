import { get } from 'lodash';
import { customAlphabet } from 'nanoid';
import fp, { pipe, entries, filter, fromPairs, every, equals, property, curry, map } from 'lodash/fp';

import toast from '@lib/toast';

const nanoid = customAlphabet('1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM', 8);

export function generateRandomFormFieldID(): string {
  return `field_${nanoid()}`;
}

export function numberTransform(schema: ISchema): number {
  const { pipe, get, toNumber, isFinite } = fp;
  const _numberTransform = pipe(get('x-index'), toNumber, (value) => {
    return (isNaN(value) || !isFinite(value)) ? 0 : value;
  });
  return _numberTransform(schema);
}

export function wrapSchemaByMegaLayout(schema: ISchema): ISchema {
  const properties = get(schema, 'properties', {});
  const xInternal = get(schema, 'x-internal', { });
  const labelAlign = get(xInternal, 'labelAlign', 'right');
  // const columnsCount = get(xInternal, 'columns', 1);

  return {
    type: 'object',
    'x-internal': {
      ...xInternal,
      defaultValueFrom: 'customized',
    },
    properties: {
      FIELDs: {
        properties,
        type: 'object',
        'x-component': 'mega-layout',
        'x-component-props': {
          labelAlign,
          wrapperCol: 20,
          // grid: true,
          // columns: columnsCount,
          // autoRow: true,
        },
      },
    },
  };
}

export function filterLinkagesOnDeleteField(
  fieldName: string,
  linkages: FormBuilder.VisibleHiddenLinkage[],
  filterLinkageRules: (fieldName: string, rules: FormBuilder.CompareRule[]) => FormBuilder.CompareRule[],
  filterLinkageTagetKeys: (fieldName: string, targetKeys: string[]) => string[],
): FormBuilder.VisibleHiddenLinkage[] {
  return linkages.filter((linkage) => {
    const isOneElement = pipe(property('length'), equals(1));
    const elementEqualsFieldName = (path: string): any => {
      return pipe(property(path), equals(fieldName));
    };
    const isLinkageTargetKeysEqualsFieldName = elementEqualsFieldName('targetKeys.0');
    const isLinkageRulesEqualsFieldName = elementEqualsFieldName('rules.0.sourceKey');

    if ((isOneElement(linkage.targetKeys) && isLinkageTargetKeysEqualsFieldName(linkage)) ||
        (isOneElement(linkage.rules) && isLinkageRulesEqualsFieldName(linkage))
    ) {
      return false;
    }

    linkage.rules = filterLinkageRules(fieldName, linkage.rules);
    linkage.targetKeys = filterLinkageTagetKeys(fieldName, linkage.targetKeys);

    return linkages;
  });
}

export function filterLinkageRules(
  fieldName: string, rules: FormBuilder.CompareRule[],
): FormBuilder.CompareRule[] {
  return rules.filter((rule) => {
    return rule.sourceKey !== fieldName;
  });
}

export function filterLinkageTargetKeys(fieldName: string, targetKeys: string[]): string[] {
  return targetKeys.filter((targetKey) => {
    return targetKey !== fieldName;
  });
}

export function shouldFilterLinkages(
  filedName: string, linkages: FormBuilder.VisibleHiddenLinkage[],
): boolean {
  const keys: Array<string> = [];
  linkages.forEach((linkage) => {
    linkage.rules.forEach((rule) => keys.push(rule.sourceKey));
    linkage.targetKeys.forEach((targetKey) => keys.push(targetKey));
  });

  return keys.includes(filedName);
}

export function getDefinedOne(
  firstOne?: boolean, secondOne?: boolean,
): boolean {
  return !!(firstOne ?? secondOne);
}

export const getValidateMessageMap: (schema: ISchema) => Record<string, string> = pipe(
  fp.get('properties.Fields.properties'),
  entries,
  map(([fieldName, fieldSchema]: [string, ISchema]) => {
    const getMessage = pipe(
      fp.get('x-rules'),
      (rules) => rules || {},
      ({ required, message }) => required ? message : null,
    );
    const message = getMessage(fieldSchema);
    return message ? [fieldName, message] : null;
  }),
  filter(Boolean),
  fromPairs,
);

type ValidateRegistryElement<T> = (configSchema: ISchema, configValue: T) => boolean
export const validateRegistryElement: Curried<ValidateRegistryElement<unknown>> = curry(
 <T>(configSchema: ISchema, configValue: T) => {
   const messageMap = getValidateMessageMap(configSchema);
   const validator = pipe(
     entries,
     map(([fieldName, message]: [string, string]) => {
       const isValid = configValue[fieldName as keyof typeof configValue];
       !isValid && toast.error(message);
       return isValid;
     }),
     every(Boolean),
   );

   return validator(messageMap);
 },
);
