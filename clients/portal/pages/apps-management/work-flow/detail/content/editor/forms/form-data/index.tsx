import React from 'react';
import { useForm } from 'react-hook-form';

import Drawer from '@c/drawer';
import useObservable from '@lib/hooks/use-observable';
import Icon from '@c/icon';
import Tab from '@c/tab';
import Button from '@c/button';
import notify from '@lib/notify';

import FormSelector from './form-selector';
import TriggerWay from './trigger-way';
import store from '../../store';
import TriggerCondition from './trigger-condition';

export default function ComponentsSelector() {
  const { asideDrawerType } = useObservable(store) || {};
  const { register, handleSubmit } = useForm<{
    triggerWay:('whenAdd' | 'whenAlter' | '')[];
      }>({
        defaultValues: {
          triggerWay: [],
        },
      });

  function onSubmit(data: any) {
    if (!data.triggerWay.length) {
      notify.error('请选择触发方式');
    }
  }

  return (
    <>
      {asideDrawerType === 'formDataForm' && (
        <Drawer
          title={(
            <div className="flex items-center">
              <span className="text-h5 mr-8">工作表触发</span>
              <Icon name="edit" />
            </div>
          )}
          distanceTop={0}
          onCancel={() => store.next({
            ...store.value,
            asideDrawerType: '',
          })}
          className="flow-editor-drawer"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between">
            <div>
              <FormSelector />
              <Tab
                className="mt-10"
                items={[{
                  id: 'basicConfig',
                  name: '基础配置',
                  content: (
                    <div className="mt-24">
                      <TriggerWay {...register('triggerWay')} />
                      <TriggerCondition />
                    </div>
                  ),
                }, {
                  id: 'events',
                  name: '事件',
                  content: (
                    <div>content</div>
                  ),
                }]}
              />
            </div>
            <div className="flex justify-end">
              <Button
                className="mr-20"
                iconName="close"
                onClick={() => store.next({ ...store.value, asideDrawerType: '' })}
              >
              取消
              </Button>
              <Button
                modifier="primary"
                iconName="check"
                type="submit"
              >
              确定关联
              </Button>
            </div>
          </form>
        </Drawer>
      )}
    </>
  );
}
