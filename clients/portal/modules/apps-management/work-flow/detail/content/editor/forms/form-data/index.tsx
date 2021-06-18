import React, { useEffect } from 'react';
import { useQuery } from 'react-query';

import toast from '@lib/toast';
import Tab from '@c/tab2';
import type {
  FormDataData,
} from '@flow/detail/content/editor/type';

import TriggerWay from './basic-config/trigger-way';
import TriggerCondition from './basic-config/trigger-condition';
import { getFormFieldOptions } from '../api';
import FlowContext from '../../../../context';
import { useContext } from 'react';

interface Props {
  formID: string;
  value: FormDataData;
  onChange: (value: Partial<FormDataData>) => void;
}

export default function FormDataForm({ formID, value, onChange }: Props): JSX.Element {
  const { appID } = useContext(FlowContext);
  const { data: formFieldOptions = [], isError, isLoading } = useQuery(
    ['GET_WORK_FORM_FIELD_LIST', formID, appID],
    getFormFieldOptions, {
      enabled: !!formID && !!appID,
    },
  );

  useEffect(() => {
    isError && toast.error('获取工作表字段列表失败');
    !!formID && !isLoading && !formFieldOptions.length && toast.error(
      '该工作表没有设置字段, 请更换工作表!',
    );
  }, [isError, formID, isLoading, formFieldOptions.length]);

  return (
    <Tab
      className="mt-10"
      items={[{
        id: 'basicConfig',
        name: '基础配置',
        content: (
          <div className="mt-24">
            <TriggerWay
              formFieldOptions={formFieldOptions}
              onValueChange={onChange}
              triggerWayValue={{
                triggerWay: value.triggerWay,
                whenAlterFields: value.whenAlterFields,
              }}
            />
            <TriggerCondition
              formFieldOptions={formFieldOptions}
              onChange={onChange}
              value={value.triggerCondition}
            />
          </div>
        ),
      }]}
    />
  );
}
