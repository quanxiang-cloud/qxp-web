import React, { JSXElementConstructor, useEffect, useState } from 'react';
import { ISchemaFieldComponentProps, IMutators } from '@formily/react-schema-renderer';
import { usePrevious } from 'react-use';
import { Input, Radio, DatePicker, NumberPicker, Select, Checkbox } from '@formily/antd-components';
import { Table } from 'antd';
import cs from 'classnames';
import {
  InternalFieldList as FieldList, FormItem, ValidatePatternRules, IForm, Schema,
} from '@formily/antd';

import OrganizationPicker from '@c/form-builder/registry/organization-select/organization-select-wrap';
import FileUpload from '@c/form-builder/registry/file-upload/uploader';
import ImageUpload from '@c/form-builder/registry/image-upload/uploader';
import UserPicker from '@c/form-builder/registry/user-picker/user-picker-wrap';
import logger from '@lib/logger';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import Icon from '@c/icon';
import CascadeSelector from '@c/form-builder/registry/cascade-selector/cascade-selector-wrap';
import AssociatedData from '@c/form-builder/registry/associated-data/associated-data';
import { isEmpty } from '@lib/utils';

import { getDefaultValue } from './utils';

type Column = {
  title: string;
  dataIndex: string;
  component?: JSXElementConstructor<any>;
  readonly?: boolean;
  props: Record<string, unknown>;
  dataSource?: any[];
  required?: boolean;
  rules?: ValidatePatternRules;
  render?: (value: unknown) => JSX.Element;
  schema: ISchema;
}

type Components = typeof components;

const components = {
  input: Input,
  radiogroup: Radio.Group,
  checkboxgroup: Checkbox.Group,
  textarea: Input.TextArea,
  datepicker: DatePicker,
  numberpicker: NumberPicker,
  select: Select,
  multipleselect: Select,
  userpicker: UserPicker,
  organizationpicker: OrganizationPicker,
  fileupload: FileUpload,
  imageupload: ImageUpload,
  cascadeselector: CascadeSelector,
  associateddata: AssociatedData,
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

interface SubTableState {
  componentColumns: Column[];
  rowPlaceHolder: Record<string, unknown>;
}

function SubTable({
  schema: definedSchema,
  value,
  name,
  readonly,
  mutators,
}: Partial<Props>): JSX.Element | null {
  const [{ componentColumns, rowPlaceHolder }, setSubTableState] = useState<SubTableState>({
    componentColumns: [], rowPlaceHolder: {},
  });
  const schema = definedSchema?.items as ISchema;
  const props = (schema as Schema)?.parent;
  const { subordination, columns } = props?.['x-component-props'] || {};
  const previousColumns = usePrevious(columns);
  const isFromForeign = subordination === 'foreign_table';
  const initialValue = value?.length ? value : [rowPlaceHolder];

  useEffect(() => {
    const rowPlaceHolder = {};
    const componentColumns: Column[] = Object.entries(schema?.properties || {}).sort((a, b) => {
      return (a[1]['x-index'] || 0) - (b[1]['x-index'] || 0);
    }).reduce(
      (cur: Column[], next) => {
        const [key, sc] = next;
        const isHidden = !sc.display;
        if ((isFromForeign && !columns?.includes(key)) || key === '_id' || isHidden) {
          return cur;
        }
        const newColumn = buildColumnFromSchema(key, sc);
        if (newColumn) {
          Object.assign(rowPlaceHolder, { [key]: getDefaultValue(schema) || '' });
          cur.push(newColumn);
        }
        return cur;
      }, [],
    ) as Column[];
    setSubTableState({ componentColumns, rowPlaceHolder });
  }, [schema, columns]);

  useEffect(() => {
    if (!previousColumns?.filter((key: string) => key !== '_id')?.length &&
      columns?.filter((key: string) => key !== '_id')?.length &&
      initialValue?.every((v: Record<string, unknown>) => !isEmpty(v))
    ) {
      mutators?.change(initialValue);
    }
  });

  function buildColumnFromSchema(dataIndex: string, sc: ISchema): Column | null {
    const componentName = sc['x-component']?.toLowerCase() as keyof Components;
    const componentProps = sc['x-component-props'] || {};
    const componentPropsInternal = sc['x-internal'] || {};
    const dataSource = sc?.enum;
    if (!components[componentName]) {
      logger.error('component %s is missing in subTable', componentName);
      return null;
    }
    return {
      title: sc.title as string,
      dataIndex,
      component: components[componentName],
      props: {
        ...componentProps,
        ...componentPropsInternal,
        'x-component-props': componentProps,
        'x-internal': componentPropsInternal,
      },
      schema: sc,
      dataSource,
      readonly: sc?.readOnly,
      required: sc?.required as boolean,
      rules: sc?.['x-rules'] || [],
      render: (value: any) => {
        if (isEmpty(value)) {
          return <span className='text-gray-300'>——</span>;
        }

        return <FormDataValueRenderer value={value} schema={sc} />;
      },
    };
  }

  function onAddRow(mutators: IMutators): void {
    mutators.push(rowPlaceHolder);
  }

  function onRemoveRow(mutators: IMutators, index: number): void {
    mutators.remove(index);
  }

  function onChange(path: string, form: IForm) {
    return (value: unknown): void => {
      form.setFieldValue(path, value);
    };
  }

  if (!componentColumns.length) {
    return null;
  }

  if (readonly) {
    return (
      <Table
        pagination={false}
        rowKey="_id"
        columns={componentColumns}
        dataSource={componentColumns.length ? value : []}
      />
    );
  }

  console.log(componentColumns);

  return (
    <FieldList name={name} initialValue={initialValue}>
      {({ state, mutators, form }) => {
        return (
          <div className="w-full flex flex-col border border-gray-300">
            {state.value.map((item: any, index: number) => {
              return (
                <div key={index} className="overflow-scroll">
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
                          <div key={dataIndex} className={cs({
                            'border-r-1 border-gray-300': idx < componentColumns.length,
                            'px-56 h-32': readonly,
                          })}>
                            {component && !readonly && (
                              <FormItem
                                {...props}
                                className="mx-8 my-8 w-full"
                                name={path}
                                component={component}
                                props={{ ...props, props }}
                                mutators={{ change: onChange(path, form) }}
                                rules={rules as any}
                                dataSource={dataSource}
                                required={required}
                                value={item?.[dataIndex]}
                              />
                            )}
                            {readonly && (
                              <FormDataValueRenderer value={value} schema={schema} />
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
            })}
            <div className="border-t-1 border-gray-300 flex items-center">
              <Icon
                name="add"
                size={24}
                className="m-5 font-bold cursor-pointer"
                onClick={() => onAddRow(mutators)}
              />
            </div>
          </div>
        );
      }}
    </FieldList>
  );
}

SubTable.isFieldComponent = true;

export default SubTable;
