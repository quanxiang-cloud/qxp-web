
export interface LayoutTabsConfig {
  isLayoutComponent: boolean;
  position: 'top' | 'left';
  currentEdit: string;
  tabs: string[];
  displayModifier: FormBuilder.DisplayModifier;
}

export const defaultConfig: LayoutTabsConfig = {
  isLayoutComponent: true,
  position: 'top',
  tabs: ['选项卡1'],
  currentEdit: '选项卡1',
  displayModifier: 'normal',
};

export function toSchema(value: LayoutTabsConfig): ISchema {
  return {
    type: 'object',
    display: value.displayModifier !== 'hidden',
    'x-component': 'LayoutTabs',
    'x-component-props': {
      tabs: value.tabs,
      currentEdit: value.currentEdit,
      position: value.position,
    },
    'x-internal': {
      isLayoutComponent: value.isLayoutComponent,
    },
  };
}

export function toConfig(schema: ISchema): LayoutTabsConfig {
  let displayModifier: FormBuilder.DisplayModifier = 'normal';
  if (!schema.display) {
    displayModifier = 'hidden';
  }

  return {
    displayModifier,
    isLayoutComponent: true,
    position: schema['x-component-props']?.position,
    tabs: schema['x-component-props']?.tabs,
    currentEdit: schema['x-component-props']?.currentEdit,
  };
}
