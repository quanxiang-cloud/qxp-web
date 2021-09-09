import { cloneDeep, get, isEmpty, omit, set, values } from 'lodash';

import registry from '@c/form-builder/registry';
import logger from '@lib/logger';

import { generateRandomFormFieldID } from './index';

export const findIndex = (id: string, arr: FormItem[]): number => {
  return arr.findIndex((field) => field.fieldName === id);
};

// Deal with field by config
export function formatFieldWithConfig(currentField: Record<string, any>): FormItem | null {
  if (!currentField) return null;
  const componentName = (currentField['x-component'] || currentField['componentName'])?.toLowerCase();
  if (!componentName || !registry.elements[componentName]) {
    logger.error('fatal! there is no x-component in schema:', currentField);
    return null;
  }

  const configValue = registry.elements[componentName].toConfig(currentField);
  const xInternal = currentField?.['x-internal'] || {};
  const xIndex = currentField?.['x-index'];

  const field: FormItem = {
    // fieldName: currentField?.['fieldName'],
    componentName,
    configValue,
    tabIndex: xInternal?.tabIndex,
    'x-index': xIndex || 0,
    'x-internal': {
      ...xInternal,
      fieldId: getFieldId(currentField),
    },
  };

  return field;
}

export function getNewField({
  fieldId,
  tabIndex,
  parentFieldId,
  appID,
}: {
  fieldId: string;
  appID: string;
  tabIndex?: string;
  parentFieldId?: string;
}): FormBuilder.SourceElement<any> {
  const field: FormBuilder.SourceElement<any> = registry.elements[fieldId.toLocaleLowerCase()];
  const newField = {
    ...field,
    configValue: { ...field.defaultConfig, appID },
  };
  set(newField, 'x-internal.tabIndex', tabIndex);
  set(newField, 'x-internal.parentFieldId', parentFieldId);
  set(newField, 'x-internal.fieldId', generateRandomFormFieldID());

  return newField;
}
/** core deal with schema-tree */
/**
 * get schema tree structure
 * @param {ISchema[]} schemaTreeArr
 * @return {Record<string, ISchema>}
 */
function schemaArrToTree(schemaTreeArr: ISchema[]): Record<string, ISchema> {
  return schemaTreeArr.reduce((acc: Record<string, ISchema>, item: ISchema) => {
    const key: string = getFieldId(item);
    if (key) acc[key] = item;

    return acc;
  }, {} as Record<string, ISchema>);
}

/**
 * core: get schema tree structure array
 * @param {ISchema[]} flattedSchemas flatted schema
 * @param {number} rootComponentLen the root component length
 * @return {ISchema[]} ISchema structure of array
 */
export function dynamicRecombinationSchema(
  flattedSchemas: ISchema[],
  rootComponentLen: number,
): ISchema[] {
  if (!rootComponentLen) return [];
  const _flattedSchemas = cloneDeep(flattedSchemas);

  while (_flattedSchemas?.length !== rootComponentLen) {
    const allPids = [...new Set(_flattedSchemas.map(
      (v: ISchema) => v['x-internal']?.parentFieldId).filter(Boolean),
    )];

    for (let i = 0; i < _flattedSchemas.length; i += 1) {
      const pId = _flattedSchemas[i]['x-internal']?.parentFieldId;

      const currentField = _flattedSchemas[i];

      if (pId && !allPids.includes(currentField?.['x-internal']?.fieldId)) {
        const pField = _flattedSchemas.find((v: ISchema) => v?.['x-internal']?.fieldId === pId);

        if (pField) {
          set(pField, `properties.${currentField?.['x-internal']?.fieldId}`, currentField);
          const cDis = values(pField?.properties)?.every((cField) => !cField?.display);
          set(pField, 'display', !cDis);
        }
        _flattedSchemas.splice(i, 1);
      }
    }
  }

  return _flattedSchemas || [];
}

export function convertSchemaTree(
  flattedSchemas: ISchema[],
  rootComponentLen: number,
): Record<string, ISchema> {
  return schemaArrToTree(dynamicRecombinationSchema(flattedSchemas, rootComponentLen));
}

// get fieldId
export function getFieldId(field: ISchema): string {
  return get(field, 'x-internal.fieldId') || get(field, 'fieldName');
}

export function flattenSchemaToFields(schema: ISchema): FormItem[] {
  const fieldsArr: FormItem[] = [];
  const recu = ({ properties }: ISchema): void => {
    if (isEmpty(properties)) return;
    values(properties).forEach((_field) => {
      const field = formatFieldWithConfig(_field);
      const currentField = omit(cloneDeep(field), 'properties');

      // fallback: will remove this code!
      if (field?.['x-internal']?.parentField) {
        set(field, 'x-internal.parentFieldId', field?.['x-internal']?.parentField);
      }
      if (field?.fieldName) {
        set(field, 'x-internal.fieldId', field?.fieldName);
      }

      fieldsArr[(currentField?.['x-index'] || 0)] = currentField;
      if (!isEmpty(_field?.properties)) recu(_field);
    });
  };

  recu(schema);
  return fieldsArr.filter(Boolean);
}
