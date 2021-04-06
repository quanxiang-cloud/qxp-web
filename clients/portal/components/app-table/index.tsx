import React, { useEffect } from 'react';
import classnames from 'classnames';
import { Loading } from '@QCFE/lego-ui';
import {
  useTable,
  Column as RColumn,
  useRowSelect,
  Hooks,
  TableOptions,
  TableToggleCommonProps,
  Row,
} from 'react-table';

import Icon from '@c/icon';
import Pagination from '@c/pagination';
import computeColumnsStickyPosition from './sticky-position';

import './index.scss';

export type Column = RColumn & { fixed?: boolean, width?: number };

interface Props<T extends Record<string, unknown>> {
  data: Array<T>;
  columns: Column[];
  emptyText?: string;
  className?: string;
  showCheckBox?: boolean;
  style?: React.CSSProperties;
  offset?: number;
  total?: number;
  limit?: number;
  loading?: boolean;
  onResetQuery?: () => void;
  onSelectChange?: (selected: Array<Column>) => void;
  onPageChange?: (pageParam: { offset: number; limit: number }) => void;
}

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }: TableToggleCommonProps, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef: any = ref || defaultRef;

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
  emptyText,
  onSelectChange,
  showCheckBox = false,
  onResetQuery,
  onPageChange,
}: Props<T>): JSX.Element {
  const tableParameter = [];
  if (showCheckBox) {
    tableParameter.push(useRowSelect, (hooks: Hooks) => {
      hooks.visibleColumns.push((columns: RColumn[]) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }: any) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }: any) => (
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
  }: any = useTable<any>(({ columns, data }) as TableOptions<T>, ...tableParameter);

  // const columnsFixedStyle = computeColumnsStickyPosition(columns);

  // const fixedStyle = (index: number): Pick<React.CSSProperties, 'left' | 'right'> => {
  //   if (columns[index].fixed) {
  //     return columnsFixedStyle[index];
  //   }
  //   return {};
  // };

  useEffect(() => {
    onSelectChange?.(selectedFlatRows);
  }, [selectedFlatRows]);

  return (
    <div className="table-wrapper">
      <div className={classnames('table', 'qxp-table', className)} style={style}>
        <table {...getTableProps()}>
          <colgroup>
            {flatHeaders.map((column: Column) => (
              <col
                key={column.id}
                style={column.width ? { width: `${column.width}px` } : {}}
              />
            ))}
          </colgroup>
          <thead>
            <tr>
              {flatHeaders.map((column: any) => {
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
            {rows.map((row: Row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  key={row.id}
                >
                  {row.cells.map((cell: any) => {
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
      {loading ? (
        <div className='table-loading-box'>
          <Loading />
        </div>) : null}
      {
        !loading && !rows.length ? (
          <div className="table-empty">
            <img src='/dist/images/links.svg' alt='noData' />
            <p className="table-empty__text">{emptyText || '无数据或符合条件的数据'}</p>
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

