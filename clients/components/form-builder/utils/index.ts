import { get, has, merge } from 'lodash';
import { customAlphabet } from 'nanoid';
import { Curry } from 'ts-toolbelt/out/Function/Curry';
import fp, {
  pipe, entries, filter, fromPairs, every, equals, property, curry, map, cond, values, stubTrue,
} from 'lodash/fp';

import toast from '@lib/toast';

import {
  INVALID_INVISIBLE,
  INVALID_NORMAL,
  INVALID_READONLY,
  INVALID_READONLY_LEGACY,
  INVISIBLE_NO_READ,
  INVISIBLE_NO_WRITE,
  INVISIBLE_WITH_WRITE,
  NORMAL,
  PERMISSION,
  READONLY_NO_WRITE,
  READONLY_WITH_WRITE,
} from '../constants';

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
  const xInternal = get(schema, 'x-internal', {});
  const labelAlign = get(xInternal, 'labelAlign', 'right');
  // const columnsCount = get(xInternal, 'columns', 1);

  return {
    ...schema,
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

type ValidateRegistryElement<T> = (configSchema: ISchema, configValue?: T) => boolean
export const validateRegistryElement: Curry<ValidateRegistryElement<unknown>> = curry(
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

type PermissionToOverwrite = { display?: boolean; readOnly?: boolean };
export function schemaPermissionTransformer<T extends ISchema>(
  schema: T, readOnly?: boolean, workFlowType?: string,
): T {
  function isLayoutSchema(field: ISchema): boolean {
    return !!get(field, 'x-internal.isLayoutComponent');
  }
  function permissionTransformer(permissionToOverwrite: PermissionToOverwrite, field: ISchema): () => void {
    field?.['x-internal']?.isSystem && Object.assign(permissionToOverwrite, { display: false });
    return () => merge(field, permissionToOverwrite);
  }

  const permissionToSchemaProperties = (field: ISchema, permission: PERMISSION): void => {
    const transformer = cond([
      [isPermissionReadOnly, permissionTransformer({ display: true, readOnly: true }, field)],
      [isPermissionInvisible, permissionTransformer({ display: false }, field)],
      [isPermissionNormal, permissionTransformer({ display: true, readOnly: false }, field)],
    ]);
    const conditions = cond([
      [(type) => type === 'APPLY_PAGE', permissionTransformer({ display: true, readOnly: true }, field)],
      [stubTrue, () => transformer(permission)],
    ]);
    conditions(workFlowType);
  };

  const fieldTransform = pipe(
    (field: ISchema) => [fp.get('x-internal.permission', field), field],
    ([permission, field]: [PERMISSION, ISchema]) => {
      return permissionToSchemaProperties(field, readOnly ? READONLY_NO_WRITE : permission);
    },
  );

  const schemaPermissionTransform = pipe(
    (property: 'properties' | 'items.properties', field: T) => fp.get(property, field) || {},
    entries,
    map(([_, inputField]: [string, ISchema]) => {
      const field: ISchema = inputField.properties || inputField.items ?
        schemaPermissionTransformer(inputField, readOnly) :
        inputField;
      !isLayoutSchema(field) && field?.['x-component'] && fieldTransform(field);
      return [_, field];
    }),
    fromPairs,
  );

  if (schema.properties) {
    schema.properties = schemaPermissionTransform('properties', schema);
  }
  if ((schema.items as ISchema)?.properties) {
    (schema.items as ISchema).properties = schemaPermissionTransform('items.properties', schema);
    fieldTransform(schema);
  }

  const layoutPermissionTransform = pipe(
    (field: ISchema) => [values(field.properties), field],
    ([fieldSchemas, field]: [ISchema[], ISchema]) => {
      const isInvisible = fieldSchemas.every((schema: ISchema) => !schema.display);
      return [isInvisible, field];
    },
    ([isLayoutComponentInvisible, field]) => {
      const permissionToOverwrite = { display: false, readOnly: true };
      isLayoutComponentInvisible && merge(field, permissionToOverwrite);
    },
  );
  isLayoutSchema(schema) && layoutPermissionTransform(schema);

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

export function getSchemaPermissionFromSchemaConfig(
  value: { displayModifier: FormBuilder.DisplayModifier },
): PERMISSION {
  const isReadonly = value.displayModifier === 'readonly';
  const isHidden = value.displayModifier === 'hidden';
  if (isReadonly) {
    return INVALID_READONLY;
  }
  if (isHidden) {
    return INVALID_INVISIBLE;
  }
  return INVALID_NORMAL;
}

export function getDisplayModifierFromSchema(schema: ISchema): FormBuilder.DisplayModifier {
  const permission = get(schema, 'x-internal.permission');
  if (isPermissionReadOnly(permission)) {
    return 'readonly';
  }
  if (isPermissionInvisible(permission)) {
    return 'hidden';
  }
  if (isPermissionNormal(permission)) {
    return 'normal';
  }
  if (schema.readOnly === true) {
    return 'readonly';
  }
  if (schema.display === false) {
    return 'hidden';
  }
  return 'normal';
}

export function isPermissionInvisible(permission?: PERMISSION): boolean {
  return [INVISIBLE_NO_READ, INVISIBLE_NO_WRITE, INVISIBLE_WITH_WRITE, INVALID_INVISIBLE].some(
    (per) => per === permission,
  );
}

export function isPermissionReadOnly(permission: PERMISSION): boolean {
  return [
    READONLY_NO_WRITE, READONLY_WITH_WRITE, INVALID_READONLY_LEGACY, INVALID_READONLY,
  ].includes(permission);
}

export function isPermissionNormal(permission: PERMISSION): boolean {
  return [NORMAL, INVALID_NORMAL].includes(permission);
}

export function isPermissionReadable(permission: PERMISSION): boolean {
  return [
    READONLY_NO_WRITE, READONLY_WITH_WRITE, INVISIBLE_NO_WRITE, INVISIBLE_WITH_WRITE, NORMAL,
    INVALID_READONLY_LEGACY,
  ].includes(permission);
}

export function isPermissionWriteable(permission: PERMISSION): boolean {
  return [READONLY_WITH_WRITE, INVISIBLE_WITH_WRITE, NORMAL].includes(permission);
}

export function isPermissionHiddenAble(permission: PERMISSION): boolean {
  return [INVISIBLE_NO_WRITE, INVISIBLE_WITH_WRITE].includes(permission);
}

export function isPermissionEditable(permission?: PERMISSION): boolean {
  return NORMAL === permission || permission === INVALID_NORMAL;
}

export function calculateFieldPermission(
  editable: boolean,
  invisible: boolean,
  writeable: boolean,
  readable: boolean,
  isFromWorkFlow?: boolean,
): PERMISSION {
  const permissions = [0b1000, 0b0100, 0b0010, 0b0001];
  const options = [editable, invisible, writeable, readable];
  const permission = permissions.reduce((acc, permission, index) => {
    return acc + (options[index] ? permission : 0b0000);
  }, 0b0000) as PERMISSION;
  const availablePermisssions = [0, 1, 3, 5, 7, 11];
  !isFromWorkFlow && availablePermisssions.push(...[4, 8, 9]);
  if (!availablePermisssions.includes(permission)) {
    toast.error(`权限配置错误 ${permission}`);
    throw new Error(`${permission}`);
  }
  return permission;
}

// in order to be compatible with previous version enums
export function convertEnumsToLabels(labelValues: Array<string | LabelValue>): string[] {
  return labelValues.map((option) => {
    if (typeof option === 'string') {
      return option;
    }

    return option?.label;
  });
}

export const placeholderSchema = {
  id: '',
  type: 'object',
  properties: {},
  'x-internal': {},
};

// tips, sort Obj
export function sortProperties(properties: ISchema[] = []): Record<string, ISchema> {
  return values(properties).reduce((acc, item) => {
    const xIndex = item['x-index'] || 0;
    acc[xIndex] = item;
    return acc;
  }, {} as Record<string, ISchema>);
}

export function updateFieldIndex(fields: FormItem[]): FormItem[] {
  return [...fields].map((item, index) => {
    item['x-index'] = index;

    return item;
  });
}

export function convertMultipleSelectDefaults(Enum: Array<Record<string, string | boolean>>): string[] | void {
  const defaults = Enum.filter(({ isDefault }) => isDefault);
  if (defaults.length) {
    return defaults.map(({ label }) => label as string);
  }
}

export function convertSingleSelectDefault(defaultOption: Record<string, string | boolean>): string {
  if (defaultOption) {
    return defaultOption.label as string;
  }

  return '';
}

export function getNoLabelValues(value: LabelValue[]): string[] {
  return ((value || []) as LabelValue[]).reduce<string[]>((acc, val) => {
    // Es object conversion label is missing
    if (val.value && !val.label) {
      return [...acc, val.value];
    }

    return acc;
  }, []);
}
