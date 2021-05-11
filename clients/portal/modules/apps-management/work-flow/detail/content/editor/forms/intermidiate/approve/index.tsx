import React, { FormEvent, useState, useEffect } from 'react';
import cs from 'classnames';
import { isEqual } from 'lodash';

import useObservable from '@lib/hooks/use-observable';
import Drawer from '@c/drawer';
import Tab from '@c/tab';
import FormSelector from '@flow/detail/content/editor/forms/form-selector';
import store, {
  StoreValue,
  CurrentElement,
  updateStore,
  updateDataField,
  FillInData,
  BasicNodeConfig,
  FieldPermission as FieldPermissionType,
  OperationPermission as OperationPermissionType,
  Errors,
} from '@flow/detail/content/editor/store';
import SaveButtonGroup
  from '@flow/detail/content/editor/components/_common/action-save-button-group';

import BasicConfig from '../basic-config';
import FieldPermission from '../field-permission';
import OperatorPermission from '../operator-permission';
import Events from '../events';

export default function ApproveForm() {
  const { asideDrawerType, elements = [], errors } = useObservable<StoreValue>(store) || {};
  const currentFormNodeElement = elements.find(({ type }) => type === 'formData') as CurrentElement;
  const currentElement = elements.find(({ id }) => id === asideDrawerType) as CurrentElement;
  const [formData, setFormData] = useState<FillInData>(currentElement?.data?.businessData);

  useEffect(() => {
    if (currentElement?.data?.businessData) {
      setFormData(currentElement.data.businessData);
    }
  }, [currentElement?.data?.businessData]);

  useEffect(() => {
    if (!currentElement?.data?.businessData || !formData) {
      return;
    }
    if (!isEqual(currentElement?.data?.businessData, formData)) {
      updateStore<Errors>('errors', (err) => {
        err.dataNotSaveMap.set(currentElement, true);
        return { ...err };
      });
    } else {
      updateStore<Errors>('errors', (err) => {
        err.dataNotSaveMap.delete(currentElement);
        return { ...err };
      });
    }
  }, [currentElement?.data?.businessData, formData]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    updateDataField(currentElement.id, null, () => formData);
  }

  function onFieldChange(fieldName: string) {
    return (value: BasicNodeConfig | FieldPermissionType | OperationPermissionType) => {
      setFormData((f) => ({
        ...f,
        [fieldName]: value,
      }));
    };
  }

  function onCancel() {
    if (errors?.dataNotSaveMap?.get(currentElement)) {
      updateStore<StoreValue>(null, (s) => ({
        ...s,
        showDataNotSaveConfirm: true,
        currentDataNotSaveConfirmCallback: () => updateStore<StoreValue>(null, (s) => {
          s.errors.dataNotSaveMap.delete(currentElement);
          return {
            ...s,
            asideDrawerType: '',
            errors: s.errors,
          };
        }),
      }));
      return false;
    } else {
      updateStore<StoreValue>(null, (s) => ({ ...s, asideDrawerType: '' }));
    }
  }

  if (!currentElement || !formData?.basicConfig) {
    return null;
  }

  return (
    <>
      {currentElement.type === 'approve' && (
        <Drawer
          title={(
            <span className="text-h5 mr-8">审批</span>
          )}
          distanceTop={0}
          onCancel={onCancel}
          className="flow-editor-drawer"
        >
          <form
            onSubmit={onSubmit}
            className="flex-1 flex flex-col justify-between h-full"
          >
            <div className="flex-1" style={{ height: 'calc(100% - 56px)' }}>
              <FormSelector
                changeable={false}
                value={currentFormNodeElement.data.businessData.form.value}
              />
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
                    <BasicConfig
                      type="approve"
                      value={formData.basicConfig}
                      onChange={onFieldChange('basicConfig')}
                    />
                  ),
                }, {
                  id: 'fieldPermission',
                  name: '字段权限',
                  content: (
                    <FieldPermission
                      onChange={onFieldChange('fieldPermission')}
                      value={formData.fieldPermission}
                    />
                  ),
                }, {
                  id: 'operatorPermission',
                  name: '操作权限',
                  content: (
                    <OperatorPermission
                      value={formData.operatorPermission}
                      onChange={onFieldChange('operatorPermission')}
                    />
                  ),
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
