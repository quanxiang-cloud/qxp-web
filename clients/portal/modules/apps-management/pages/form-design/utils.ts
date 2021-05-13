export function getFilterField(field: PageField): FilterField {
  const filter = {
    id: field.id,
    placeholder: field.cProps.placeholder || '',
    label: field.label,
  };

  if (field.type === 'datetime') {
    return {
      ...filter,
      type: field.option?.range ? 'date_range' : 'date',
    };
  }

  if (field.enum) {
    return {
      ...filter,
      type: 'select',
      multiple: false,
      enum: field.enum,
    };
  }

  if (field.type === 'number') {
    return {
      ...filter,
      type: 'number',
      precision: field.cProps.precision,
      step: field.cProps.step,
      compareSymbol: field.option?.compareSymbol,
    };
  }

  return {
    type: field.type,
    ...filter,
  };
}

export function getAttribute(config: Record<string, any>, index: number) {
  if (!config) {
    return {
      visible: true,
      sort: index,
    };
  }

  return {
    visible: 'visible' in config ? config.visible : true,
    sort: 'sort' in config ? config.sort : index,
  };
}
