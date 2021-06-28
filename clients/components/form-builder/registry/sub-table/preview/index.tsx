import React, { JSXElementConstructor, ChangeEvent, useRef } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import moment, { Moment } from 'moment';
import { Input, Radio, DatePicker, NumberPicker, Select } from '@formily/antd-components';
import { Table } from 'antd';
import { pick } from 'lodash';
import cs from 'classnames';
import usePrevious from 'react-use/lib/usePrevious';
import {
  InternalFieldList as FieldList,
  FormItem, ValidatePatternRules,
} from '@formily/antd';

import logger from '@lib/logger';
import Icon from '@c/icon';

type Column = {
  title: string;
  dataIndex: string;
  component?: JSXElementConstructor<any>;
  props: Record<string, unknown>;
  dataSource?: any[];
  required?: boolean;
  rules?: ValidatePatternRules;
}

type Components = typeof components;

const components = {
  input: Input,
  radiogroup: Radio.Group,
  textarea: Input.TextArea,
  datepicker: DatePicker,
  numberpicker: NumberPicker,
  select: Select,
  multipleselect: Select,
};

interface Props extends ISchemaFieldComponentProps {
  props: {
    [key: string]: any;
    ['x-component-props']: {
      columns: string[];
      appID: string;
      tableID: string;
      subordination: 'foreign_table' | 'sub_table';
      tableName: string;
    }
  },
}

function SubTable({
  schema: definedSchema,
  initialValue,
  mutators: ms,
  name,
  props,
  readonly,
  value,
}: Partial<Props>): JSX.Element | null {
  const firstMountRef = useRef(true);
  const {
    subordination, columns: definedColumns,
  } = props?.['x-component-props'] || {};
  const isFromForeign = subordination === 'foreign_table';

  function buildColumnFromSchema(dataIndex: string, sc: ISchema): Column | null {
    const componentName = sc['x-component']?.toLowerCase() as keyof Components;
    const componentProps = sc['x-component-props'] || {};
    const dataSource = sc?.enum;
    if (!components[componentName]) {
      logger.error('component %s is missing in subTable', componentName);
      return null;
    }
    return {
      title: sc.title as string,
      dataIndex,
      component: components[componentName],
      props: componentProps,
      dataSource,
      required: sc?.required as boolean,
      rules: sc?.['x-rules'] || [],
    };
  }

  const schema = definedSchema?.items as ISchema;

  const emptyRow: Record<string, string> = {};
  const columns: Column[] = Object.entries(schema?.properties || {}).sort((a, b) => {
    return (a[1]['x-index'] || 0) - (b[1]['x-index'] || 0);
  }).reduce(
    (cur: Column[], next) => {
      const [key, sc] = next;
      const componentProps = sc['x-component-props'] || {};
      if ((isFromForeign && !definedColumns?.includes(key)) || key === '_id') {
        return cur;
      }
      const newColumn = buildColumnFromSchema(key, sc);
      if (newColumn) {
        Object.assign(emptyRow, { [key]: sc.default || componentProps?.defaultValue });
        cur.push(newColumn);
      }
      return cur;
    }, []) as Column[];

  function getChangedValue(e: ChangeEvent<HTMLInputElement> | string | Moment): string {
    let changedValue = '';
    if (moment.isMoment(e)) {
      changedValue = e.format('YYYY-MM-DD HH:mm:ss');
    } else if ((e as ChangeEvent<HTMLInputElement>)?.target) {
      changedValue = (e as ChangeEvent<HTMLInputElement>).target.value;
    } else {
      changedValue = e as string;
    }
    return changedValue;
  }

  const previousColumns = usePrevious(columns);
  if (previousColumns?.length && !columns.length) {
    firstMountRef.current = true;
  }
  if (!columns.length) {
    return null;
  }

  if (readonly) {
    return (
      <Table
        pagination={false}
        rowKey="_id"
        columns={columns.map((column) => pick(column, ['dataIndex', 'title']))}
        dataSource={columns.length ? value : []}
      />
    );
  }

  return (
    <FieldList
      name={name}
      initialValue={initialValue.length ? initialValue : [emptyRow]}
    >
      {({ state, mutators }) => {
        if (!state.value?.length && firstMountRef.current) {
          state.value = initialValue.length ? initialValue : [emptyRow];
        }
        const onAdd = (): any[] => mutators.push();
        return (
          <div className="flex flex-col">
            {state.value.map((item: any, index: number) => {
              const onRemove = (index: number): void => {
                firstMountRef.current = false;
                mutators.remove(index);
              };
              const onItemChange = (
                e: ChangeEvent<HTMLInputElement> | string,
                dataIndex: string,
              ): void => {
                const newValue = state.value.map((vItem: any, idx: number) => {
                  if (index !== idx) {
                    return vItem;
                  }
                  return {
                    ...vItem,
                    [dataIndex]: getChangedValue(e),
                  };
                });
                ms?.change(newValue);
                state.value = newValue;
              };
              return (
                <div key={index}>
                  {index === 0 && (
                    <div className="flex items-start justify-between border border-gray-300">
                      <div className={`flex-1 grid grid-cols-${columns.length}`}>
                        {columns.map(({ title, required }, idx) => (
                          <div key={idx} className={cs('text-center', {
                            'border-r-1 border-gray-300': idx < columns.length,
                          })}>
                            {required ? (
                              <span className="mr-5" style={{ color: '#a87366' }}>*</span>
                            ) : ''}
                            {title}
                          </div>
                        ))}
                      </div>
                      <Icon
                        className="mx-22 opacity-0"
                        name="delete"
                        size={20}
                      />
                    </div>
                  )}
                  <div
                    className="flex items-center justify-between border border-gray-300 border-t-0"
                  >
                    <div className={`flex-1 grid grid-cols-${columns.length}`}>
                      {columns.map(({
                        dataIndex, component, props, dataSource, required, rules,
                      }, idx) => (
                        <div key={dataIndex} className={cs({
                          'border-r-1 border-gray-300': idx < columns.length,
                        })}>
                          {component && (
                            <FormItem
                              className="mx-8 mb-8 w-full mt-24"
                              name={`${name}.${index}.${dataIndex}`}
                              component={component}
                              props={props}
                              rules={rules as any}
                              dataSource={dataSource}
                              required={required}
                              value={item?.[dataIndex] || undefined}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                onItemChange(e, dataIndex);
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <Icon
                      className="mx-22 cursor-pointer"
                      name="delete"
                      size={20}
                      onClick={onRemove.bind(null, index)}
                    />
                  </div>
                </div>
              );
            })}
            <Icon
              name="add"
              size={24}
              className="mt-12 mb-3 font-bold cursor-pointer"
              onClick={onAdd}
            />
          </div>
        );
      }}
    </FieldList>
  );
}

SubTable.isFieldComponent = true;

export default SubTable;
