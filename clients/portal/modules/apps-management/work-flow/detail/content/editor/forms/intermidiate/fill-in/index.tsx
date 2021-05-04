import React, { FormEvent } from 'react';

import useObservable from '@lib/hooks/use-observable';
import Drawer from '@c/drawer';
import Tab from '@c/tab';
import store, {
  StoreValue, CurrentElement, updateStore, updateDataField,
} from '@flow/detail/content/editor/store';
import SaveButtonGroup
  from '@flow/detail/content/editor/components/_common/action-save-button-group';
import FormSelector from '@flow/detail/content/editor/forms/form-selector';

import BasicConfig from '../basic-config';
import FieldPermission from '../field-permission';
import OperatorPermission from '../operator-permission';
import Events from '../events';

export default function FillInForm() {
  const { asideDrawerType, elements = [] } = useObservable<StoreValue>(store) || {};
  const currentFormNodeElement = elements.find(({ type }) => type === 'formData') as CurrentElement;
  const currentElement = elements.find(({ type }) => type === 'fillIn') as CurrentElement;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    console.debug('ready');
  }

  return (
    <>
      {asideDrawerType === 'fillInForm' && (
        <Drawer
          title={(
            <span className="text-h5 mr-8">审批</span>
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
              <FormSelector
                changeable={false}
                defaultValue={currentFormNodeElement.data.businessData.form.value}
              />
              <Tab
                className="mt-10"
                contentClassName="overflow-x-visible overflow-y-scroll bg-white"
                style={{ height: 'calc(100% - 56px)' }}
                items={[{
                  id: 'basicConfig',
                  name: '基础配置',
                  content: <BasicConfig type="fillIn" currentElement={currentElement} />,
                }, {
                  id: 'fieldPermission',
                  name: '字段权限',
                  content: (
                    <FieldPermission
                      onChange={(fieldPermission) => {
                        updateDataField('fillIn', 'fieldPermission', () => fieldPermission);
                      }}
                      defaultValue={currentElement.data.businessData.fieldPermission}
                    />
                  ),
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
            <SaveButtonGroup />
          </form>
        </Drawer>
      )}
    </>
  );
}
