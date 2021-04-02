import React, { useEffect } from 'react';
import classnames from 'classnames';
import { useTable, Column, useRowSelect } from 'react-table';

import Icon from '@c/icon';
import { Pagination } from '@c/pagination2';
import computeColumnsStickyPosition from './sticky-position';

import './index.scss';


interface Props<T extends Record<string, unknown>> {
  data: Array<T>;
  columns: Array<Omit<Column<T>, 'columns'> & {
    fixed?: boolean;
    width?: number;
  }>;
  className?: string;
  showCheckBox?: boolean;
  style?: React.CSSProperties;
  offset?: number;
  total?: number;
  limit?: number;
  loading?: boolean;
  hasFilterParams?: boolean;
  onResetQuery?: () => void;
  onSelectChange?: (selected: Array<Column>) => void;
  onPageChange?: (pageParam: { offset: number; limit: number }) => void;
}

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);


export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  className,
  style = {},
  offset,
  total,
  limit,
  loading,
  hasFilterParams,
  onSelectChange,
  showCheckBox = false,
  onResetQuery,
  onPageChange,
}: Props<T>): JSX.Element {
  const tableParameter = [{ columns, data }];
  if (showCheckBox) {
    tableParameter.push(useRowSelect, (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    });
  }

  const {
    getTableProps,
    getTableBodyProps,
    flatHeaders,
    prepareRow,
    rows,
    selectedFlatRows,
    // state: { selectedRowIds },
  } = useTable<T>(...tableParameter);

  const columnsFixedStyle = computeColumnsStickyPosition(columns);

  const fixedStyle = (index: number): Pick<React.CSSProperties, 'left' | 'right'> => {
    if (columns[index].fixed) {
      return columnsFixedStyle[index];
    }
    return {};
  };

  useEffect(() => {
    onSelectChange?.(selectedFlatRows);
  }, [selectedFlatRows]);

  return (
    <div className="table-wrapper">
      <div className={classnames('table', 'qxp-table', className)} style={style}>
        <table {...getTableProps()}>
          <colgroup>
            {flatHeaders.map((column) => (
              <col
                key={column.id}
                style={column.width ? { width: `${column.width}px` } : {}}
              />
            ))}
          </colgroup>
          <thead>
            <tr>
              {flatHeaders.map((column, index) => {
                return (
                  <th
                    {...column.getHeaderProps()}
                    key={column.id}
                    className={classnames('qxp-table-th',
                      { 'table__header-fixed': column.fixed }
                    )}
                    style={{
                      // ...fixedStyle(index),
                      maxWidth: column.maxWidth ? `${column.maxWidth}px` : 'none',
                    }}
                  >
                    {column.render('Header')}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  key={row.id}
                >
                  {row.cells.map((cell, index) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className={classnames('qxp-table-td',
                          { 'table__cell-fixed': cell.fixed })}
                        style={{
                          // ...fixedStyle(index),
                          maxWidth: cell.maxWidth ?
                            `${cell.maxWidth}px` : 'none',
                        }}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {
        !loading && !rows.length ? (
          <div className="table-empty">
            <Icon name="exclamation" size={32} />
            <p className="table-empty__text">无数据或符合条件的数据</p>
            {
              hasFilterParams ? (
                <p
                  className="table-empty__reset"
                  onClick={(): void => onResetQuery && onResetQuery()}
                >重置筛选条件</p>
              ) : null
            }
          </div>
        ) : null
      }
      {/* <Pagination
        offset={offset}
        total={total}
        limit={limit}
        onChange={onPageChange}
      /> */}
    </div>
  );
}
