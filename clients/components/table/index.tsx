import React, { useEffect } from 'react';
import cs from 'classnames';
import {
  useTable,
  FixedColumn,
  UnionColumns,
  TableOptions,
} from 'react-table';

import TableLoading from './table-loading';
import { getDefaultSelectMap, useFixedStyle } from './utils';
import hooks from './hooks';
import './index.scss';

interface Props<T extends Record<string, any>> {
  className?: string;
  columns: UnionColumns<T>[];
  data: Array<T>;
  emptyTips?: React.ReactNode;
  initialSelectedRowKeys?: string[];
  loading?: boolean;
  onRowClick?: (rowID: string, selectedRow: T) => void;
  onSelectChange?: (selectedKeys: string[], selectedRows: T[]) => void;
  rowKey: string;
  showCheckbox?: boolean;
  style?: React.CSSProperties;
}

export default function Table<T extends Record<string, any>>({
  className,
  columns,
  data,
  emptyTips,
  initialSelectedRowKeys,
  loading,
  onRowClick,
  onSelectChange,
  rowKey,
  showCheckbox,
  style,
}: Props<T>): JSX.Element {
  const extendsColumns = [...columns];
  // todo refactor this
  const firstColumnFixed = columns.length > 0 && (columns[0] as FixedColumn<T>).fixed;
  if (showCheckbox) {
    extendsColumns.unshift({ width: 40, fixed: firstColumnFixed, id: '_selector' });
  }
  const hiddenColumns = showCheckbox ? [] : ['_selector'];
  const fixedStyle = useFixedStyle(extendsColumns);
  console.log(initialSelectedRowKeys, className, 555);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(({
    columns,
    data,
    getRowId: (row) => row[rowKey],
    initialState: {
      hiddenColumns,
      selectedRowIds: getDefaultSelectMap(initialSelectedRowKeys),
    },
  }) as TableOptions<T>, ...hooks);

  useEffect(() => {
    if (!onSelectChange) {
      return;
    }

    const selectedRows = selectedFlatRows.map(({ original }) => original);
    const selectedKeys = selectedRows.map((row) => row[rowKey] as string);
    onSelectChange(selectedKeys, selectedRows);
    // todo fix this
  }, [Object.keys(selectedRowIds).length]);

  const tableFooterRender = () => {
    if (loading) {
      return <TableLoading />;
    }

    if (rows.length === 0) {
      return (<div className="qxp-table-empty">{emptyTips}</div>);
    }
  };

  if (!headerGroups.length) {
    // todo render error tips
    return <TableLoading />;
  }

  return (
    <div className="qxp-table-wrapper">
      <div className={cs('qxp-table', className)} style={style}>
        <table {...getTableProps()}>
          <colgroup id="colgroup">
            {headerGroups[0].headers.map((header, index) => {
              const fixed = (extendsColumns[index] as FixedColumn<any>).fixed;
              return (
                <col
                  key={header.id}
                  style={fixed ? { width: `${header.width}px` } : {}}
                />
              );
            })}
          </colgroup>
          <thead>
            <tr>
              {headerGroups[0].headers.map((header, index) => {
                const hasFixed = (extendsColumns[index] as FixedColumn<any>).fixed;
                // todo explain this
                const zIndex = hasFixed ? extendsColumns.length - index + 1 : undefined;

                return (
                  <th
                    {...header.getHeaderProps()}
                    key={header.id}
                    className={cs({ 'table__header-fixed': hasFixed })}
                    style={{ ...fixedStyle(index), zIndex }}
                  >
                    {header.render('Header')}
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
                  onClick={() => onRowClick?.(row.id, row.original)}
                  key={row.id}
                  className='qxp-table-tr'
                >
                  {row.cells.map((cell, index) => {
                    const hasFixed = (extendsColumns[index] as FixedColumn<any>).fixed;
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className={cs({ 'table__cell-fixed': hasFixed })}
                        style={fixedStyle(index)}
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
        {tableFooterRender()}
      </div>
    </div>
  );
}
