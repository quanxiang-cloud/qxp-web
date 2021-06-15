import React, {
  forwardRef,
  DetailedHTMLProps,
  TableHTMLAttributes,
  Ref,
} from 'react';
import { omit } from 'lodash';

import Icon from '@c/icon';

import TableHeader from './header';
import TableRows from './rows';

type DefaultTableProps = DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>
type Props<T> = DefaultTableProps & {
  dataSource?: T[];
  columns: Column<T>[];
  headerClassName?: string;
  headerCellClassName?: string;
  bodyClassName?: string;
  bodyCellClassName?: string;
  loading?: boolean;
  emptyPlaceholder?: string;
}

export type Column<T> = {
  title?: string | JSX.Element;
  dataIndex?: keyof T;
  render?: (data: T[keyof T], row: T, index: number) => JSX.Element;
  width?: number;
}

function Table<T>(
  props: Props<T>,
  ref?: Ref<HTMLTableElement>,
) {
  const {
    columns,
    dataSource,
    headerClassName,
    headerCellClassName,
    bodyClassName,
    bodyCellClassName,
    loading,
    emptyPlaceholder = '暂无数据',
  } = props;

  // const {} = useTable<T>({ columns, data: dataSource });

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Icon
          name='loading'
          size={36}
          className="animate-spin"
        />
      </div>
    );
  }

  return (
    <>
      <table
        {...omit(props,
          [
            'dataSource', 'columns', 'style', 'headerClassName', 'bodyClassName',
            'bodyCellClassName', 'headerCellClassName', 'loading',
          ],
        )}
        ref={ref}
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          ...(props.style || {}),
        }}
      >
        <TableHeader
          columns={columns}
          className={headerClassName}
          cellClassName={headerCellClassName}
        />
        {
          dataSource && !!dataSource.length && (
            <TableRows
              dataSource={dataSource}
              columns={columns}
              className={bodyClassName}
              cellClassName={bodyCellClassName}
            />
          )
        }
      </table>
      {
        (!dataSource || !dataSource.length) && (
          <div className="flex-1 flex items-center justify-center">{emptyPlaceholder}</div>
        )
      }
    </>
  );
}

export default forwardRef(Table) as <T>(
  props: Props<T>,
  ref?: React.Ref<HTMLTableElement> | undefined
) => JSX.Element;
