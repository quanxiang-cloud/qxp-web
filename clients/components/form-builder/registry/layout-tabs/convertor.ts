import { generateRandomTabId } from './util';

export interface LayoutTabsConfig {
  isLayoutComponent: boolean;
  position: 'top' | 'left';
  currentEdit: LabelValue[];
  tabs: LabelValue[];
  displayModifier: FormBuilder.DisplayModifier;
}

const initTab = {
  label: '选项卡1',
  value: generateRandomTabId(),
};

export const defaultConfig: LayoutTabsConfig = {
  isLayoutComponent: true,
  position: 'top',
  tabs: [initTab],
  currentEdit: [initTab],
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
