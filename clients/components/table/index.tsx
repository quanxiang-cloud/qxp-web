import React, { useEffect, MouseEvent } from 'react';
import cs from 'classnames';
import {
  useTable,
  UnionColumns,
  TableOptions,
  useRowSelect,
} from 'react-table';

import { getHTMLParentElement } from '@lib/utils';

import TableLoading from './table-loading';
import { getDefaultSelectMap, useExtendColumns } from './utils';
import './index.scss';
import useSticky from './use-sticky';

interface Props<T extends Record<string, any>> {
  className?: string;
  columns: UnionColumns<T>[];
  data: Array<T>;
  emptyTips?: React.ReactNode;
  initialSelectedRowKeys?: string[];
  loading?: boolean;
  onRowClick?: (rowID: string, selectedRow: T) => void;
  onRowDoubleClick?: (rowID: string, selectedRow: T) => void;
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
  onRowDoubleClick,
  onSelectChange,
  rowKey,
  showCheckbox,
  style,
}: Props<T>): JSX.Element {
  const extendsColumns = useExtendColumns(columns, showCheckbox);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(({
    data,
    columns: extendsColumns,
    getRowId: (row) => row[rowKey],
    initialState: { selectedRowIds: getDefaultSelectMap(initialSelectedRowKeys) },
  }) as TableOptions<T>, useRowSelect, useSticky);

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

  let clickCount = 0;
  const onClick = (e: MouseEvent<HTMLTableRowElement>) => {
    clickCount += 1;
    setTimeout(() => {
      const rowEl = getHTMLParentElement('tr', e.target as HTMLTableRowElement);
      if (!rowEl) {
        return;
      }
      let row;
      try {
        row = JSON.parse(rowEl.dataset.row as string);
      } catch {
        return;
      }
      if (clickCount == 1) {
        onRowClick?.(row.id, row.selectedRow);
      } else if (clickCount > 1) {
        onRowDoubleClick?.(row.id, row.selectedRow);
      }
      clickCount = 0;
    }, 300);
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
            {headerGroups[0].headers.map((header) => {
              return (
                <col
                  { ...header.getHeaderProps() }
                  key={header.id}
                />
              );
            })}
          </colgroup>
          <thead>
            <tr>
              {headerGroups[0].headers.map((header) => {
                return (
                  <th
                    {...header.getHeaderProps()}
                    key={header.id}
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
                  onClick={onClick}
                  key={row.id}
                  className='qxp-table-tr'
                  data-row={JSON.stringify({
                    id: row?.id ?? '',
                    selectedRow: row?.original ?? {},
                  })}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
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
