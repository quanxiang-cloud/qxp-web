import React, { useEffect } from 'react';
import classnames from 'classnames';
import { get } from 'lodash';
import {
  useTable,
  Column as RColumn,
  useRowSelect,
  Hooks,
  TableOptions,
  TableToggleCommonProps,
  UseTableColumnProps,
  Row,
} from 'react-table';

import Pagination from '../pagination';

import TableLoading from './table-loading';
import './index.scss';

interface ColumnS extends UseTableColumnProps<any> {
  fixed?: boolean, width?: number
}
export type Column = RColumn<any> & { fixed?: boolean, width?: number };

interface Props<T extends Record<string, unknown>> {
  data: Array<T>;
  columns: Column[];
  rowKey?: string;
  selectedRowKeys?: string[];
  emptyText?: string;
  className?: string;
  selectKey?: string;
  showCheckBox?: boolean;
  currentPage?: number;
  style?: React.CSSProperties;
  pageSize?: number;
  total?: number;
  loading?: boolean;
  onSelectChange?: (selected: Array<T>) => void;
  onPageChange?: (currentPage: number, pageSize: number) => void;
}

const FIXED_ROW: React.CSSProperties = { position: 'sticky', left: '0px', zIndex: 1 };

const getDefaultSelectMap = (keys: string[]|undefined) => {
  if (!keys) {
    return {};
  }

  const keyMap: any = {};
  keys.forEach((key) => {
    keyMap[key] = true;
  });
  return keyMap;
};

const IndeterminateCheckbox = React.forwardRef(
  ({
    indeterminate,
    ...rest }: TableToggleCommonProps, ref) => {
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
  selectedRowKeys,
  className,
  style = {},
  pageSize = 20,
  total = 0,
  currentPage = 1,
  loading,
  emptyText,
  onSelectChange,
  selectKey,
  rowKey = 'id',
  showCheckBox = false,
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
              <IndeterminateCheckbox
                {...getToggleAllRowsSelectedProps()}
              />
            </div>
          ),
          Cell: ({ row }: any) => (
            <div>
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps()}
              />
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
    state: { selectedRowIds },
  }: any = useTable<any>(({
    columns,
    data,
    getRowId: (row, _, parent: any) => {
      return parent ? [parent[rowKey], row[rowKey]].join('.') : row[rowKey];
    },
    initialState: { selectedRowIds: getDefaultSelectMap(selectedRowKeys) },
  }) as TableOptions<T>, ...tableParameter);

  useEffect(() => {
    onSelectChange?.(selectedFlatRows.map(({ original }: Row) => {
      return selectKey ? get(original, selectKey) : original;
    }));
  }, [selectedRowIds]);

  const tableFooterRender = () => {
    if (loading) {
      return <TableLoading />;
    }

    if (rows.length === 0) {
      return (
        <div className="qxp-table-empty">
          <img src='/dist/images/message_details_empty_tips.svg' alt='noData' />
          <p>{emptyText || '无数据或符合条件的数据'}</p>
        </div>
      );
    }

    return (
      <div className='px-16 flex justify-between items-center h-56'>
        <div className='qxp-table-total-tips' >共{total}条数据</div>
        {total > pageSize && (
          <Pagination
            className='inline-flex'
            pageSize={pageSize}
            pageNumber={currentPage}
            total={total}
            onChange={onPageChange}
          />
        )}
      </div>
    );
  };

  return (
    <div className="qxp-table-wrapper">
      <div className={classnames('qxp-table-content', className)} style={style}>
        <table className='qxp-table' {...getTableProps()}>
          <colgroup>
            {flatHeaders.map((column: Column) => (
              <col
                key={column.id}
                width={column.width ? column.width : ''}
              />
            ))}
          </colgroup>
          <thead>
            <tr>
              {flatHeaders.map((column: ColumnS) => {
                return (
                  <th
                    {...column.getHeaderProps()}
                    key={column.id}
                    style={column.fixed ? FIXED_ROW : {}}
                    className='qxp-table-th'
                  >
                    {column.render('Header')}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody style={{ display: loading ? 'none' : '' }} {...getTableBodyProps()}>
            {rows.map((row: Row) => {
              prepareRow(row);
              return (
                <tr
                  className='qxp-table-tr'
                  {...row.getRowProps()}
                  key={row.id}
                >
                  {row.cells.map((cell: any) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className='qxp-table-td'
                        style={cell.column.fixed ? FIXED_ROW : {}}
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
      {tableFooterRender()}
    </div>
  );
}

