import React, { forwardRef, Ref, useEffect } from 'react';
import cs from 'classnames';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Cascader } from 'antd';
import { CascaderOptionType } from 'antd/lib/cascader';
import { merge, noop, last } from 'lodash';
import { pipe, split, reduce, map } from 'ramda';

import Icon from '@c/icon';
import ToolTip from '@c/tooltip';
import toast from '@lib/toast';
import treeUtil from '@lib/tree';

import { getFormDataOptions, Options, Option } from './api';

export type Value = { name?: string; value: string }
type SelectorOption = Option & { fieldPath: string; };

interface Props {
  value: Value;
  changeable?: boolean;
  onChange?: (value: Value) => void;
  validating?: boolean;
  errorMessage?: string;
  exclude?: string[];
}

function buildOptions(optionsData: Options, exclude: string[]): Options {
  if (!exclude?.length) {
    return optionsData;
  }
  const options = [];
  for (let index = 0; index < optionsData.length; index += 1) {
    const op = optionsData[index];
    if (!exclude.includes(op.value)) {
      if (op.children?.length) {
        options.push(...buildOptions(op.children, exclude));
      } else {
        options.push(op);
      }
    }
  }

  return options;
}

function FormTableSelector(
  { value, changeable = true, onChange = noop, validating, errorMessage, exclude }: Props,
  ref?: Ref<Cascader>,
): JSX.Element {
  const { appID } = useParams<{appID: string}>();

  const {
    data: optionsData = [],
    isError,
    error = '获取工作表失败',
  } = useQuery(['GET_WORK_FORM_LIST', appID], getFormDataOptions, {
    enabled: !!appID,
  });

  const options = buildOptions(optionsData, exclude || []);

  useEffect(() => {
    isError && toast.error(error as string);
  }, [isError]);

  function onWorkFormChange(_: unknown, selectedOptions?: CascaderOptionType[]): void {
    const table = last(selectedOptions);
    onChange({
      value: table?.value as string,
      name: table?.label as string,
    });
  }

  const pathToOptionMap: Record<string, SelectorOption> = {};
  const valueToOptionMap = treeUtil.reduce<Record<string, SelectorOption>, Options | Option>(
    (acc, _form) => {
      const form = _form as SelectorOption;
      form.value && merge(acc, { [form.value]: form });
      merge(pathToOptionMap, { [form.fieldPath]: form });
      return acc;
    }, 'children', {}, options,
  );

  const getCurrentValuePath = pipe<string, string[], string[], string[]>(
    () => valueToOptionMap[value.value]?.fieldPath || '',
    split('.'),
    reduce((pathArr: string[], pathSegment: string) => {
      const lastSegment = last(pathArr);
      pathArr.push(lastSegment ? `${lastSegment}.${pathSegment}` : pathSegment);
      return pathArr;
    }, []),
    map((path) => pathToOptionMap[path]?.value || ''),
  );

  const currentValuePath = getCurrentValuePath();

  const extra = {};
  if (ref) {
    Object.assign(extra, { ref });
  }

  return (
    <>
      <div className={cs('px-16 py-10 border flex items-center corner-2-8-8-8 h-40 mt-24', {
        'bg-gray-100 mb-18': !validating || value.value,
        'bg-red-50 border-red-600': validating && !value.value,
      })}>
        <div className="inline-flex items-center mr-8">
          <Icon name="article" size={20} className="mr-8" />
          <span className="text-body2">工作表:</span>
        </div>
        {changeable && (
          <Cascader
            {...extra}
            allowClear={false}
            bordered={false}
            options={options}
            expandTrigger={'hover'}
            onChange={onWorkFormChange}
            placeholder="请选择"
            value={currentValuePath}
            popupClassName="ml-12"
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
              {...extra}
              disabled
              allowClear={false}
              bordered={false}
              options={options}
              expandTrigger={'hover'}
              onChange={onWorkFormChange}
              placeholder="请选择"
              value={currentValuePath}
              popupClassName="ml-12"
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
          {errorMessage || '请选择一张工作表用以触发工作流'}
        </div>
      )}
    </>
  );
}

export default forwardRef(FormTableSelector);
