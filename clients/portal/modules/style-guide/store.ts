import { observable, action } from 'mobx';

class StyleGuideStore {
  @observable customCssMap: Record<string, string> = {};

  @action
  setCustomCss = (name: string, newCss: string): void => {
    this.customCssMap = { ...this.customCssMap, [name]: newCss };
  };
}

export default new StyleGuideStore();
