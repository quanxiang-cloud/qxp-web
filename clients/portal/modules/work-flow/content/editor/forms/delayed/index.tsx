import React, { ReactElement, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import Tab from '@c/tab';
import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';
import FlowTableContext from '@flow/content/editor/forms/flow-source-table';
import RadioGroup from '@c/radio/group';
import Radio from './radio';
import Date from './date';
import TimerSelector from './timer-select';
import DateField from './date-field';
import { DelayedTypes } from './types';
import type { DelayedValue, DelayedType } from '@flow/content/editor/type';
import { getDefaultVal, getDelayedValue } from './utils';

interface Props {
  defaultValue: DelayedValue;
  onSubmit: (value: DelayedValue) => void;
  onCancel: () => void;
}

const personTypeOptions = [
  {
    label: '延时至指定日期',
    value: 'specTime',
    describe: '到达该节点后，等待至指定时间后继续流转',
    component: Date,
  },
  {
    label: '延时一段时间',
    value: 'aTime',
    describe: '到达该节点后，等待一段时间后继续流转',
    component: TimerSelector,
  },
  {
    label: '按日期字段',
    value: 'tableColumn',
    describe: '到达该节点后，等待至指定工作表时间后继续流转',
    component: DateField,
  },
];
const Delayed = ({ defaultValue, onSubmit, onCancel }: Props): ReactElement=>{
  const {
    control,
    formState,
    reset,
    getValues,
    handleSubmit,
  } = useForm<DelayedTypes>({ defaultValues: getDefaultVal(defaultValue) });
  const { tableID: tableId } = useContext(FlowTableContext);
  const [type, setType] = useState<DelayedType>(defaultValue.delayPolicy?.type ?? 'specTime');
  const onSave = handleSubmit((val)=>{
    onSubmit(getDelayedValue(val, type, tableId));
  });
  const handleTypeChange = (val: string | number | boolean): void=>{
    reset();
    setType(val as DelayedType);
  };
  return (
    <form>
      <Tab
        className="mt-10"
        items={[{
          id: 'basicConfig',
          name: '基础配置',
          content: (
            <div className="mt-24">
              <RadioGroup onChange={handleTypeChange}>
                {personTypeOptions.map(({ label, value: val, component: Component, describe }) => (
                  <Radio
                    key={val}
                    className="mr-16"
                    label={label}
                    value={val}
                    defaultChecked={type === val}
                    describe={describe}
                  >
                    {val === type &&
                    (<Component
                      formState={formState}
                      control={control}
                      getValues={getValues}
                      reset={reset}
                    />)}
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          ),
        }]}
      />
      <SaveButtonGroup onSave={onSave} onCancel={onCancel} />
    </form>
  );
};
export default Delayed;

