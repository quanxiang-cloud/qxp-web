export interface LayoutCardConfig {
  isLayoutComponent: boolean;
  collapsible: boolean;
  title: string;
}

export const defaultConfig: LayoutCardConfig = {
  isLayoutComponent: true,
  collapsible: false,
  title: '分组',
};

export function toSchema(value: LayoutCardConfig): ISchema {
  return {
    isLayoutComponent: value.isLayoutComponent,
    display: true,
    title: value.title,
    'x-component': 'LayoutCard',
    'x-component-props': {
      collapsible: value.collapsible,
    },
  };
}

export function toConfig(schema: ISchema): LayoutCardConfig {
  return {
    isLayoutComponent: true,
    collapsible: schema?.['x-component-props']?.collapsible,
    title: schema.title as string,
  };
}
