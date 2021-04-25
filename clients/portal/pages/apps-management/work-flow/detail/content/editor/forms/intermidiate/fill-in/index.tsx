import React from 'react';

import useObservable from '@lib/hooks/use-observable';
import Drawer from '@c/drawer';
import Icon from '@c/icon';
import Tab from '@c/tab';
import Button from '@c/button';

import store, { StoreValue, CurrentElement, updateStore } from '../../../store';
import FormSelector from '../../form-selector';

export default function FillInForm() {
  const { asideDrawerType, elements = [] } = useObservable<StoreValue>(store) || {};
  const currentFormNodeElement = elements.find(({ type }) => type === 'formData') as CurrentElement;
  const currentElement = elements.find(({ type }) => type === 'fillIn') as CurrentElement;

  function onSubmit() {
    console.log('准备提交');
  }

  return (
    <>
      {asideDrawerType === 'fillInForm' && (
        <Drawer
          title={(
            <div className="flex items-center">
              <span className="text-h5 mr-8">填写</span>
              <Icon name="edit" />
            </div>
          )}
          distanceTop={0}
          onCancel={() => updateStore(null, () => ({ asideDrawerType: '' }))}
          className="flow-editor-drawer"
        >
          <form
            onSubmit={onSubmit}
            className="flex-1 flex flex-col justify-between h-full"
          >
            <div className="flex-1" style={{ height: 'calc(100% - 56px)' }}>
              <FormSelector defaultValue={currentFormNodeElement.data.form.value} />
              <Tab
                className="mt-10"
                contentClassName="overflow-scroll"
                style={{ height: 'calc(100% - 56px)' }}
                items={[{
                  id: 'basicConfig',
                  name: '基础配置',
                  content: (
                    <div className="mt-24">
                      1
                    </div>
                  ),
                }, {
                  id: 'fieldPermission',
                  name: '字段权限',
                  content: (
                    <div>field permission</div>
                  ),
                }]}
              />
            </div>
            <div className="flex justify-end flex-none">
              <Button
                className="mr-20"
                iconName="close"
                type="button"
                onClick={() => updateStore(null, () => ({ asideDrawerType: '' }))}
              >
              取消
              </Button>
              <Button
                modifier="primary"
                iconName="save"
                type="submit"
              >
              保存
              </Button>
            </div>
          </form>
        </Drawer>
      )}
    </>
  );
}
