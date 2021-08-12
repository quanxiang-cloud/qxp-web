
export interface LayoutTabsConfig {
  isLayoutComponent: boolean;
  position: 'top' | 'left';
  currentEdit: string;
  tabs: string[];
}

export const defaultConfig: LayoutTabsConfig = {
  isLayoutComponent: true,
  position: 'top',
  tabs: ['选项卡1'],
  currentEdit: '选项卡1',
};

export function toSchema(value: LayoutTabsConfig): ISchema {
  return {
    isLayoutComponent: value.isLayoutComponent,
    display: true,
    'x-component': 'LayoutTabs',
    'x-component-props': {
      tabs: value.tabs,
      currentEdit: value.currentEdit,
      position: value.position,
    },
  };
}

export function toConfig(schema: ISchema): LayoutTabsConfig {
  return {
    isLayoutComponent: true,
    position: schema['x-component-props']?.position,
    tabs: schema['x-component-props']?.tabs,
    currentEdit: schema['x-component-props']?.currentEdit,
  };
}
