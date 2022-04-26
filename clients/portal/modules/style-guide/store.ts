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

const COMPILED_CSS_DRAFT_URL_KEY = 'style_guide_css:draft';
const COMPILED_CSS_FINAL_URL_KEY = 'style_guide_css';

const VERSION = '0.1.0';

const ALL_COMPONENTS_KEYS = componentSpecs.reduce<string[]>((acc, cur) => {
  return [...acc, cur.key];
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
  @observable styleCssUrl = '';

  constructor() {
    this.destroySetShadowStyle = reaction(
      () => [this.shadowRoot, this.styleCssUrl],
      ([shadowRoot, styleCssUrl]) => {
        if (!shadowRoot || !styleCssUrl) {
          return;
        }

        applyStyle((styleCssUrl as string) || '', shadowRoot as ShadowRoot);
      },
    );

    reaction(() => this.currentComp, (currentComp) => {
      if (!currentComp || this.componentScssMap[currentComp?.key]) {
        return;
      }
      this.fetchComponentScss(currentComp.specs.map((t) => `${currentComp.key}.${t.title}`));
    });

    this.fetchCssUrl().then((res) => {
      this.styleCssUrl = res;
    });
  }

  @action
  updateComponentScssMap(key: string, css?: string): void {
    this.componentScssMap = {
      ...this.componentScssMap,
      [key]: css || '',
    };
    const totalKey = this.currentComp?.key;
    if (totalKey) {
      const spec = componentSpecs.filter((t) => t.key === totalKey).pop();
      const totalScss = spec?.specs.reduce((acc, cur) => {
        return acc + (this.componentScssMap[`${totalKey}.${cur.title}`] || '');
      }, '');
      this.componentScssMap = {
        ...this.componentScssMap,
        [totalKey]: totalScss || '',
      };
    }
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
      { key: COMPONENT_STYLE_CONFIG_KEY, version: VERSION },
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
      { key: DESIGN_TOKEN_CONFIG_KEY, version: VERSION },
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
  fetchComponentScss = (key: string[]): void => {
    getBatchGlobalConfig(key.map((t) => ({
      key: t,
      version: VERSION,
    }))).then((res) => {
      key.forEach((t) => {
        this.updateComponentScssMap(t, res.result?.[t]);
      });
    });
  };

  @action
  setComponentScss = async (key: string, cssString: string): Promise<void> => {
    if (!this.currentComp) {
      return;
    }
    this.updateComponentScssMap(key, cssString);
    await setBatchGlobalConfig([
      {
        version: VERSION,
        key: key,
        value: cssString,
      },
      {
        version: VERSION,
        key: this.currentComp?.key,
        value: this.componentScssMap[this.currentComp?.key],
      },
    ]);
    console.log(this.componentScssMap);

    this.triggerCompile();
  };

  @action
  saveStyleConfig = async (): Promise<void> => {
    await setBatchGlobalConfig([
      {
        version: VERSION,
        key: COMPONENT_STYLE_CONFIG_KEY,
        value: JSON.stringify(this.cssStore?.cssASTMap),
      },
      {
        version: VERSION,
        key: DESIGN_TOKEN_CONFIG_KEY,
        value: JSON.stringify(
          JSON.parse(this.designTokenStore?.getAllStringTokens() || ''),
        ),
      },
      {
        version: VERSION,
        key: DESIGN_TOKEN_SCSS_KEY,
        value: this.designTokenStore?.generateCssString() || '',
      },
    ]);

    await this.triggerCompile();

    await setBatchGlobalConfig([
      {
        version: VERSION,
        key: COMPILED_CSS_FINAL_URL_KEY,
        value: JSON.stringify({ styleCssUrl: this.styleCssUrl }),
      },
    ]);

    toast.success('保存成功');
  };

  triggerCompile = async (): Promise<any> => {
    try {
      await triggerScssCompile({
        appID: '',
        element: JSON.stringify({
          design_token_key: {
            key: DESIGN_TOKEN_SCSS_KEY,
            version: VERSION,
          },
          components_scss_keys: {
            key: ALL_COMPONENTS_KEYS,
            version: VERSION,
          },
        }),
      });

      this.styleCssUrl = await this.fetchCssUrl();
    } catch (e) {
      toast.error('编译错误');
    }
  };

  @action
  fetchCssUrl = async (): Promise<string> => {
    const { domain, readable } = window.CONFIG.oss_config;
    const res = await getBatchGlobalConfig([
      {
        key: COMPILED_CSS_DRAFT_URL_KEY,
        version: '1.0.0',
      },
    ]);

    return `//${readable}.${domain}/${res.result?.[COMPILED_CSS_DRAFT_URL_KEY]}`;
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
