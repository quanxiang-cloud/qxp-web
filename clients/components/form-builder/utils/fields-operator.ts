export const findContainer = (id: string, fields: FormItem[] | undefined): FormItem[] | undefined => {
  if (!fields) return;

  let target: FormItem[] | undefined;
  fields.forEach((field) => {
    if (field.fieldName === id) return target = fields;

    const _target = findContainer(id, field?.children);
    if (_target) {
      target = _target;
    }
  });
  return target;
};

export const findField = (id: string, fields: FormItem[]): FormItem | null => {
  let target: FormItem | null = null;

  const recurse = (fields?: FormItem[]): void => {
    if (!fields) return;
    fields.forEach((itm) => {
      if (itm.fieldName === id) {
        target = itm;
      }

      recurse(itm?.children);
    });
  };

  recurse(fields);

  return target;
};

export const findIndex = (id: string, arr: FormItem[]): number => {
  return arr.findIndex((field) => field.fieldName === id);
};

export const omitField = (field: FormItem | null, fields?: FormItem[]): FormItem[] => {
  if (!fields) return [];
  if (!field) return fields || [];
  const target = fields.filter((itm) => itm.fieldName !== field.fieldName);

  target.forEach((itm) => {
    itm.children = omitField(field, itm?.children);
  });

  return target;
};

export const insertArray = <T extends unknown>(itm: T, arr: T[], _index: number): T[] => {
  const index = Math.max(0, _index);
  const tail = index < arr.length ? arr.slice(index - arr.length) : [];
  return arr.slice(0, index).concat(itm).concat(tail);
};

export const insertField = (
  field: FormItem | null,
  index: number,
  fields: FormItem[],
  target?: string,
): FormItem[] => {
  if (!field) return fields;
  if (!target) return insertArray(field, fields, index);

  return fields.map((itm) => {
    if (itm.fieldName !== target) return itm;

    return {
      ...itm,
      children: insertArray(field, itm.children || [], index),
    };
  });
};

export const updateField = (fieldName: string, newField: FormItem, fields: FormItem[]): FormItem[] => {
  const recurse = (fields?: FormItem[]): FormItem[] => {
    if (!fields) return [];

    return fields.map((field) => {
      if (field.fieldName === fieldName) {
        return newField;
      }

      return {
        ...field,
        children: recurse(field.children),
      };
    });
  };

  return recurse(fields);
};
