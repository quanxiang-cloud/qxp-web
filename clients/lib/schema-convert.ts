type Field = {
  [key: string]: any;
}

type Properties = {
  [key: string]: ISchema;
}

type FilterFunc = (field: ISchema) => boolean

const schemaToFields = ({ properties }: ISchema, filterFunc?: FilterFunc): Array<Field> => {
  if (!properties) return [];

  const _field: Field[] = [];

  const recursionProperties = (properties: Record<string, any>): void => {
    Object.keys(properties)
      .forEach((key) => {
        const currentSchema = properties[key];
        const componentName = currentSchema['x-component']?.toLowerCase();

        if (!componentName) return;

        const isLayoutComponent = currentSchema?.isLayoutComponent;
        const parentField = currentSchema?.['x-internal']?.parentField;
        const tabIndex = currentSchema?.['x-internal']?.tabIndex;
        const xIndex = currentSchema?.['x-index'];

        const field = {
          ...currentSchema,
          fieldName: key,
          componentName: componentName,
          isLayoutComponent,
          parentField,
          tabIndex,
          'x-index': xIndex,
          id: key,
        };

        if (currentSchema.properties) {
          recursionProperties(currentSchema.properties);
        }

        if (filterFunc && !filterFunc(currentSchema)) return;

        _field.push(field);
      });
  };

  recursionProperties(properties);

  return _field;
};

export const fieldsToSchema = (fields: Array<Field>): ISchema => {
  const properties: Properties = {};

  fields.forEach((field) => {
    const fileName = field.fieldName;

    if (field.parentField) return;

    properties[fileName] = {
      ...field,
      properties: {},
    };
  });

  fields.forEach((field) => {
    const fileName = field.fieldName;

    if (!field.parentField) return;

    const parentProperties = properties[field.parentField].properties;

    if (parentProperties === undefined) return;

    parentProperties[fileName] = field;
  });

  return {
    type: 'object',
    title: '',
    properties,
  };
};

export default schemaToFields;
