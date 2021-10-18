export interface LayoutGridConfig {
  isLayoutComponent: boolean;
  columns: number;
  displayModifier: FormBuilder.DisplayModifier;
}

export const defaultConfig: LayoutGridConfig = {
  isLayoutComponent: true,
  columns: 2,
  displayModifier: 'normal',
};

export function toSchema(value: LayoutGridConfig): ISchema {
  return {
    type: 'object',
    display: value.displayModifier !== 'hidden',
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
  let displayModifier: FormBuilder.DisplayModifier = 'normal';
  if (!schema.display) {
    displayModifier = 'hidden';
  }

  return {
    displayModifier,
    isLayoutComponent: true,
    columns: schema['x-component-props']?.columns,
  };
}
