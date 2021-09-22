import React, { useEffect, useState, useRef } from 'react';
import cs from 'classnames';
import {
  useTable,
  UnionColumns,
  TableOptions,
  useRowSelect,
} from 'react-table';

import TableLoading from './table-loading';
import { getDefaultSelectMap, useExtendColumns, DEFAULT_WIDTH, MINIMUM_WIDTH } from './utils';
import useSticky from './use-sticky';
import AdjustHandle from './adjust-handle';

import './index.scss';

type WidthMap = Record<any, number | string>;

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
  const _columns = useExtendColumns(columns, showCheckbox);
  const tableRef = useRef<HTMLTableElement>(null);
  const widthMapRef = useRef<WidthMap>({});
  const [widthMap, setWidthMap] = useState<WidthMap>({});
  widthMapRef.current = widthMap;

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
    columns: _columns,
    getRowId: (row) => row[rowKey],
    initialState: { selectedRowIds: getDefaultSelectMap(initialSelectedRowKeys) },
  }) as TableOptions<T>, useRowSelect, useSticky);

  const handleWidthChange = (x: number, columnID: string): void => {
    if (x < MINIMUM_WIDTH) {
      return;
    }

    setWidthMap({
      ...widthMapRef.current,
      [columnID]: x,
    });
  };

  useEffect(() => {
    const _widthMap: WidthMap = {};
    _columns.forEach((col) => {
      _widthMap[col.id] = col.width || DEFAULT_WIDTH;
    });

    setWidthMap(_widthMap);
  }, [_columns]);

  useEffect(() => {
    if (!onSelectChange) {
      return;
    }

    const selectedRows = selectedFlatRows.map(({ original }) => original);
    const selectedKeys = selectedRows.map((row) => row[rowKey] as string);
    onSelectChange(selectedKeys, selectedRows);
    // todo fix this
  }, [Object.keys(selectedRowIds).length]);

  const tableFooterRender = (): JSX.Element | undefined => {
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
        <table ref={tableRef} {...getTableProps()}>
          <colgroup id="colgroup">
            {headerGroups[0].headers.map((header) => {
              return (
                <col
                  {...header.getHeaderProps()}
                  id={`th-${header.id}`}
                  width={widthMap[header.id]}
                  key={header.id}
                />
              );
            })}
          </colgroup>
          <thead>
            <tr>
              {headerGroups[0].headers.map((header, index) => {
                return (
                  <th
                    {...header.getHeaderProps()}
                    key={header.id}
                  >
                    {header.render('Header')}
                    {header.id !== '_selector' && index !== _columns.length - 1 && (
                      <AdjustHandle
                        thID={`th-${header.id}`}
                        onChange={(x) => handleWidthChange(x, header.id)}
                      />
                    )}
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
