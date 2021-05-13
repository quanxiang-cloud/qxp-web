import React from 'react';
import cs from 'classnames';

import Table from '@c/table';
import Checkbox from '@c/checkbox';
import ToolTip from '@c/tooltip';
import Icon from '@c/icon';
import useRequest from '@lib/hooks/use-request';

import { CustomFieldPermission } from '../../../store';
import FieldValueEditor from './field-value-editor';

interface Props {
  fields: CustomFieldPermission[];
  updateFields: (value: CustomFieldPermission[]) => void;
  editable: boolean;
}

export default function CustomFieldTable({ editable, fields, updateFields }: Props) {
  const [data] = useRequest<{
    code: number;
    data: {name: string; code: string; desc: string;}[];
    msg: string;
  }>('/api/v1/flow/getVariableList', {
    method: 'POST',
    credentials: 'same-origin',
  });
  const variableOptions = data?.data?.map(({ name, code }) => ({ label: name, value: code }));

  function getHeader(model: any, key: 'read' | 'write', label: string) {
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
          onClick={() => {
            if (indeterminate || checkedNumber === 0) {
              return updateFields(model.data.map((dt: CustomFieldPermission) => {
                return {
                  ...dt,
                  [key]: true,
                };
              }));
            }
            if (isChecked) {
              return updateFields(model.data.map((dt: CustomFieldPermission) => {
                return {
                  ...dt,
                  [key]: false,
                };
              }));
            }
          }}
        />
        <span className="ml-8">{label}</span>
      </div>
    );
  }

  function getValueHeader(label: string, tip: string) {
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

  function getCell(model: any, key?: 'read' | 'write') {
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
        onClick={() => {
          updateFields(model.data.map((dt: CustomFieldPermission) => {
            if (dt.id === model.cell.row.id) {
              return {
                ...dt,
                [key]: !isChecked,
              };
            }
            return dt;
          }));
        }}
      />
    );
  }

  function getValueCell(model: any, key: 'initialValue' | 'submitValue', editable: boolean) {
    if (editable) {
      return (
        <FieldValueEditor
          variableOptions={variableOptions}
          defaultValue={model.cell.value}
          onSave={(value: { static: string; variable: string; }) => {
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
    <>
      {editable && (
        <Table
          rowKey="id"
          className={cs({ 'mb-200': editable })}
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
            Cell: (model: any) => getValueCell(model, 'submitValue', editable),
          }]}
          data={fields}
        />
      )}
      {!editable && (
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
            Cell: (model: any) => getValueCell(model, 'submitValue', editable),
          }]}
          data={fields}
        />
      )}
    </>
  );
}
