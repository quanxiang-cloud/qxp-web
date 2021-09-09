import React from 'react';
import cs from 'classnames';
import { isArray } from 'lodash';
import { FormItem, IForm, IMutators } from '@formily/antd';
import { useCss } from 'react-use';

import Icon from '@c/icon';

import type { Column } from './index';

interface Props {
  index: number;
  componentColumns: Column[];
  item: Record<string, FormDataValue>;
  form: IForm;
  mutators: IMutators;
  portalReadOnlyClassName: string;
  name?: string;
}

export default function SubTableRow({
  index, item, componentColumns, name, form, mutators, portalReadOnlyClassName,
}: Props): JSX.Element {
  const formItemClassName = useCss({
    '.ant-form-item': {
      marginBottom: 0,
    },
    '&>*': {
      width: 'calc(100% - 20px)',
      overflow: 'auto',
    },
  });

  function onRemoveRow(mutators: IMutators, index: number): void {
    mutators.remove(index);
  }

  function onChange(path: string, form: IForm) {
    return (value: unknown): void => {
      form.setFieldValue(path, value);
    };
  }

  return (
    <div>
      {index === 0 && (
        <div className="flex items-start justify-between whitespace-nowrap">
          <div
            className="flex-1 grid"
            style={{
              gridTemplateColumns: `repeat(${componentColumns.length}, minmax(120px, 1fr))`,
            }}
          >
            {componentColumns.map(({ title, required }, idx) => (
              <div key={idx} className={cs('text-center', {
                'border-r-1 border-gray-300': idx < componentColumns.length,
              })}>
                {required ? (
                  <span className="mr-5" style={{ color: '#a87366' }}>*</span>
                ) : ''}
                {title}
              </div>
            ))}
          </div>
          <div className="px-22 text-center">
            操作
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div
          className="flex-1 grid border-gray-300 border-t-1"
          style={{
            gridTemplateColumns: `repeat(${componentColumns.length}, minmax(120px, 1fr))`,
          }}
        >
          {componentColumns.map(({
            dataIndex, component, props, dataSource, required, rules, schema, readOnly, render,
          }, idx) => {
            const path = `${name}.${index}.${dataIndex}`;
            let value = item?.[dataIndex];
            if (schema.type === 'array') {
              value = isArray(value) ? value : [value].filter(Boolean) as FormDataValue;
            }
            return (
              <div
                key={dataIndex}
                style={{ minHeight: 32 }}
                className={cs(
                  {
                    'border-r-1 border-gray-300': idx < componentColumns.length,
                  }, 'flex items-center justify-center', formItemClassName, portalReadOnlyClassName,
                )}
              >
                {!readOnly && component && (
                  <FormItem
                    {...props}
                    className="mx-8 my-8 w-full"
                    name={path}
                    component={component}
                    form={form}
                    props={{ ...props, props }}
                    mutators={{ change: onChange(path, form) }}
                    rules={rules}
                    dataSource={dataSource}
                    required={required}
                    value={value}
                    path={path}
                  />
                )}
                {readOnly && render?.(value)}
              </div>
            );
          })}
        </div>
        <div
          className="px-22 border-gray-300 border-t-1 self-stretch flex items-center"
        >
          <Icon
            className={cs(portalReadOnlyClassName)}
            name="delete"
            size={29}
            clickable
            onClick={() => onRemoveRow(mutators, index)}
          />
        </div>
      </div>
    </div>
  );
}
