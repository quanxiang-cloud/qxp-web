import React, { useContext } from 'react';
import { noop } from 'lodash';

import Table from '@c/table';
import Checkbox from '@c/checkbox';
import ToolTip from '@c/tooltip';
import Icon from '@c/icon';
import useRequest from '@lib/hooks/use-request';
import type { CustomFieldPermission, FieldValue } from '@flowEditor/type';
import flowContext from '@portal/modules/apps-management/work-flow/detail/flow-context';

import FieldValueEditor from './field-value-editor';

interface Props {
  fields: CustomFieldPermission[];
  updateFields: (value: CustomFieldPermission[]) => void;
  editable: boolean;
  schemaMap: Record<string, ISchema>;
}

export default function CustomFieldTable({
  editable, fields, updateFields, schemaMap,
}: Props): JSX.Element {
  const { flowID: flowId } = useContext(flowContext);
  const [data] = useRequest<{
    code: number;
    data: {name: string; code: string; desc: string;}[];
    msg: string;
  }>(`/api/v1/flow/getVariableList?id=${flowId}`, {
    method: 'POST',
    credentials: 'same-origin',
  });

  const variableOptions = data?.data?.map(({ name, code }) => ({ label: name, value: code }));

  function getHeader(model: any, key: 'read' | 'write', label: string): JSX.Element {
    let checkedNumber = 0;
    model.data.forEach((dt: CustomFieldPermission) => {
      if (dt[key]) {
        checkedNumber += 1;
      }
    });
    const indeterminate = checkedNumber < model.data.length && checkedNumber > 0;
    const isChecked = checkedNumber === model.data.length;
    return (
      <div className="flex items-center">
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
                };
              }));
            }
            if (isChecked) {
              return updateFields(model.data.map((dt: CustomFieldPermission) => {
                return {
                  ...dt,
                  [key]: false,
                  ...(key === 'read' ? { write: false } : {}),
                };
              }));
            }
          }}
        />
        <span className="ml-8">{label}</span>
      </div>
    );
  }

  function getValueHeader(label: string, tip: string): JSX.Element {
    return (
      <div className="flex items-center">
        <span className="mr-4">{label}</span>
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

  function getCell(model: any, key?: 'read' | 'write'): JSX.Element {
    const isChecked = model.cell.value;
    if (!key) {
      return (
        <div
          className={`${model.cell.row.original.parent ? 'ml-20' : ''}`}
        >
          {model.cell.value}
        </div>
      );
    }
    return (
      <Checkbox
        checked={isChecked}
        onChange={noop}
        onClick={() => {
          updateFields(model.data.map((dt: CustomFieldPermission) => {
            if (dt.id === model.cell.row.id) {
              return {
                ...dt,
                [key]: !isChecked,
                ...(key === 'write' && !isChecked ? { read: true } : {}),
                ...(key === 'read' && isChecked ? { write: false } : {}),
              };
            }
            return dt;
          }));
        }}
      />
    );
  }

  function getValueCell(
    model: any, key: 'initialValue' | 'submitValue', editable: boolean,
  ): JSX.Element | null {
    const schema = schemaMap[model.cell.row.id];
    const componentName = schema?.['x-component']?.toLowerCase();
    const isSubTable = componentName === 'subtable';
    const isAssociatedRecords = componentName === 'associatedrecords';
    if (editable && schema && !isSubTable && !isAssociatedRecords) {
      if (schema['x-mega-props']) {
        schema['x-mega-props'].labelAlign = 'top';
      }
      return (
        <FieldValueEditor
          variableOptions={variableOptions}
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
      columns={[{
        Header: '字段',
        accessor: 'fieldName',
        Cell: (model: any) => getCell(model),
        fixed: true,
      }, {
        Header: (model: any) => getHeader(model, 'read', '查看'),
        accessor: 'read',
        Cell: (model: any) => getCell(model, 'read'),
      }, {
        Header: (model: any) => getHeader(model, 'write', '编辑'),
        accessor: 'write',
        Cell: (model: any) => getCell(model, 'write'),
      }, {
        Header: () => getValueHeader('初始值', '该节点初次打开工作表时对应字段呈现初始值'),
        accessor: 'initialValue',
        Cell: (model: any) => getValueCell(model, 'initialValue', editable),
      }, {
        Header: () => getValueHeader('提交值', '该节点提交工作表后对应字段呈现提交值'),
        accessor: 'submitValue',
        Cell: (model: any) => !model.cell.row.original.write &&
              getValueCell(model, 'submitValue', editable),
      }]}
      data={fields}
    />
  );
}
