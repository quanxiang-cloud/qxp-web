import React, { useMemo } from 'react';
import { flattenDeep } from 'lodash';

import useObservable from '@lib/hooks/use-observable';

import { Store, createStore, ItemStore } from './store';

export type Row<T extends { children: T[] }> = T & {
  parent$?: ItemStore<T> | Store<T> | null;
  children$: ItemStore<T>[];
  current$: ItemStore<T>;
}

function storeValuesToDataSource<T extends { children: T[] }>(storeValues$: ItemStore<T>[]): Row<T>[] {
  return flattenDeep(storeValues$.map((current$) => {
    const { value, children$, parent$ } = current$;
    const { children } = value;
    const item = { ...value, children$, parent$, current$ };
    if (children.length) {
      return [item, storeValuesToDataSource(children$)];
    }
    return item;
  }));
}

interface Column<T extends { children: T[] }> {
  title: string;
  dataIndex: string;
  render: (row: Row<T>, store$: Store<T>) => JSX.Element;
}

interface Props<T extends { children: T[] }> {
  columns: Column<T>[];
  initialValues: T[];
}

function ObjectEditor<T extends { children: T[] }>(
  { columns, initialValues }: Props<T>,
): JSX.Element | null {
  const store$: Store<T> = useMemo(() => createStore(initialValues || []), [initialValues]);
  const storeValues$ = useObservable(store$, []);
  const dataSource = useMemo(() => storeValuesToDataSource(storeValues$), [storeValues$]);

  const titles = columns.map(({ title }) => title);
  const dataIndexes = columns.map(({ dataIndex }) => dataIndex);

  return (
    <section className="container mx-auto p-6 font-mono">
      <div className="w-full mb-8 shadow-lg rounded-8">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-md font-semibold tracking-wide text-left text-gray-900">
                {titles.map((title) => (<th key={title} className="px-6 py-8 border">{title}</th>))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {dataSource.filter((data) => !data.current$.isHidden).map((row, index) => {
                return (
                  <tr
                    className="text-gray-700"
                    key={index}
                  >
                    {dataIndexes.map((dataIndex) => {
                      return (
                        <td
                          key={dataIndex}
                          className="px-6 py-8 border">
                          {columns.find((column) => column.dataIndex === dataIndex)?.render?.(row, store$)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

ObjectEditor.isFieldComponent = true;

export default ObjectEditor;
