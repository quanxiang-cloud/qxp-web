import React from 'react';
import cs from 'classnames';
import { FormItem, IForm, IMutators } from '@formily/antd';
import { useCss } from 'react-use';

import Icon from '@c/icon';
import FormDataValueRenderer from '@c/form-data-value-renderer';

import type { Column } from './index';

interface Props {
  index: number;
  componentColumns: Column[];
  item: Record<string, FormDataValue>;
  form: IForm;
  mutators: IMutators;
  name?: string;
}

export default function SubTableRow({
  index, item, componentColumns, name, form, mutators,
}: Props): JSX.Element {
  function onRemoveRow(mutators: IMutators, index: number): void {
    mutators.remove(index);
  }

  function onChange(path: string, form: IForm) {
    return (value: unknown): void => {
      form.setFieldValue(path, value);
    };
  }

  return (
    <div className="overflow-scroll">
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
            dataIndex, component, props, dataSource, required, rules, readonly, schema,
          }, idx) => {
            const path = `${name}.${index}.${dataIndex}`;
            return (
              <div
                key={dataIndex}
                style={{ minHeight: 32 }}
                className={cs({
                  'border-r-1 border-gray-300': idx < componentColumns.length,
                  'px-56': readonly,
                }, useCss({
                  '.ant-form-item': {
                    marginBottom: 0,
                  },
                }))}
              >
                {component && !readonly && (
                  <FormItem
                    {...props}
                    className="mx-8 my-8 w-full"
                    name={path}
                    component={component}
                    form={form}
                    props={{ ...props, props }}
                    mutators={{ change: onChange(path, form) }}
                    rules={rules as any}
                    dataSource={dataSource}
                    required={required}
                    value={item?.[dataIndex]}
                  />
                )}
                {readonly && (
                  <FormDataValueRenderer value={item?.[dataIndex]} schema={schema} />
                )}
              </div>
            );
          })}
        </div>
        <div
          className="px-22 border-gray-300 border-t-1 self-stretch flex items-center"
        >
          <Icon
            className="cursor-pointer"
            name="delete"
            size={29}
            onClick={() => onRemoveRow(mutators, index)}
          />
        </div>
      </div>
    </div>
  );
}
