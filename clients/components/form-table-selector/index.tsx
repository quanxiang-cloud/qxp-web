import React, { forwardRef, Ref, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import cs from 'classnames';
import { noop } from 'lodash';

import Icon from '@c/icon';
import ToolTip from '@c/tooltip';
import Select from '@c/select';
import toast from '@lib/toast';

import { getFormDataMenuList } from './api';

interface Props {
  value: { name?: string; value: string };
  changeable?: boolean;
  validating?: boolean;
  errorMessage?: string;
  exclude?: string[];
  onChange?: (value: { name?: string; value: string }) => void;
}

function FormTableSelector({
  value,
  validating,
  errorMessage,
  onChange = noop,
  changeable = true,
}: Props,
ref?: Ref<any>): JSX.Element {
  const { appID, pageId } = useParams<{ appID: string, pageId: string }>();
  const popupRef = useRef<HTMLDivElement>(null);

  const {
    isError,
    data: optionsData = [],
    error = '获取工作表失败',
  } = useQuery(['GET_WORK_FORM_LIST', appID], () => getFormDataMenuList(appID), { enabled: !!appID });

  useEffect(() => {
    isError && toast.error(error as string);
  }, [isError]);

  function onWorkFormChange(value: string): void {
    const currOption = optionsData.find((option) => option.value === value);
    onChange({
      value: currOption?.value || '',
      name: currOption?.label || '',
    });
  }

  const _optionsData = optionsData.filter((option) => option.value !== pageId);

  return (
    <>
      <div ref={popupRef} className={cs('px-16 py-10 border flex items-center corner-2-8-8-8 h-40 mt-24', {
        'bg-gray-100 mb-18': !validating || value.value,
        'bg-red-50 border-red-600': validating && !value.value,
      })}>
        <div className="inline-flex items-center mr-8">
          <Icon name="article" size={20} className="mr-8" />
          <span className="text-body2">工作表:</span>
        </div>
        {changeable && (
          <Select
            ref={ref}
            options={_optionsData}
            placeholder="请选择"
            value={value.value}
            onChange={onWorkFormChange}
            className={cs(
              'h-28 border-none px-12 text-12 flex items-center',
              'flex-1 work-flow-form-selector text-body2-no-color',
              {
                'text-gray-900': !validating || value.value,
                'text-gray-400': validating && !value.value,
              },
            )}
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
              ref={ref}
              options={_optionsData}
              placeholder="请选择"
              value={value.value}
              onChange={onWorkFormChange}
              className="h-28 border-none px-12 text-12 flex items-center flex-1 work-flow-form-selector"
            />
          </ToolTip>
        )}
      </div>
      {validating && !value.value && (
        <div className="mb-22 text-caption-no-color text-red-600 mt-4">
          {errorMessage || '请选择一张工作表用以触发工作流'}
        </div>
      )}
    </>
  );
}

export default forwardRef(FormTableSelector);
