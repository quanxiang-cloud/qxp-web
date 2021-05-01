import React, { FormEvent } from 'react';
import cs from 'classnames';

import Drawer from '@c/drawer';
import useObservable from '@lib/hooks/use-observable';
import Tab from '@c/tab';
import store, { StoreValue, CurrentElement, updateStore } from '@flow/detail/content/editor/store';
import SaveButtonGroup
  from '@flow/detail/content/editor/components/_common/action-save-button-group';

import FormSelector from '../form-selector';
import TriggerWay from './basic-config/trigger-way';
import TriggerCondition from './basic-config/trigger-condition';

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
            <span className="text-h5 mr-8">工作表触发</span>
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
              <FormSelector defaultValue={currentElement.data.businessData.form.value} />
              <Tab
                className="mt-10"
                headerClassName="border-gray-200 border-b-1"
                titleClassName={cs(
                  'bg-white hover:bg-white',
                  'hover:border-blue-600 hover:border-b-4'
                )}
                activeTitleClassName="border-blue-600 border-b-4"
                contentClassName="overflow-scroll bg-white"
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
            <SaveButtonGroup />
          </form>
        </Drawer>
      )}
    </>
  );
}
