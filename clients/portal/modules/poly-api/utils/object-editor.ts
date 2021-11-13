import { isString, isNumber, isNaN, isNull } from 'lodash';

export function getFullPath(parentPath: string | null, name: string | null, index: number | null): string {
  if (isNull(parentPath)) {
    return name || '';
  }
  let currentPath = isString(name) && name ? name : '';
  if (!currentPath && isNumber(index) && !isNaN(index)) {
    currentPath = `${index}`;
  }
  return `${parentPath || ''}.${currentPath}`;
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
      index: name ? null : index,
      parentPath: _parentPath,
    };
  });
}
