import React from 'react';
import { noop } from 'lodash';

import Table from '@c/table';
import Checkbox from '@c/checkbox';
import type { SystemFieldPermission } from '@flow/content/editor/type';

interface Props {
  fields: SystemFieldPermission[];
  updateFields: (value: SystemFieldPermission[]) => void;
}

export default function({ fields, updateFields }: Props): JSX.Element {
  function getHeader(model: any, key: 'read' | 'invisible', label: string): JSX.Element {
    let checkedNumber = 0;
    model.data.forEach((dt: SystemFieldPermission) => {
      if (dt[key]) {
        checkedNumber += 1;
      }
    });
    const indeterminate = (checkedNumber < model.data.length) && (checkedNumber > 0);
    const isChecked = checkedNumber === model.data.length;
    return (
      <div className="flex items-center">
        <Checkbox
          indeterminate={indeterminate}
          checked={isChecked}
          onChange={noop}
          onClick={() => {
            if (indeterminate || checkedNumber === 0) {
              return updateFields(model.data.map((dt: SystemFieldPermission) => {
                return {
                  ...dt,
                  [key]: true,
                  ...(key === 'invisible' ? { read: true } : {}),
                };
              }));
            }
            if (isChecked) {
              return updateFields(model.data.map((dt: SystemFieldPermission) => {
                return {
                  ...dt,
                  [key]: false,
                  ...(key === 'read' ? { invisible: false } : {}),
                };
              }));
            }
          }}
        />
        <span className="ml-8">{label}</span>
      </div>
    );
  }

  function getCell(model: any, key?: 'read' | 'invisible'): JSX.Element {
    const isChecked = model.cell.value;
    const level = model.cell.row.original.path?.split('.').length - 1;
    if (!key) {
      return <div style={{ marginLeft: isNaN(level) ? 0 : level * 20 }}>{model.cell.value}</div>;
    }
    return (
      <Checkbox
        checked={isChecked}
        onChange={noop}
        onClick={() => {
          updateFields(model.data.map((dt: SystemFieldPermission) => {
            if (dt.id === model.cell.row.id) {
              return {
                ...dt,
                [key]: !isChecked,
                ...(key === 'read' && isChecked ? { invisible: false } : {}),
                ...(key === 'invisible' && !isChecked ? { read: true } : {}),
              };
            }
            return dt;
          }));
        }}
      />
    );
  }

  return (
    <Table
      rowKey="id"
      columns={[{
        accessor: 'fieldName',
        Header: '字段',
      }, {
        Header: (model: any) => getHeader(model, 'read', '查看'),
        accessor: 'read',
        Cell: (model: any) => getCell(model, 'read'),
      }, {
        Header: (model: any) => getHeader(model, 'invisible', '隐藏'),
        accessor: 'invisible',
        Cell: (model: any) => getCell(model, 'invisible'),
      }]}
      data={fields}
    />
  );
}
