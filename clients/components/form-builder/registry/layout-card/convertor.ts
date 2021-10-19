export interface LayoutCardConfig {
  isLayoutComponent: boolean;
  collapsible: boolean;
  title: string;
  displayModifier: FormBuilder.DisplayModifier;
}

export const defaultConfig: LayoutCardConfig = {
  isLayoutComponent: true,
  collapsible: false,
  title: '分组',
  displayModifier: 'normal',
};

export function toSchema(value: LayoutCardConfig): ISchema {
  return {
    type: 'object',
    title: value.title,
    display: value.displayModifier !== 'hidden',
    'x-component': 'LayoutCard',
    'x-component-props': {
      collapsible: value.collapsible,
      displayModifier: value.displayModifier,
    },
    'x-internal': {
      isLayoutComponent: value.isLayoutComponent,
    },
  };
}

export function toConfig(schema: ISchema): LayoutCardConfig {
  let displayModifier: FormBuilder.DisplayModifier = 'normal';
  if (!schema.display) {
    displayModifier = 'hidden';
  }

  return {
    displayModifier,
    isLayoutComponent: true,
    collapsible: schema?.['x-component-props']?.collapsible,
    title: schema.title as string,
  };
}
