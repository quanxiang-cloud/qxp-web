import { get, find } from 'lodash';

export const wrapSchemaWithFieldPermission = (schema: ISchema, permissions: Record<string, any>[] = []): ISchema => {
  const properties = get(schema, 'properties', {});
  const mapProperties = Object.entries(properties).reduce((acc: Record<string, any>, [key, fieldSchema]: [string, ISchema]) => {
    const foundPermission = find(permissions, { id: key });
    if (foundPermission) {
      Object.assign(acc, {
        [key]: {
          ...fieldSchema,
          visible: !!foundPermission.read,
          editable: !!foundPermission.write,
        },
      });
    } else {
      // if not defined field permission, set field as visible, readonly
      Object.assign(acc, { [key]: { ...fieldSchema, visible: true, editable: false } });
    }
    return acc;
  }, {});

  return {
    ...schema, properties: mapProperties,
  };
};
