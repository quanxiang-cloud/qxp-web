import { observable, action, reaction, IReactionDisposer } from 'mobx';
import { nanoid } from 'nanoid';
import CssASTStore, { ComponentSpec, StyleConfigInterface } from '@one-for-all/style-guide';
import componentSpecs from '@one-for-all/headless-ui-interfaces';

import httpClient from '@lib/http-client';
import toast from '@lib/toast';
import { setBatchGlobalConfig, getBatchGlobalConfig } from '@lib/api/user-config';
import { parseJSON } from '@lib/utils';

import colorVars from './css-variables.json';
import { applyStyle } from './utils';

const COMPONENT_STYLE_CONFIG_KEY = 'GLOBAL_COMPONENT_STYLE_CONFIG';
const PERSONALIZED_CONFIG_KEY = 'PERSONALIZED_CONFIG';
const VERSION = '0.1.0';
class StyleGuideStore {
  destroySetShadowStyle: IReactionDisposer;
  @observable cssStore: CssASTStore | null = null;
  @observable currentCompStatus: null | ActiveConfigurationComponent = null;
  @observable currentComp: ComponentSpec | null = null;
  @observable commonConfig: StyleGuideCommonConfig = { primaryColor: 'blue' };
  @observable shadowRoot: ShadowRoot | null = null;

  constructor() {
    this.destroySetShadowStyle = reaction(() => this.shadowRoot, (shadowRoot) => {
      if (!shadowRoot) {
        return;
      }

      applyStyle(this.cssStore?.getCssString() || '', shadowRoot);
    });
  }

  @action
  setCommonConfig = (newConfig: Partial<StyleGuideCommonConfig>): void => {
    this.commonConfig = { ...this.commonConfig, ...newConfig };
  };

  @action
  setCurrentCompStatus = (key: string, spec: StyleConfigInterface): void => {
    this.currentCompStatus = {
      key,
      spec,
    };
  };

  @action
  fetchStyleConfig = (): void => {
    getBatchGlobalConfig([{ key: COMPONENT_STYLE_CONFIG_KEY, version: VERSION }]).then((res) => {
      const customCompCssMap = parseJSON(res.result?.[COMPONENT_STYLE_CONFIG_KEY], {});
      this.cssStore = new CssASTStore({
        initCssMap: customCompCssMap,
        baseColorVariables: colorVars.baseColors,
        componentConfigs: componentSpecs,
      });
    });
  };

  @action
  setCurrentComp = (comp: ComponentSpec): void => {
    this.currentComp = comp;
    if (comp.specs.length) {
      this.currentCompStatus = {
        key: comp.key,
        spec: comp.specs[0],
      };
    }
  };

  @action
  saveStyleConfig = async (): Promise<void> => {
    const styleCssUrl = await this.generateCssUrl();
    await setBatchGlobalConfig([{
      version: VERSION,
      key: COMPONENT_STYLE_CONFIG_KEY,
      value: JSON.stringify(this.cssStore?.cssASTMap),
    }, {
      version: VERSION,
      key: PERSONALIZED_CONFIG_KEY,
      value: JSON.stringify({ styleCssUrl }),
    }]);

    toast.success('保存成功');
  };

  generateCssUrl = async (): Promise<string> => {
    const cssFile = await this.cssStore?.getGzipFile();
    const { domain, readable } = window.CONFIG.oss_config;

    const cssUrl = `${nanoid()}/style-guide/personalized_style.css`;
    const { url } = await httpClient<{ url: string }>('/api/v1/fileserver/sign/upload', {
      path: `${readable}/${cssUrl}`,
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

    return `//${readable}.${domain}/${cssUrl}`;
  };
}

export default new StyleGuideStore();
