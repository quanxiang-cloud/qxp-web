import React, { JSXElementConstructor, useEffect, useState, useContext } from 'react';
import { ISchemaFieldComponentProps, IMutators } from '@formily/react-schema-renderer';
import { Rule } from 'rc-field-form/lib/interface';
import { Table } from 'antd';
import { Input, NumberPicker } from '@formily/antd-components';
import cs from 'classnames';
import { isObject } from 'lodash';
import { useQuery } from 'react-query';
import {
  InternalFieldList as FieldList, ValidatePatternRules,
} from '@formily/antd';

import CanvasContext from '@c/form-builder/canvas-context';
import logger from '@lib/logger';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import Icon from '@c/icon';
import { isEmpty } from '@lib/utils';
import schemaToFields from '@lib/schema-convert';
import OrganizationPicker from '@c/form-builder/registry/organization-select/organization-select-wrap';
import FileUpload from '@c/form-builder/registry/file-upload/uploader';
import ImageUpload from '@c/form-builder/registry/image-upload/uploader';
import UserPicker from '@c/form-builder/registry/user-picker/user-picker-wrap';
import CascadeSelector from '@c/form-builder/registry/cascade-selector/cascade-selector-wrap';
import AssociatedData from '@c/form-builder/registry/associated-data/associated-data';
import RadioGroup from '@c/form-builder/registry/radio-group/radioGroup';
import CheckBoxGroup from '@c/form-builder/registry/checkbox-group/checkboxGroup';
import DatePicker from '@c/form-builder/registry/date-picker/date-picker';
import Select from '@c/form-builder/registry/select/custom-select';
import MultipleSelect from '@c/form-builder/registry/multiple-select/multiple-select';

import { getDefaultValue, schemaRulesTransform } from './utils';
import SubTableRow from './row';
import { getTableSchema } from '@lib/http-client';

export type Rules = (ValidatePatternRules | ValidatePatternRules[]) & Rule[];
export type Column = {
  title: string;
  dataIndex: string;
  component?: JSXElementConstructor<any>;
  props: Record<string, unknown>;
  dataSource?: any[];
  required?: boolean;
  rules: Rules;
  render?: (value: unknown) => JSX.Element;
  schema: ISchema;
  editable: boolean;
}

type Components = typeof components;

const components = {
  input: Input,
  radiogroup: RadioGroup,
  checkboxgroup: CheckBoxGroup,
  textarea: Input.TextArea,
  datepicker: DatePicker,
  numberpicker: NumberPicker,
  select: Select,
  multipleselect: MultipleSelect,
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
  editable,
  mutators,
}: Partial<Props>): JSX.Element | null {
  const [{ componentColumns, rowPlaceHolder }, setSubTableState] = useState<SubTableState>({
    componentColumns: [], rowPlaceHolder: {},
  });
  let schema = definedSchema?.items as ISchema | undefined;
  const { subordination, columns, appID, tableID } = definedSchema?.['x-component-props'] || {};
  const isFromForeign = subordination === 'foreign_table';
  const { isInCanvas } = useContext(CanvasContext);
  const isPortal = window.SIDE === 'portal';
  const portalReadOnlyClassName = cs({ 'pointer-events-none': isPortal && isInCanvas });
  const { data } = useQuery('GET_SUB_TABLE_CONFIG_SCHEMA', () => getTableSchema(appID, tableID), {
    enabled: !!(isFromForeign && tableID && appID),
  });
  const isInitialValueEmpty = value?.every((v: Record<string, unknown>) => !isEmpty(v));
  schema = isFromForeign ? data?.schema : schema;

  useEffect(() => {
    if (!schema) {
      return;
    }
    const rowPlaceHolder = {};
    const componentColumns: Column[] = schemaToFields(schema).reduce((acc: Column[], field) => {
      const isHidden = !field.display;
      if ((isFromForeign && !columns?.includes(field.id)) || field.id === '_id' || isHidden) {
        return acc;
      }
      const newColumn = buildColumnFromSchema(field.id, field);
      if (newColumn) {
        Object.assign(rowPlaceHolder, { [field.id]: getDefaultValue(field) });
        acc.push(newColumn);
      }
      return acc;
    }, []);
    setSubTableState({ componentColumns, rowPlaceHolder });
  }, [schema, columns]);

  useEffect(() => {
    isPortal && isInCanvas && isInitialValueEmpty && mutators?.change([rowPlaceHolder]);
  }, [isPortal, isInCanvas, value]);

  useEffect(() => {
    isInitialValueEmpty && mutators?.change([rowPlaceHolder]);
  }, []);

  function buildColumnFromSchema(dataIndex: string, sc: ISchema): Column | null {
    const componentName = sc['x-component']?.toLowerCase() as keyof Components;
    const componentProps = sc['x-component-props'] || {};
    const componentPropsInternal = sc['x-internal'] || {};
    const dataSource = sc?.enum?.filter((option) => !isObject(option) || option?.label !== '');
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
      required: !!sc?.required,
      editable: !sc.readOnly,
      rules: schemaRulesTransform(sc),
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

  if (!componentColumns.length) {
    return null;
  }

  if (!editable) {
    return (
      <Table
        pagination={false}
        rowKey="_id"
        columns={componentColumns}
        dataSource={componentColumns.length ? value : []}
      />
    );
  }

  return (
    <FieldList name={name} initialValue={value}>
      {({ state, mutators, form }) => {
        return (
          <div className="w-full flex flex-col border border-gray-300">
            <div className="overflow-scroll">
              {state.value.map((item: Record<string, FormDataValue>, index: number) => {
                return (
                  <SubTableRow
                    name={name}
                    componentColumns={componentColumns}
                    key={index}
                    index={index}
                    item={item}
                    form={form}
                    mutators={mutators}
                    portalReadOnlyClassName={portalReadOnlyClassName}
                  />
                );
              })}
            </div>
            <div className="border-t-1 border-gray-300 flex items-center">
              <Icon
                name="add"
                size={24}
                className={
                  cs('m-5 font-bold cursor-pointer', portalReadOnlyClassName)
                }
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
