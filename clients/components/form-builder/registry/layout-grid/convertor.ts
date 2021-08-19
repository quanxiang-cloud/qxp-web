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
    type: 'object',
    display: true,
    'x-component': 'LayoutGrid',
    'x-component-props': {
      columns: value.columns,
    },
    'x-internal': {
      isLayoutComponent: value.isLayoutComponent,
    },
  };
}

export function toConfig(schema: ISchema): LayoutGridConfig {
  return {
    isLayoutComponent: true,
    columns: schema['x-component-props']?.columns,
  };
}
