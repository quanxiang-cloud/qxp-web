import React from 'react';
import Table, { Props } from '@c/table';
import { uuid } from '@lib/utils';

interface OptionType {
  label: string;
  key: string;
}

interface OptionalTableProps<T extends Record<string, any>> extends Props<T> {
  options: OptionType[];
  optionHeader: string;
  onOptionClick?: (key: string, data: T) => void;
}

export default function OptionalTable<T extends Record<string, any>>({
  columns,
  options = [],
  optionHeader = '',
  onOptionClick,
  ...restProps
}: OptionalTableProps<T>): JSX.Element {
  const _columns = options.length ? [
    ...columns,
    {
      Header: optionHeader,
      id: `option${uuid()}`,
      accessor: (data: T) =>
        options.map((opt) => (
          <span
            className='mr-4 text-blue-500 cursor-pointer'
            onClick={() => onOptionClick?.(opt.key, data)}
            key={opt.key}>
            {opt.label}
          </span>
        )),
    },
  ] : columns;

  return <Table columns={_columns} {...restProps} />;
}
