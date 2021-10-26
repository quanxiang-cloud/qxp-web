import React, { useCallback, useContext } from 'react';
import { noop, get } from 'lodash';
import { without } from 'ramda';
import { UnionColumns } from 'react-table';

import Icon from '@c/icon';
import Table from '@c/table';
import Radio from '@c/radio';
import ToolTip from '@c/tooltip';
import Checkbox from '@c/checkbox';
import flowContext from '@flow/flow-context';
import useRequest from '@lib/hooks/use-request';
import type { PERMISSION_KEY } from '@c/form-builder/constants';
import { schemaToArray, schemaToMap } from '@lib/schema-convert';
import type { CustomFieldPermission, FieldValue } from '@flow/content/editor/type';
import { FORM_COMPONENT_VARIABLE_MAP } from '@flow/content/editor/utils/constants';

import FieldValueEditor from './field-value-editor';

interface Props {
  fields: CustomFieldPermission[];
  updateFields: (value: CustomFieldPermission[]) => void;
  editable: boolean;
  dataPermEditable: boolean;
  schema: ISchema;
}

export default function CustomFieldTable({
  editable,
  dataPermEditable,
  fields,
  updateFields: _updateFields,
  schema,
}: Props): JSX.Element {
  const { flowID: flowId } = useContext(flowContext);
  const schemaMap = schemaToMap(schema);
  const layoutFields = schemaToArray(schema, { parseSubTable: true, keepLayout: true })
    .reduce((layoutFields: string[], schema) => {
      const internal = schema['x-internal'];
      if (internal?.isLayoutComponent && internal.fieldId) {
        layoutFields.push(internal.fieldId);
      }
      return layoutFields;
    }, []);

  const [data] = useRequest<{
    code: number;
    data: ProcessVariable[];
    msg: string;
  }>(`/api/v1/flow/getVariableList?id=${flowId}`, {
    method: 'POST',
    credentials: 'same-origin',
  });

  const variableOptions = data?.data?.map(({ name, code, fieldType }) => ({
    label: name, value: code, type: fieldType,
  }));

  function updateFields(_fields: CustomFieldPermission[]): void {
    _updateFields([..._fields, ...fields.filter((field) => field.hidden)]);
  }

  function getHeader(model: any, key: PERMISSION_KEY, label: string): JSX.Element {
    let checkedNumber = 0;
    model.data.forEach((dt: CustomFieldPermission) => {
      if (dt[key]) {
        checkedNumber += 1;
      }
    });
    const indeterminate = checkedNumber < model.data.length && checkedNumber > 0;
    const isChecked = checkedNumber === model.data.length;
    return (
      <div className="flex items-center flex-nowrap">
        <Checkbox
          indeterminate={indeterminate}
          checked={isChecked}
          onChange={noop}
          onClick={() => {
            if (indeterminate || checkedNumber === 0) {
              return updateFields(model.data.map((dt: CustomFieldPermission) => {
                return {
                  ...dt,
                  [key]: true,
                  ...(key === 'write' ? { read: true } : {}),
                  ...(key === 'invisible' ? { read: true, editable: false, readonly: false } : {}),
                  ...(key === 'editable' ? { read: true, write: true, invisible: false, readonly: false } : {}),
                  ...(key === 'readonly' ? { read: true, invisible: false, editable: false } : {}),
                };
              }));
            }
            if (isChecked) {
              return updateFields(model.data.map((dt: CustomFieldPermission) => {
                return {
                  ...dt,
                  [key]: false,
                  ...(key === 'write' ? { editable: false } : {}),
                  ...(key === 'read' ? { write: false, invisible: false, editable: false, readonly: true } : {}),
                };
              }));
            }
          }}
        />
        <span className="ml-8 whitespace-nowrap">{label}</span>
      </div>
    );
  }

  function getValueHeader(label: string, tip: string): JSX.Element {
    return (
      <div className="flex items-center flex-nowrap">
        <span className="mr-4 whitespace-nowrap">{label}</span>
        <ToolTip
          inline
          labelClassName="whitespace-nowrap text-12 py-8 px-16"
          position="left"
          label={tip}
        >
          <Icon name="info" size={20} />
        </ToolTip>
      </div>
    );
  }

  function getCell(model: any, key?: PERMISSION_KEY): JSX.Element {
    const isChecked = model.cell.value;
    const fieldId = model.cell.row.id;
    const origPath = model.cell.row.original.path;
    const disabledComps = ['serial', 'aggregationrecords'];
    const handleClickCheckbox = useCallback(() => {
      updateFields(model.data.map((dt: CustomFieldPermission) => {
        if (dt.id === fieldId) {
          return {
            ...dt,
            [key as string]: !isChecked,
            ...(key === 'write' && !isChecked ? { read: true, editable: true, invisible: false, readonly: false } : {}),
            ...(key === 'write' && isChecked ? { editable: false } : {}),
            ...(key === 'read' && isChecked ? { write: false, invisible: true, editable: false, readonly: false } : {}),
            ...(key === 'read' && !isChecked ? { invisible: false } : {}),
            ...(key === 'invisible' && !isChecked ? { read: true, editable: false, readonly: false } : {}),
            ...(key === 'editable' && !isChecked ? { read: true, write: true, invisible: false, readonly: false } : {}),
            ...(key === 'readonly' && !isChecked ? { read: true, invisible: false, editable: false } : {}),
          };
        }
        return dt;
      }));
    }, []);
    const handleClickRadio = useCallback(() => {
      updateFields(model.data.map((dt: CustomFieldPermission) => {
        const paths = dt.path.split('.');
        const isSubTableChild = paths.length > 1 && schemaMap[paths[0]]?.componentName === 'subtable';

        if (dt.id === fieldId) {
          Object.assign(dt, { [key as string]: true });
          if (key === 'invisible') {
            Object.assign(dt, { read: true, editable: false, readonly: false });
          }
          if (key === 'editable') {
            Object.assign(dt, { read: true, write: true, invisible: false, readonly: false });
          }
          if (key === 'readonly') {
            Object.assign(dt, { read: true, invisible: false, editable: false });
          }
        }

        if (isSubTableChild) {
          // sub table child link with parent field permission
          const { invisible, readonly } = model.data.find(({ id }: { id: string }) => id === paths[0]) || {};
          if (invisible) {
            Object.assign(dt, { invisible: true, editable: false, readonly: false });
          }
          if (readonly && dt.editable) {
            Object.assign(dt, { editable: false, readonly: true, invisible: false });
          }
        }

        return dt;
      }));
    }, []);

    if (!key) {
      const path = without(layoutFields, model.cell.row.original.path?.split('.') || []);
      const level = path.length - 1 > 0 ? path.length - 1 : 0;
      return (
        <div
          style={{ marginLeft: isNaN(level) ? 0 : level * 20 }}
          className="whitespace-nowrap"
        >
          {model.cell.value}
        </div>
      );
    }

    if (['readonly', 'invisible', 'editable'].includes(key)) {
      let shouldDisable = false;
      const [id, subId] = origPath.split('.');
      const compName = schemaMap[id]?.componentName;
      if (!subId) {
        shouldDisable = disabledComps.includes(compName);
      } else if (compName === 'subtable') {
        const subCompName = get(schemaMap, `${id}.items.properties.${subId}.x-component`, '');
        shouldDisable = disabledComps.includes(String(subCompName).toLocaleLowerCase());
      }
      return (
        <Radio
          value={isChecked}
          defaultChecked={isChecked}
          onChange={handleClickRadio}
          onClick={noop}
          disabled={key === 'editable' && shouldDisable}
        />
      );
    }

    return (
      <Checkbox
        checked={isChecked}
        onChange={noop}
        onClick={handleClickCheckbox}
      />
    );
  }

  function variableOptionsFilterByType(schema: SchemaFieldItem) {
    return ({ type }: Partial<FlowVariableOption>): boolean => {
      const componentName = schema.componentName || '';
      const types = FORM_COMPONENT_VARIABLE_MAP[componentName as keyof typeof FORM_COMPONENT_VARIABLE_MAP];
      return type ? types?.includes(type) : false;
    };
  }

  function getValueCell(
    model: any, key: 'initialValue' | 'submitValue', editable: boolean,
  ): JSX.Element | null {
    const schema = schemaMap[model.cell.row.id];
    const componentName = schema?.componentName;
    const isSubTable = componentName === 'subtable';
    const isAssociatedRecords = componentName === 'associatedrecords';
    const isFileUpload = componentName === 'fileupload';

    if (editable && schema && !isSubTable && !isAssociatedRecords) {
      if (schema['x-mega-props']) {
        schema['x-mega-props'].labelAlign = 'top';
      }
      return (
        <FieldValueEditor
          valueVariable={!isFileUpload}
          variableOptions={variableOptions?.filter(variableOptionsFilterByType(schema))}
          defaultValue={model.cell.value}
          schema={{
            title: '',
            type: 'object',
            properties: {
              [model.cell.row.id]: schema,
            },
          }}
          onSave={(value: FieldValue) => {
            updateFields(model.data.map((dt: CustomFieldPermission) => {
              if (dt.id === model.cell.row.id) {
                return {
                  ...dt,
                  [key]: value,
                };
              }
              return dt;
            }));
          }}
        />
      );
    }
    return null;
  }

  return (
    <Table
      rowKey="id"
      columns={[
        {
          Header: <span className="whitespace-nowrap">字段</span>,
          id: 'fieldName',
          accessor: 'fieldName',
          Cell: (model: any) => getCell(model),
          fixed: true,
        },
        {
          Header: (model: any) => getHeader(model, 'readonly', '只读'),
          id: 'readonly',
          accessor: 'readonly',
          Cell: (model: any) => getCell(model, 'readonly'),
          width: 80,
        },
        {
          Header: (model: any) => getHeader(model, 'editable', '编辑'),
          id: 'editable',
          accessor: 'editable',
          Cell: (model: any) => getCell(model, 'editable'),
          width: 80,
        },
        {
          Header: (model: any) => getHeader(model, 'invisible', '隐藏'),
          id: 'invisible',
          accessor: 'invisible',
          Cell: (model: any) => getCell(model, 'invisible'),
          width: 80,
        },
        dataPermEditable ? {
          Header: (model: any) => getHeader(model, 'read', '读'),
          id: 'read',
          accessor: 'read',
          Cell: (model: any) => getCell(model, 'read'),
          width: 80,
        } : null,
        dataPermEditable ? {
          Header: (model: any) => getHeader(model, 'write', '写'),
          id: 'write',
          accessor: 'write',
          Cell: (model: any) => getCell(model, 'write'),
          width: 80,
        } : null,
        {
          Header: () => getValueHeader('初始值', '该节点初次打开工作表时对应字段呈现初始值'),
          id: 'initialValue',
          accessor: 'initialValue',
          Cell: (model: any) => getValueCell(model, 'initialValue', editable),
        },
        {
          Header: () => getValueHeader('提交值', '该节点提交工作表后对应字段呈现提交值'),
          id: 'submitValue',
          accessor: 'submitValue',
          Cell: (model: any) => model.cell.row.original.write &&
            getValueCell(model, 'submitValue', editable),
        }].filter(Boolean) as UnionColumns<CustomFieldPermission>[]
      }
      data={fields.filter((field) => !field.hidden)}
    />
  );
}
