import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import cs from 'classnames';

import { Column } from '.';

type DefaultTableBodyProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement
>
type Props<T> = DefaultTableBodyProps & {
  dataSource: T[];
  columns: Column<T>[];
  className?: string;
  cellClassName?: string;
}

export default function TableRows<T>({
  dataSource, columns, className, cellClassName,
}: Props<T>) {
  const rows = dataSource.map((row, index) => {
    return (
      <tr key={`row-${index}`} className="hover:bg-gray-100 transition">
        {columns.map((column, index) => {
          if (!column.dataIndex && !column.render) {
            return null;
          }
          const data = row[column.dataIndex as keyof T];
          return (
            <td
              key={String(column.title)}
              style={{
                border: '1px solid var(--gray-300)',
                borderLeft: 'none',
                borderRight: 'none',
              }}
              className={cs('px-24 py-16 align-middle text-body', cellClassName)}
            >
              {column.render ? column.render(data, row, index) : data}
            </td>
          );
        })}
      </tr>
    );
  });

  return (
    <tbody className={className}>
      {rows}
    </tbody>
  );
}
