import { observable, action } from 'mobx';
import CssASTStore, { ComponentSpec, StyleConfigInterface } from '@one-for-all/style-guide';

import httpClient from '@lib/http-client';

class StyleGuideStore {
  @observable cssStore: CssASTStore | null = null;
  @observable currentCompStatus: null | ActiveConfigurationComponent = null;
  @observable currentComp: ComponentSpec | null = null;
  @observable commonConfig: StyleGuideCommonConfig = { primaryColor: 'blue' };
  @observable shadowRoot: ShadowRoot | null = null;

  @action
  setCommonConfig = (newConfig: Partial<StyleGuideCommonConfig>): void => {
    this.commonConfig = { ...this.commonConfig, ...newConfig };
    if (this.cssStore) {
      this.cssStore.baseVariables.primaryColor = this.commonConfig.primaryColor || 'blue';
      this.cssStore.themeColorVariables = this.commonConfig.themeVariable || {};
    }
  };

  @action
  setCurrentCompStatus = (key: string, spec: StyleConfigInterface): void => {
    this.currentCompStatus = {
      key,
      spec,
    };
  };

  generateCssUrl = async (): Promise<string> => {
    const cssFile = await this.cssStore?.getGzipFile().then((cssBlob: Blob | null) => {
      return cssBlob;
    });
    const { domain, readable } = await httpClient<{
      domain: string;
      private: string;
      readable: string;
    }>('/api/v1/fileserver/domain');

    const { url } = await httpClient<{ url: string }>('/api/v1/fileserver/sign/upload', {
      path: `${readable}/${window.location.hostname}/style-guide/component.css`,
      contentType: 'text/css',
      contentLength: cssFile?.size,
    });

    fetch(url, {
      method: 'put',
      body: cssFile,
      headers: {
        'Content-Type': 'text/css',
        'Content-Encoding': 'gzip',
      },
    });

    return `//${readable}.${domain}/${window.location.hostname}/style-guide/component.css`;
  };
}

export default new StyleGuideStore();
