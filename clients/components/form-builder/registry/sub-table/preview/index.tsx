import React, { JSXElementConstructor, useEffect, useState, useContext } from 'react';
import { ISchemaFieldComponentProps, IMutators } from '@formily/react-schema-renderer';
import { usePrevious } from 'react-use';
import { Input, Radio, DatePicker, NumberPicker, Select, Checkbox } from '@formily/antd-components';
import { Table } from 'antd';
import cs from 'classnames';
import { isObject, isUndefined } from 'lodash';
import {
  InternalFieldList as FieldList, ValidatePatternRules, Schema,
} from '@formily/antd';

import CanvasContext from '@c/form-builder/canvas-context';
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
import schemaToFields from '@lib/schema-convert';
import { numberTransform } from '@c/form-builder/utils';

import { getDefaultValue } from './utils';
import SubTableRow from './row';

export type Column = {
  title: string;
  dataIndex: string;
  component?: JSXElementConstructor<any>;
  readonly?: boolean;
  editable?: boolean;
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
  readonly?: boolean;
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
  editable,
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
  const { isInCanvas } = useContext(CanvasContext);
  const isPortal = window.SIDE === 'portal';
  const portalReadOnlyClassName = cs({ 'pointer-events-none': isPortal && isInCanvas });

  useEffect(() => {
    const rowPlaceHolder = {};
    const componentColumns: Column[] = schemaToFields(schema).sort((a, b) => {
      return numberTransform(a) - numberTransform(b);
    }).reduce((acc: Column[], field) => {
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
    const dataSource = sc?.enum?.filter((option) => !isObject(option) || option?.label !== '');
    if (!components[componentName]) {
      logger.error('component %s is missing in subTable', componentName);
      return null;
    }
    const isEditable = !!(isUndefined(editable) ? sc?.editable : editable);
    const isReadOnly = !!(isUndefined(readonly) ? sc?.readOnly : readonly);
    Object.assign(componentProps, { readOnly: isReadOnly, disabled: !isEditable });
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
      editable: isEditable,
      readonly: isReadOnly,
      required: !!sc?.required,
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

  return (
    <FieldList name={name} initialValue={initialValue}>
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
                  cs('m-5 font-bold cursor-pointer', { [portalReadOnlyClassName]: state.value.length })
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
