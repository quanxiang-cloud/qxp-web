import React, { useEffect, useContext, useState } from 'react';
import { useQuery } from 'react-query';

import toast from '@lib/toast';
import Tab from '@c/tab';
import type { FormDataData, NodeWorkForm } from '@flowEditor/type';
import FlowContext from '@flow/detail/flow-context';
import FormSelector from '@c/form-table-selector';
import SaveButtonGroup from '@flowEditor/components/_common/action-save-button-group';
import { TRIGGER_CONDITION_EXCLUDE_FIELD_NAMES } from '@flowEditor/utils/constants';

import TriggerWay from './basic-config/trigger-way';
import TriggerCondition from './basic-config/trigger-condition';
import { getFormFieldOptions } from '../api';

interface Props {
  defaultValue: FormDataData;
  onSubmit: (value: FormDataData) => void;
  onCancel: () => void;
}

export default function FormDataForm({ defaultValue, onSubmit, onCancel }: Props): JSX.Element {
  const { appID } = useContext(FlowContext);
  const [value, setValue] = useState<FormDataData>(defaultValue || {});
  const tableID = value?.form?.value || '';
  const { data: { options, schema } = { options: [], schema: {} }, isError, isLoading } = useQuery(
    ['GET_WORK_FORM_FIELD_LIST', tableID, appID],
    getFormFieldOptions, { enabled: !!tableID && !!appID },
  );

  useEffect(() => {
    isError && toast.error('获取工作表字段列表失败');
    !!tableID && !isLoading && !options.length && toast.error(
      '该工作表没有设置字段, 请更换工作表!',
    );
  }, [isError, tableID, isLoading, options.length]);

  function onWorkFormChange(form: NodeWorkForm): void {
    setValue((v) => ({ ...v, form }));
  }

  function onSave(): void {
    // todo get data value
    // todo validate data value
    // todo call onSubmit when data is valid
    onSubmit(value);
  }

  function onClose(): void {
    // todo check if the data is changed
    // todo pop close confirm when data is changed and is not saved
    // todo call onCancel when data is not changed or is saved
    onCancel();
  }

  function onChange(val: Partial<FormDataData>): void {
    setValue((v) => ({ ...v, ...val }));
  }

  const filteredConditionOptions = options?.filter(({ value }) => {
    return !TRIGGER_CONDITION_EXCLUDE_FIELD_NAMES.includes(value);
  });

  return (
    <>
      <FormSelector
        value={value.form}
        onChange={onWorkFormChange}
        changeable={!defaultValue?.form?.value}
      />
      <Tab
        className="mt-10"
        items={[{
          id: 'basicConfig',
          name: '基础配置',
          content: (
            <div className="mt-24">
              <TriggerWay
                formFieldOptions={options}
                onValueChange={onChange}
                triggerWayValue={{
                  triggerWay: value.triggerWay,
                  whenAlterFields: value.whenAlterFields,
                }}
              />
              <TriggerCondition
                formFieldOptions={filteredConditionOptions}
                schema={schema}
                onChange={onChange}
                value={value.triggerCondition}
              />
            </div>
          ),
        }]}
      />
      <SaveButtonGroup onSave={onSave} onCancel={onClose} />
    </>
  );
}
