import React, { forwardRef, Ref, useEffect } from 'react';
import cs from 'classnames';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Cascader } from 'antd';
import { CascaderOptionType } from 'antd/lib/cascader';
import { last } from 'lodash';

import Icon from '@c/icon';
import ToolTip from '@c/tooltip';
import toast from '@lib/toast';
import { noop } from '@lib/utils';

import { getFormDataOptions, Options } from '@flow/detail/content/editor/forms/api';
import type { NodeWorkForm } from '@flow/detail/content/editor/type';

interface Props {
  value: NodeWorkForm;
  changeable?: boolean;
  onChange?: (value: NodeWorkForm) => void;
  validating: boolean;
}

function WorkFormSelector(
  { value, changeable = true, onChange = noop, validating }: Props,
  ref?: Ref<Cascader>
) {
  const { appID } = useParams<{appID: string}>();

  const {
    data: options = [],
    isError,
    error = '获取工作表失败',
  } = useQuery(['GET_WORK_FORM_LIST', appID], getFormDataOptions, {
    enabled: !!appID,
  });

  useEffect(() => {
    isError && toast.error(error);
  }, [isError]);

  function onWorkFormChange(_: unknown, selectedOptions?: CascaderOptionType[]) {
    const table = last(selectedOptions);
    onChange({
      value: table?.value as string,
      name: table?.label as string,
    });
  }

  function getPathWhenMatch(
    val: string,
    dataSource: Options,
    map?: Record<string, string[]>,
    id?: number
  ) {
    const pathMap: Record<string, string[]> = map ?? {};
    for (let index = 0; index < dataSource.length; index += 1) {
      const { value, children } = dataSource[index];
      const currentIndex = id ?? index;
      if (!pathMap[currentIndex]) {
        pathMap[currentIndex] = [];
      }
      pathMap[currentIndex].push(value);
      if (children) {
        getPathWhenMatch(val, children, pathMap, currentIndex) as string[];
      }
    }
    return Object.entries(pathMap).find(([, value]) => value.includes(val))?.[1] ?? [];
  }

  const currentValuePath = getPathWhenMatch(value.value, options);

  return (
    <>
      <div className={cs('px-16 py-10 border flex items-center corner-2-8-8-8 h-40', {
        'bg-gray-100 mb-22': !validating || value.value,
        'bg-red-50 border-red-600': validating && !value.value,
      })}>
        <div className="inline-flex items-center mr-8">
          <Icon name="article" size={20} className="mr-8" />
          <span className="text-body2">工作表:</span>
        </div>
        {changeable && (
          <Cascader
            allowClear={false}
            bordered={false}
            options={options}
            expandTrigger={'hover'}
            onChange={onWorkFormChange}
            placeholder="请选择"
            value={currentValuePath}
            popupClassName="ml-12"
            ref={ref}
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
            <Cascader
              disabled
              allowClear={false}
              bordered={false}
              options={options}
              expandTrigger={'hover'}
              onChange={onWorkFormChange}
              placeholder="请选择"
              value={currentValuePath}
              popupClassName="ml-12"
              ref={ref}
              className={cs(
                'h-28 border-none px-12 text-12 flex items-center',
                'flex-1 work-flow-form-selector',
              )}
            />
          </ToolTip>
        )}
      </div>
      {validating && !value.value && (
        <div className="mb-22 text-caption-no-color text-red-600 mt-4">
          请选择一张工作表用以触发工作流
        </div>
      )}
    </>
  );
}

export default forwardRef(WorkFormSelector);
