import { observable, action } from 'mobx';

class StyleGuideStore {
  @observable customCompCssMap: Record<string, string> = {};
  @observable currentConfigComp: null | ActiveConfigurationComponent = null;
  @observable commonConfig: StyleGuideCommonConfig = { primaryColor: 'blue' };

  @action
  setCommonConfig = (newConfig: Partial<StyleGuideCommonConfig>): void => {
    this.commonConfig = { ...this.commonConfig, ...newConfig };
  };

  @action
  setCustomCss = (name: string, newCss: string): void => {
    this.customCompCssMap = { ...this.customCompCssMap, [name]: newCss };
  };

  @action
  setCurrentComp = (key: string, configSchema: ComponentStyleConfigSchema[]): void => {
    this.currentConfigComp = {
      key,
      configSchema,
    };
  };
}

export default new StyleGuideStore();
