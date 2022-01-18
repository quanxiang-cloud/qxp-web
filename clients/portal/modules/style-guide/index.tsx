import React, { useEffect } from 'react';

// import Button from '@c/button';
import toast from '@lib/toast';
import Tab from '@c/tab';
import httpClient from '@lib/http-client';
import { setGlobalConfig, useGetGlobalConfig } from '@lib/configuration-center';
// @ts-ignore
import { Button } from '@ofa/ui-test';

import ComponentStyleConfigCenter from './component-style-config-center';
import CommonConfig from './common-config';
import { DEFAULT_CONFIG, COLOR_DEPTH } from './constant';
import store from './store';

export default function StyleGuide(): JSX.Element {
  const KEY = 'user_style_config';
  const COMPONENT_STYLE_CONFIG_KEY = 'style_guide_component_style_config';
  const [userStyleConfig, commonLoading] = useGetGlobalConfig<StyleGuideCommonConfig>(KEY, '0.1.0', DEFAULT_CONFIG);
  const [customCompCssMap, componentLoading] = useGetGlobalConfig(COMPONENT_STYLE_CONFIG_KEY, '0.1.0', {});

  useEffect(() => {
    if (commonLoading || componentLoading) {
      return;
    }

    store.commonConfig = userStyleConfig;
    store.customCompCssMap = customCompCssMap;
  }, [commonLoading, componentLoading]);

  async function generateCssUrl(): Promise<string> {
    const cssStr = Object.entries(store.customCompCssMap).map(([key, cssString]) => cssString).join('');
    // cssStr = cssStr.replace(/\/\*.*\*\//g, '');
    const cssFile = new Blob([cssStr], { type: 'text/css' });
    const { domain, readable } = await httpClient<{
      domain: string;
      private: string;
      readable: string;
    }>('/api/v1/fileserver/domain');

    const { url } = await httpClient<{ url: string }>('/api/v1/fileserver/sign/upload', {
      path: `${readable}/style-guide/component.css`,
      contentType: 'text/css',
      contentLength: cssFile.size,
    });

    fetch(url, {
      method: 'put',
      body: cssFile,
      headers: {
        'Content-Type': 'text/css',
      },
    });

    return `//${domain}/${readable}/style-guide/component.css`;
  }

  async function handleSave(): Promise<void> {
    setGlobalConfig(COMPONENT_STYLE_CONFIG_KEY, '0.1.0', store.customCompCssMap);
    const componentCssUrl = await generateCssUrl();
    setGlobalConfig(KEY, '0.1.0', { ...store.commonConfig, componentCssUrl }).then(() => {
      COLOR_DEPTH.forEach((depth) => {
        document.documentElement.style.setProperty(
          `--primary-${depth}`,
          `var(--${store.commonConfig.primaryColor}-${depth})`,
        );
      });
      toast.success('保存成功');
    });
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
