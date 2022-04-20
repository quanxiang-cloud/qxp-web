import { observable, action, reaction, IReactionDisposer } from 'mobx';
import { nanoid } from 'nanoid';
import CssASTStore, {
  ComponentSpec,
  StyleConfigInterface,
} from '@one-for-all/style-guide';
import componentSpecs from '@one-for-all/headless-ui-interfaces';

import httpClient from '@lib/http-client';
import toast from '@lib/toast';
import {
  setBatchGlobalConfig,
  getBatchGlobalConfig,
} from '@lib/api/user-config';
import { parseJSON } from '@lib/utils';

import colorVars from './css-variables.json';
import { applyStyle } from './utils';
import DesignTokenStore from './design-token/store';
import { triggerScssCompile } from './api';

const COMPONENT_STYLE_CONFIG_KEY = 'GLOBAL_COMPONENT_STYLE_CONFIG';
const DESIGN_TOKEN_CONFIG_KEY = 'GLOBAL_DESIGN_TOKEN_CONFIG';
const DESIGN_TOKEN_SCSS_KEY = 'GLOBAL_DESIGN_TOKEN_SCSS';

const COMPONET_STYLE_VERSION = '0.1.0';
const DESIGN_TOKEN_VERSION = '0.1.0';

const ALL_COMPONENTS_KEYS = componentSpecs.reduce<string[]>((acc, cur) => {
  return [...acc, ...cur.specs.map((spec) => `${cur.key}.${spec.title}`)];
}, []);
class StyleGuideStore {
  destroySetShadowStyle: IReactionDisposer;
  @observable designTokenStore: DesignTokenStore | null = null;
  @observable cssStore: CssASTStore | null = null;
  @observable currentCompStatus: null | ActiveConfigurationComponent = null;
  @observable currentComp: ComponentSpec | null = null;
  @observable commonConfig: StyleGuideCommonConfig = { primaryColor: 'blue' };
  @observable shadowRoot: ShadowRoot | null = null;
  @observable componentScssMap: Record<string, string> = {};

  constructor() {
    this.destroySetShadowStyle = reaction(
      () => this.shadowRoot,
      (shadowRoot) => {
        if (!shadowRoot) {
          return;
        }

        applyStyle(this.cssStore?.getCssString() || '', shadowRoot);
      },
    );
  }

  @action
  updateComponentScssMap(key: string, css: string): void {
    this.componentScssMap = {
      ...this.componentScssMap,
      [key]: css,
    };
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
    getBatchGlobalConfig([
      { key: COMPONENT_STYLE_CONFIG_KEY, version: COMPONET_STYLE_VERSION },
    ]).then((res) => {
      const customCompCssMap = parseJSON(
        res.result?.[COMPONENT_STYLE_CONFIG_KEY],
        {},
      );
      this.cssStore = new CssASTStore({
        initCssMap: customCompCssMap,
        baseColorVariables: colorVars.baseColors,
        componentConfigs: componentSpecs,
      });
    });
  };

  @action
  fetchDesignTokenConfig = (): void => {
    getBatchGlobalConfig([
      { key: DESIGN_TOKEN_CONFIG_KEY, version: DESIGN_TOKEN_VERSION },
    ]).then((res) => {
      this.designTokenStore = new DesignTokenStore({
        tokenData: res.result?.[DESIGN_TOKEN_CONFIG_KEY],
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
  fetchComponentScss = async (key: string): Promise<void> => {
    getBatchGlobalConfig([{
      key: key, version: COMPONET_STYLE_VERSION,
    }]).then((res) => {
      this.updateComponentScssMap(key, res.result?.[key]);
    });
  };

  @action
  setComponentScss = async (key: string, cssString: string): Promise<void> => {
    this.updateComponentScssMap(key, cssString);
    await setBatchGlobalConfig([
      {
        version: COMPONET_STYLE_VERSION,
        key: key,
        value: cssString,
      },
    ]);

    this.triggerCompile();
  };

  @action
  saveStyleConfig = async (): Promise<void> => {
    await setBatchGlobalConfig([
      {
        version: COMPONET_STYLE_VERSION,
        key: COMPONENT_STYLE_CONFIG_KEY,
        value: JSON.stringify(this.cssStore?.cssASTMap),
      },
      {
        version: DESIGN_TOKEN_VERSION,
        key: DESIGN_TOKEN_CONFIG_KEY,
        value: JSON.stringify(JSON.parse(this.designTokenStore?.getAllStringTokens() || '')),
      },
      {
        version: DESIGN_TOKEN_VERSION,
        key: DESIGN_TOKEN_SCSS_KEY,
        value: this.designTokenStore?.generateCssString() || '',
      },
    ]);

    this.triggerCompile();

    toast.success('保存成功');
  };

  triggerCompile = async (): Promise<any> => {
    await triggerScssCompile({
      design_token_key: {
        key: DESIGN_TOKEN_SCSS_KEY,
        version: DESIGN_TOKEN_VERSION,
      },
      components_scss_keys: {
        key: ALL_COMPONENTS_KEYS,
        version: COMPONET_STYLE_VERSION,
      },
    });
  };

  generateCssUrl = async (): Promise<string> => {
    const cssFile = await this.cssStore?.getGzipFile();
    const { domain, readable } = window.CONFIG.oss_config;

    const cssUrl = `${nanoid()}/style-guide/personalized_style.css`;
    const { url } = await httpClient<{ url: string }>(
      '/api/v1/fileserver/sign/upload',
      {
        path: `${readable}/${cssUrl}`,
        contentType: 'text/css',
        contentLength: cssFile?.size,
      },
    );

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
