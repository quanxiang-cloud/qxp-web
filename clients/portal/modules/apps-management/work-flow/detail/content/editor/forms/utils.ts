const excludeComps = ['SubTable'];

export const getSchemaFields = (schema: ISchema | undefined) => Object.entries(schema?.properties || {})
  .filter(([, field]) => {
    const compName = field['x-component'];
    return compName && !excludeComps.includes(compName);
  })
  .map(([key, fieldSchema]) => {
    return { label: fieldSchema.title as string, value: key };
  });
