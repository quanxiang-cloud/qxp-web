import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import dayjs from 'dayjs';

import Card from '@c/card';
import Button from '@c/button';
import PageLoading from '@c/page-loading';

import CreatedEditApp from '../../entry/app-list/app-edit/created-edit-app';
import appDetailsStore from '../store';
import { useEffect } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import toast from '@lib/toast';
import SubTitle from '../../page-design/blocks/node-carve/style-station/style-mirror/components/style-sub-title';

type RoleOption = {
  label: string;
  value: string | boolean | number;
}

const STRATEGY_OPTIONS: RoleOption[] = [
  {
    label: '多角色访问',
    value: false,
  },
  {
    label: '合并角色访问',
    value: true,
  },
];

function BasicInfo(): JSX.Element {
  const formRef: any = useRef();

  function handleSubmit(): void {
    const formDom = formRef.current;
    formDom.submit();
  }

  useEffect(() => {
    formRef.current?.validateFields?.();
  }, [formRef.current]);

  function submitCallback(): void {
    const formDom = formRef.current;
    const data = formDom.getFieldsValue();
    appDetailsStore.updateApp(data);
  }

  function handleStrategyChange(e: RadioChangeEvent): void {
    const { value } = e.target;
    if (value === appDetailsStore.appDetails.perPoly) return;
    appDetailsStore.setRolePoly(value);
    appDetailsStore.updateAppRolePoly(value).then(() => {
      toast.success('访问端角色策略已更改');
    });
  }

  if (appDetailsStore.loading) {
    return (<PageLoading />);
  }

  return (
    <div className='-mt-16'>
      <Card
        className="h-full transition-opacity flex flex-col flex-1 mt-0"
        headerClassName="px-20 h-48"
        title="基本信息:"
        itemTitleClassName="text-h6"
        action={(
          <div className="flex items-center">
            <span className="text-gray-400 text-12 mr-8">
              最近保存时间：
              {dayjs.unix(Math.floor(appDetailsStore.lastUpdateTime / 1000) ).format('YYYY-MM-DD HH:mm:ss')}
            </span>
            <Button onClick={handleSubmit} modifier='primary' iconName='save'>更新修改</Button>
          </div>
        )}
        descClassName="text-caption"
      >
        <div className='flex flex-grow px-20 pt-10'>
          <CreatedEditApp
            ref={formRef}
            modalType="editApp"
            appInfo={appDetailsStore.appDetails}
            onSubmitCallback={submitCallback}
          />
        </div>
      </Card>
      <Card
        className="h-full transition-opacity flex flex-col flex-1 mt-0"
        headerClassName="px-20 h-48 border-t-1"
        title="访问端应用角色策略:"
        itemTitleClassName="text-h6"
        descClassName="text-caption"
      >
        <div className='flex flex-col flex-grow px-20 pt-10 gap-10'>
          <Radio.Group
            className='pb-10'
            options={STRATEGY_OPTIONS}
            onChange={handleStrategyChange}
            value={appDetailsStore.appDetails.perPoly}
          />
          <SubTitle title="多角色访问：当用户有多个角色时，可在用户头像内切换多个角色" />
          <SubTitle title="合并角色访问：当用户有多个角色时，系统会自动将权限聚合成最大权限范围" />
        </div>
      </Card>
    </div>
  );
}

export default observer(BasicInfo);
