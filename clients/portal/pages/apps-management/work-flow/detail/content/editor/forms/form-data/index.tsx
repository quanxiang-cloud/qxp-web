import React, { FormEvent } from 'react';

import Drawer from '@c/drawer';
import useObservable from '@lib/hooks/use-observable';
import Icon from '@c/icon';
import Tab from '@c/tab';
import Button from '@c/button';

import FormSelector from './form-selector';
import TriggerWay from './basic-config/trigger-way';
import TriggerCondition from './basic-config/trigger-condition';
import store, { updateDataField, StoreValue, CurrentElement, updateStore } from '../../store';

const formFieldOptions = [{
  label: '修改时间',
  value: '1',
}, {
  label: '创建时间',
  value: '2',
}, {
  label: '创建人',
  value: '3',
}, {
  label: '申请时间',
  value: '4',
}];

export default function ComponentsSelector() {
  const { asideDrawerType, elements = [] } = useObservable<StoreValue>(store) || {};
  const currentElement = elements.find(({ type }) => type === 'formData') as CurrentElement;
  if (!currentElement) {
    return null;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // console.log(elements);
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
          onCancel={() => updateDataField('formData', 'asideDrawerType', () => '')}
          className="flow-editor-drawer"
        >
          <form
            onSubmit={onSubmit}
            className="flex-1 flex flex-col justify-between h-full"
          >
            <div className="flex-1" style={{ height: 'calc(100% - 56px)' }}>
              <FormSelector defaultValue={currentElement.data.form.value} />
              <Tab
                className="mt-10"
                contentClassName="overflow-scroll"
                style={{ height: 'calc(100% - 56px)' }}
                items={[{
                  id: 'basicConfig',
                  name: '基础配置',
                  content: (
                    <div className="mt-24">
                      <TriggerWay
                        formFieldOptions={formFieldOptions}
                        currentElement={currentElement}
                      />
                      <TriggerCondition
                        formFieldOptions={formFieldOptions}
                        currentElement={currentElement}
                      />
                    </div>
                  ),
                }, {
                  id: 'events',
                  name: '事件',
                  content: (
                    <div>TODO</div>
                  ),
                }]}
              />
            </div>
            <div className="flex justify-end flex-none">
              <Button
                className="mr-20"
                iconName="close"
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
