import React, { useEffect } from 'react';
import classnames from 'classnames';
import { get } from 'lodash';
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

import Pagination from '../pagination';

import './index.scss';

export type Column = RColumn & { fixed?: boolean, width?: number };

interface Props<T extends Record<string, unknown>> {
  data: Array<T>;
  columns: Column[];
  emptyText?: string;
  className?: string;
  selectKey: string;
  showCheckBox?: boolean;
  currentPage?: number;
  style?: React.CSSProperties;
  pageSize?: number;
  total?: number;
  loading?: boolean;
  onSelectChange?: (selected: Array<T>) => void;
  onPageChange?: (currentPage: number) => void;
  onShowSizeChange?: (pageSize: number) => void;
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
  pageSize = 20,
  total = 0,
  currentPage = 1,
  loading,
  emptyText,
  onSelectChange,
  selectKey,
  showCheckBox = false,
  onPageChange,
  onShowSizeChange,
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
    onSelectChange?.(selectedFlatRows.map(({ original }: Row) => selectKey ? get(original, selectKey) : original));
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
      {total > pageSize && (
        <Pagination
          pageSize={pageSize}
          current={currentPage}
          total={total}
          onShowSizeChange={onShowSizeChange}
          onChange={onPageChange}
        />
      )}
    </div>
  );
}

