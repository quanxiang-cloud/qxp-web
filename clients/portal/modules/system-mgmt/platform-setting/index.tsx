/* eslint-disable semi */
import React, { useMemo, useState } from 'react';
import { useMonaco } from '@monaco-editor/react';
import Container from '../container';
import TextHeader from '@c/text-header';
import HomeSchemaSetting from './home-schema-setting';
import Tab, { TabItem } from '@c/tab';
import LogoSetting from './logo-setting';

function PlatformSetting(): JSX.Element {
  const [currentTab, setCurrentTab] = useState('schema-config');

  useMonaco();

  const tabItems: TabItem[] = useMemo(() => [
    {
      id: 'schema-config',
      name: '用户端主页配置',
      content: <HomeSchemaSetting />,
    },
    {
      id: 'logo-config',
      name: '平台logo设置',
      content: <LogoSetting />,
    },
  ], [])

  return (
    <Container>
      <div className="h-full flex flex-col flex-grow overflow-hidden">
        <TextHeader
          title="平台参数配置"
          desc="配置平台参数"
          className="bg-gray-1000 px-20 py-16 header-background-image"
          itemTitleClassName="text-h5"
        />
        <Tab
          className='px-20'
          items={tabItems}
          contentClassName='flex'
          currentKey={currentTab}
          onChange={setCurrentTab}
        />
      </div>
    </Container>
  );
}

export default PlatformSetting;
