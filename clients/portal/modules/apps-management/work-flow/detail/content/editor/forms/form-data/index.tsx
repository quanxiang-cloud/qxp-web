import React, { FormEvent, useState, useEffect } from 'react';
import cs from 'classnames';
import { useQuery } from 'react-query';

import Drawer from '@c/drawer';
import useObservable from '@lib/hooks/use-observable';
import Tab from '@c/tab';
import store, {
  StoreValue,
  CurrentElement,
  updateStore,
  FormDataData,
  TriggerWay as TriggerWayType,
  TriggerCondition as TriggerConditionType,
  updateDataField,
} from '@flow/detail/content/editor/store';
import SaveButtonGroup
  from '@flow/detail/content/editor/components/_common/action-save-button-group';

import TriggerWay from './basic-config/trigger-way';
import FormSelector from '../form-selector';
import TriggerCondition from './basic-config/trigger-condition';
import { getFormFieldOptions } from '../api';

export default function FormDataForm() {
  const { asideDrawerType, elements = [] } = useObservable<StoreValue>(store) || {};
  const currentElement = elements.find(({ type }) => type === 'formData') as CurrentElement;
  const [formData, setFormData] = useState<FormDataData>(currentElement?.data?.businessData);
  const { data: formFieldOptions = [] } = useQuery(
    ['GET_WORK_FORM_FIELD_LIST', formData?.form?.value],
    getFormFieldOptions, {
      enabled: !!formData?.form?.value,
    }
  );

  useEffect(() => {
    if (currentElement?.data?.businessData) {
      setFormData(currentElement.data.businessData);
    }
  }, [currentElement?.data?.businessData]);

  if (!currentElement) {
    return null;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    updateDataField('formData', null, () => formData);
  }

  function onFormChange(value: { value: string; name: string; }) {
    setFormData((s) => ({ ...s, form: { ...value } }));
  }

  function onTriggerWayChange(value: { triggerWay?: TriggerWayType, whenAlterFields?: string[]; }) {
    setFormData((s) => ({ ...s, ...value }));
  }

  function onTriggerConditionChange(triggerCondition: TriggerConditionType) {
    setFormData((s) => ({ ...s, triggerCondition }));
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
              <FormSelector
                value={formData?.form.value}
                onChange={onFormChange}
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
                    <div className="mt-24">
                      <TriggerWay
                        formFieldOptions={formFieldOptions}
                        triggerWayValue={{
                          triggerWay: formData.triggerWay,
                          whenAlterFields: formData.whenAlterFields,
                        }}
                        onValueChange={onTriggerWayChange}
                      />
                      <TriggerCondition
                        formFieldOptions={formFieldOptions}
                        value={formData.triggerCondition}
                        onChange={onTriggerConditionChange}
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
