import React, { forwardRef, Ref } from 'react';
import cs from 'classnames';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import Select from '@c/select';
import Icon from '@c/icon';
import ToolTip from '@c/tooltip';
import toast from '@lib/toast';

import { getFormDataOptions } from './api';

interface Props {
  value: string;
  changeable?: boolean;
  onChange?: (value: { value: string; name: string }) => void;
}

export default forwardRef(function FormSelector(
  { value, changeable = true, onChange = () => {} }: Props,
  ref?: Ref<HTMLInputElement>
) {
  const { appID } = useParams<{appID: string}>();

  const {
    data: options = [],
    isError,
    error = '获取工作表失败',
  } = useQuery(['GET_WORK_FORM_LIST', appID], getFormDataOptions);

  if (isError) {
    toast.error(error);
  }

  return (
    <div className="px-16 py-10 flex items-center mb-22 bg-gray-100
    input-border-radius h-40">
      <div className="inline-flex items-center mr-8">
        <Icon name="article" size={20} className="mr-8" />
        <span className="text-body2">工作表:</span>
      </div>
      {changeable && (
        <Select
          disabled={!changeable}
          inputRef={ref}
          name="workForm"
          placeholder="请选择"
          value={value}
          onChange={(v: string) => onChange({
            value: v,
            name: options.find(({ value }) => value === v)?.label || '',
          })}
          className={cs(
            'h-28 border-none px-12 text-12 flex items-center',
            'flex-1 work-flow-form-selector'
          )}
          options={options}
        />
      )}
      {!changeable && (
        <ToolTip
          position="top"
          label="已自动关联开始节点工作表，暂不支持更改"
          labelClassName="whitespace-nowrap"
        >
          <Select
            disabled
            inputRef={ref}
            name="workForm"
            placeholder="请选择"
            value={value}
            className={cs(
              'h-28 border-none px-12 text-12 flex items-center',
              'flex-1 work-flow-form-selector'
            )}
            options={options}
          />
        </ToolTip>
      )}
    </div>
  );
});
