import { isNull, flattenDeep } from 'lodash';

import type { ItemStore } from '../components/object-editor/store';
import type { Row } from '../components/object-editor';

export function getFullPath(parentPath: string | null, name: string | null, index: number): string {
  const currentName = isNull(name) ? `${index}` : name;
  return isNull(parentPath) ? currentName : `${parentPath}.${currentName}`;
}

export function fromObjectSchemaToApiData(objectSchema: POLY_API.ObjectSchema[]): POLY_API.PolyNodeInput[] {
  return objectSchema.map(({ type, name, required, desc, children, in: _in }) => {
    const childrenData = fromObjectSchemaToApiData(children);
    return {
      type,
      name: name || '',
      desc,
      data: childrenData,
      in: _in,
      required,
    };
  });
}

export function fromApiDataToObjectSchema(
  data: POLY_API.PolyNodeInput[], _parentPath: string | null = null,
): POLY_API.ObjectSchema[] {
  return data.map(({ type, name, desc, data: childrenData, required, in: _in }, index: number) => {
    const parentPath = _parentPath ? getFullPath(_parentPath, name, index) : name;
    const children = fromApiDataToObjectSchema(childrenData, parentPath);
    return {
      type,
      name,
      desc,
      children,
      required,
      in: _in,
      index,
      parentPath: _parentPath,
    };
  });
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
  parentPath: string | null, _in: 'body' | 'header' | 'query' | 'path' = 'body',
): POLY_API.ObjectSchema {
  return {
    type: 'string',
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
