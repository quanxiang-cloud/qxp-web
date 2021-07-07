
type Option = {
  value: string;
  label: string;
}

export type ArrayInitValue = string[] | number[] | Option[];

export function getArrayValue(initValue: ArrayInitValue, schema: ISchema): string {
  switch (schema?.['x-component']) {
  // case 'ImageUpload':
  //   return '';
  // case 'FileUpload':
  //   return '';
  case 'UserPicker':
    return (initValue as Option[]).map(({ label }) => label).join(',');
  default:
    if (schema.enum && schema.enum.length) {
      return (initValue as string[] | number[]).map((_value) => {
        if (!schema.enum) {
          return '';
        }

        const enumTmp = schema.enum[0];
        if (typeof enumTmp === 'object') {
          return (schema.enum.find(({ value }: any) => value === _value) as Option)?.label || '';
        }

        return _value;
      }).join(',');
    }

    return (initValue as Option[]).map(({ label }) => label).join(',');
  }
}
