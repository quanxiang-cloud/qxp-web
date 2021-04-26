import React, { FormEvent } from 'react';

import useObservable from '@lib/hooks/use-observable';
import Drawer from '@c/drawer';
import Icon from '@c/icon';
import Tab from '@c/tab';
import Button from '@c/button';

import store, { StoreValue, CurrentElement, updateStore } from '../../../store';
import FormSelector from '../../form-selector';
import BasicConfig from '../basic-config';
import FieldPermission from '../field-permission';
import OperatorPermission from '../operator-permission';
import Events from '../events';

export default function FillInForm() {
  const { asideDrawerType, elements = [] } = useObservable<StoreValue>(store) || {};
  const currentFormNodeElement = elements.find(({ type }) => type === 'formData') as CurrentElement;
  const currentElement = elements.find(({ type }) => type === 'approve') as CurrentElement;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    console.log('准备提交');
  }

  return (
    <>
      {asideDrawerType === 'approveForm' && (
        <Drawer
          title={(
            <div className="flex items-center">
              <span className="text-h5 mr-8">审批</span>
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
              <FormSelector defaultValue={currentFormNodeElement.data.businessData.form.value} />
              <Tab
                className="mt-10"
                contentClassName="overflow-scroll"
                style={{ height: 'calc(100% - 56px)' }}
                items={[{
                  id: 'basicConfig',
                  name: '基础配置',
                  content: <BasicConfig type="approve" currentElement={currentElement} />,
                }, {
                  id: 'fieldPermission',
                  name: '字段权限',
                  content: <FieldPermission />,
                }, {
                  id: 'operatorPermission',
                  name: '操作权限',
                  content: <OperatorPermission />,
                }, {
                  id: 'events',
                  name: '事件',
                  content: <Events />,
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
