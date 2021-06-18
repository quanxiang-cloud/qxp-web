import React from 'react';

import Table from '@c/table';
import Checkbox from '@c/checkbox';
import type { SystemFieldPermission } from '@flowEditor/type';

interface Props {
  fields: SystemFieldPermission[];
  updateFields: (value: SystemFieldPermission[]) => void;
}

export default function({ fields, updateFields }: Props): JSX.Element {
  function getHeader(model: any, key: 'read', label: string): JSX.Element {
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
          onClick={() => {
            if (indeterminate || checkedNumber === 0) {
              return updateFields(model.data.map((dt: SystemFieldPermission) => {
                return {
                  ...dt,
                  [key]: true,
                };
              }));
            }
            if (isChecked) {
              return updateFields(model.data.map((dt: SystemFieldPermission) => {
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

  function getCell(model: any, key?: 'read'): JSX.Element {
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
          updateFields(model.data.map((dt: SystemFieldPermission) => {
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
      }]}
      data={fields}
    />
  );
}
