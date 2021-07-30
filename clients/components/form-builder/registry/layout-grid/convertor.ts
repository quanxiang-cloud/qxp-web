export interface LayoutGridConfig {
  isLayoutComponent: boolean;
  columns: number,
}

export const defaultConfig: LayoutGridConfig = {
  isLayoutComponent: true,
  columns: 2,
};

export function toSchema(value: LayoutGridConfig): ISchema {
  return {
    isLayoutComponent: value.isLayoutComponent,
    type: 'string',
    display: true,
    'x-component': 'LayoutGrid',
    'x-component-props': {
      columns: value.columns,
    },
  };
}

export function toConfig(schema: ISchema): LayoutGridConfig {
  return {
    isLayoutComponent: true,
    columns: schema['x-component-props']?.columns,
  };
}
