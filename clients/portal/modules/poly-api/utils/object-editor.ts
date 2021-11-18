import { isNull, flattenDeep, isArray, isString } from 'lodash';

import type { ItemStore } from '../components/object-editor/store';
import type { Row } from '../components/object-editor';

export function getFullPath(parentPath: string | null, name: string | null, index: number): string {
  const currentName = isNull(name) ? `${index}` : name;
  return isNull(parentPath) ? currentName : `${parentPath}.${currentName}`;
}

function objectSchemaToNodeInput(
  schema: POLY_API.ObjectSchema, data: POLY_API.PolyNodeInput[],
): POLY_API.PolyNodeInput {
  const { type, name, required, desc, rule, in: _in } = schema;
  return {
    type: rule ? 'direct_expr' : type,
    name: name || '',
    desc,
    data: rule || (!isObjectField(type) && isArray(data) ? '' : data),
    in: _in,
    required,
  };
}

export function fromObjectSchemaToApiData(
  objectSchema: POLY_API.ObjectSchema[], searchSet: POLY_API.ObjectSchema[] = objectSchema,
): POLY_API.PolyNodeInput[] {
  const schemaTraversTable = new Map<POLY_API.ObjectSchema, boolean>();
  return objectSchema.reduce((acc: POLY_API.PolyNodeInput[], schema) => {
    if (schemaTraversTable.get(schema)) {
      return acc;
    }
    const { name, parentPath, index } = schema;
    const currentPath = getFullPath(parentPath, name, index);
    const data = searchSet.filter((schema) => {
      if (schema.parentPath === currentPath) {
        schemaTraversTable.set(schema, true);
        return true;
      }
    });
    acc.push(objectSchemaToNodeInput(schema, fromObjectSchemaToApiData(data, searchSet)));
    return acc;
  }, []);
}

export function fromApiDataToObjectSchema(
  data: POLY_API.PolyNodeInput[], _parentPath: string | null = null,
): POLY_API.ObjectSchema[] {
  return data.map(({ type, name, desc, data: childrenData, required, in: _in }, index: number) => {
    const parentPath = _parentPath ? getFullPath(_parentPath, name, index) : name;
    const children = isArray(childrenData) ? fromApiDataToObjectSchema(childrenData, parentPath) : [];
    return {
      type,
      name,
      desc,
      children,
      required,
      in: _in,
      index,
      rule: type === 'direct_expr' && isString(childrenData) ? childrenData : undefined,
      parentPath: _parentPath,
    };
  });
}

export function fromApiDataToPolyConstSchema(data: POLY_API.PolyConst[]): POLY_API.PolyConstSchema[] {
  return data.map(({ type, name, desc, data, in: _in }, index) => ({
    type,
    name,
    desc,
    data,
    in: _in,
    index,
    children: [],
  }));
}

export function fromPolyConstSchemaToApiData(data: POLY_API.PolyConstSchema[]): POLY_API.PolyConst[] {
  return data.map(({ type, name, desc, data, in: _in }) => ({
    type,
    name,
    desc,
    data,
    in: _in,
  }));
}

export function storeValuesToDataSource<T extends { children: T[] }>(storeValues$: ItemStore<T>[]): Row<T>[] {
  return flattenDeep(storeValues$.map((current$) => {
    const { value, children$, parent$ } = current$;
    const { children } = value;
    const item = { ...value, children$, parent$, current$ };
    if (children.length) {
      return [item, storeValuesToDataSource(children$)];
    }
    return item;
  }));
}

export function getObjectEditorNewField(
  parentPath: string | null, _in: 'body' | 'header' | 'query' | 'path' = 'body', type = 'string',
): POLY_API.ObjectSchema {
  return {
    type: type as POLY_API.API_FIELD_TYPE,
    in: _in,
    name: '',
    index: 0,
    parentPath,
    required: false,
    desc: '',
    children: [],
  };
}

export function getObjectEditorNewConstantField(): POLY_API.PolyConstSchema {
  return {
    type: 'string',
    name: '',
    in: 'hide',
    desc: '',
    data: '',
    index: 0,
    children: [],
  };
}

export function insertToArray<T>(array: T[], index: number, value: T): T[] {
  return [
    ...array.slice(0, index),
    value,
    ...array.slice(index),
  ];
}

export function isObjectField(type: string): boolean {
  return ['object', 'array'].includes(type);
}
