import { observable, action } from 'mobx';

import { applyStyle } from './utils';
class StyleGuideStore {
  @observable customCompCssMap: Record<string, string> = {};
  @observable currentCompStatus: null | ActiveConfigurationComponent = null;
  @observable currentComp: ComponentPackagingObject | null = null;
  @observable commonConfig: StyleGuideCommonConfig = { primaryColor: 'blue' };

  @action
  setCommonConfig = (newConfig: Partial<StyleGuideCommonConfig>): void => {
    this.commonConfig = { ...this.commonConfig, ...newConfig };
  };

  @action
  setCustomCss = (name: string, newCss: string): void => {
    this.customCompCssMap = { ...this.customCompCssMap, [name]: newCss };
    const newCompCss = this.currentComp?.schemas.map(({ key }) => {
      const cssKey = `${this.currentComp?.key}.${key}`;
      if (cssKey === name) {
        return newCss;
      }
      return this.customCompCssMap[cssKey] || '';
    }) || [];

    applyStyle(this.currentComp?.key || '', newCompCss?.join(' '));
  };

  @action
  setCurrentCompStatus = (key: string, configSchema: ComponentStyleConfigSchema[]): void => {
    this.currentCompStatus = {
      key,
      configSchema,
    };
  };
}

export default new StyleGuideStore();
