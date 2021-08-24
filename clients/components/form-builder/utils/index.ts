import { get, has } from 'lodash';
import { customAlphabet } from 'nanoid';
import fp, {
  pipe, entries, filter, fromPairs, every, equals, property, curry, map, cond,
} from 'lodash/fp';

import toast from '@lib/toast';
import { PERMISSION } from '@c/form-builder/constants';

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
  fieldName: string, linkages: FormBuilder.VisibleHiddenLinkage[],
): boolean {
  const keys: Array<string> = [];
  linkages.forEach((linkage) => {
    linkage.rules.forEach((rule) => keys.push(rule.sourceKey));
    linkage.targetKeys.forEach((targetKey) => keys.push(targetKey));
  });

  return keys.includes(fieldName);
}

export function getDefinedOne(
  firstOne?: boolean, secondOne?: boolean,
): boolean {
  return !!(firstOne ?? secondOne);
}

export const getValidateMessageMap = <T>(schema: ISchema, configValue: T): Record<string, string> => {
  const getMessageMap = pipe(
    fp.get('properties.Fields.properties'),
    entries,
    map(([fieldName, fieldSchema]: [string, ISchema]) => {
      const getMessage = pipe(
        fp.get('x-rules'),
        (rules) => rules || {},
        ({ required, message }) => required ? message : null,
      );
      const message = getMessage(fieldSchema);
      const { title } = configValue as unknown as { title: string };
      return message ? [fieldName, title ? `${title}: ${message}` : message] : null;
    }),
    filter(Boolean),
    fromPairs,
  );

  return getMessageMap(schema);
};

type ValidateRegistryElement<T> = (configSchema: ISchema, configValue: T) => boolean
export const validateRegistryElement: Curried<ValidateRegistryElement<unknown>> = curry(
 <T>(configSchema: ISchema, configValue: T) => {
   const messageMap = getValidateMessageMap<T>(configSchema, configValue);
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

export function schemaReadOnlyVisibleTransform<T extends ISchema>(schema: T): T {
  const propertiesTransform = pipe(
    fp.get('properties'),
    entries,
    map(([_, field]: [string, SchemaFieldItem]) => {
      if (field.properties) {
        field.properties = propertiesTransform(field);
      }
      const fieldTransform = pipe(
        fp.get('x-internal.permission'),
        cond([
          [(permission) => permission === PERMISSION.READONLY, () => {
            field.readOnly = true;
          }],
          [(permission) => permission === PERMISSION.INVISIBLE, () => {
            field.visible = false;
          }],
        ]),
      );
      fieldTransform(field);
      return [_, field];
    }),
    fromPairs,
  );

  schema.properties = propertiesTransform(schema);
  return schema;
}

export function validateDatasetElement<T>(value: T, schema?: ISchema): boolean {
  const props = get(schema, 'properties.Fields.properties', {});
  return Object.entries(props).every(([key, conf]: [string, any]) => {
    const rules = get(conf, 'x-rules', {}) as { required?: boolean, message?: string };
    if (has(conf, 'required')) {
      Object.assign(rules, { required: conf?.required, message: `${conf?.title}不能为空` });
    }

    if (!rules || (rules && !rules?.required)) {
      return true;
    }

    const val = get(value, key);
    const checkedValueFrom = get(value, 'defaultValueFrom');
    if (checkedValueFrom === 'customized') {
      if (key !== 'datasetId' && !val) {
        toast.error(rules?.message);
        return false;
      }
    }

    if (checkedValueFrom === 'dataset') {
      if (!val) {
        toast.error(rules?.message);
        return false;
      }
    }

    return true;
  });
}

export function splitValue(val: string): LabelValue {
  let handedOption = { label: '', value: '' };
  if (val.indexOf(':') === -1) return handedOption;

  const index = val.lastIndexOf(':');
  const label = val.substring(0, index);
  const value = val.substring(index + 1);
  handedOption = { label, value };
  return handedOption;
}

