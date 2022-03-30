import React, { useEffect } from 'react';

import Button from '@c/button';
import toast from '@lib/toast';
import Tab from '@c/tab';
import CssASTStore from '@one-for-all/style-guide';
import { setGlobalConfig, useGetGlobalConfig } from '@lib/configuration-center';

import ComponentStyleConfigCenter from './component-style-config-center';
import CommonConfig from './common-config';
import { DEFAULT_CONFIG } from './constant';
import store from './store';

import colorVars from './css-variables.json';

import './index.css';

export default function StyleGuide(): JSX.Element {
  const KEY = 'COMMON_STYLE_CONFIG';
  const COMPONENT_STYLE_CONFIG_KEY = 'GLOBAL_COMPONENT_STYLE_CONFIG';
  const [tenantStyleConfig, commonLoading] = useGetGlobalConfig<StyleGuideCommonConfig>(KEY, '0.1.0', DEFAULT_CONFIG);
  const [customCompCssMap, componentLoading] = useGetGlobalConfig(COMPONENT_STYLE_CONFIG_KEY, '0.1.0', {});

  useEffect(() => {
    if (commonLoading || componentLoading) {
      return;
    }

    store.commonConfig = tenantStyleConfig;
    store.cssStore = new CssASTStore({
      initCssMap: customCompCssMap,
      baseColorVariables: { ...colorVars.baseColors, primaryColor: tenantStyleConfig.primaryColor || 'blue' },
      themeColorVariables: tenantStyleConfig.themeVariable,
    });
  }, [commonLoading, componentLoading]);

  async function handleSave(): Promise<void> {
    setGlobalConfig(COMPONENT_STYLE_CONFIG_KEY, '0.1.0', store.cssStore?.cssASTMap);
    const styleCssUrl = await store.generateCssUrl();
    setGlobalConfig(KEY, '0.1.0', { ...store.commonConfig, styleCssUrl });
    toast.success('保存成功');
  }

  return (
    <div>
      <div className='flex justify-between items-center p-20'>
        <div>Style Guide</div>
        <Button onClick={handleSave}>保存</Button>
      </div>
      <Tab
        items={[
          {
            id: 'commonConfig',
            name: '通用样式配置',
            content: (<CommonConfig />),
          },
          {
            id: 'componentStyleConfigCenter',
            name: '组件样式配置',
            content: <ComponentStyleConfigCenter />,
          }]}
      />
    </div>
  );
}
