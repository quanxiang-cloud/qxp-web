import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { Column } from '.';

type DefaultTableHeaderProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement
>
type Props<T> = DefaultTableHeaderProps & {
  columns: Column<T>[];
  className?: string;
  cellClassName?: string;
}

export default function TableHeader<T>({ columns, className, cellClassName }: Props<T>) {
  const headers = columns.map((column) => {
    return (
      <th
        key={String(column.title)}
        style={{
          width: column.width ?? 'auto',
        }}
        className={
          twCascade('px-24 py-16 text-body-no-color text-gray-400 font-normal', cellClassName)
        }
      >
        {column.title}
      </th>
    );
  });

  return (
    <thead className={className}>
      <tr>{headers}</tr>
    </thead>
  );
}
