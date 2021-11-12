import React, { useMemo, ChangeEvent } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { isString } from 'lodash';
import { flatten } from 'ramda';

import Icon from '@c/icon';
import useObservable from '@lib/hooks/use-observable';

import FieldTypeSelector from './field-type-selector';
import { Store, ObjectSchema, createStore, ItemStore } from './store';

type Row = ObjectSchema & {
  parent$?: ItemStore | Store | null;
  children$: ItemStore[];
  current$: ItemStore;
}

function getFullPath(parentPath: string | null, name: string | null): string {
  return `${parentPath || ''}.${name || ''}`;
}

export function fromObjectSchemaToApiData(objectSchema: ObjectSchema[]): POLY_API.PolyNodeInput[] {
  return objectSchema.map(({ type, name, required, desc, children }) => {
    const childrenData = fromObjectSchemaToApiData(children);
    return {
      type,
      name: name || '',
      desc,
      data: childrenData,
      in: 'body',
      required,
    };
  });
}

export function fromApiDataToObjectSchema(
  data: POLY_API.PolyNodeInput[], _parentPath: string | null = null,
): ObjectSchema[] {
  return data.map(({ type, name, desc, data: childrenData, required }, index: number) => {
    const parentPath = _parentPath ? getFullPath(_parentPath, name) : name;
    const children = fromApiDataToObjectSchema(childrenData, parentPath);
    return {
      type,
      name,
      desc,
      children,
      required,
      index: name ? null : index,
      parentPath: _parentPath,
    };
  });
}

const initialValues: ObjectSchema[] = [{
  type: 'object',
  name: 'a',
  index: null,
  parentPath: null,
  required: false,
  desc: 'a 是一个对象',
  children: [{
    type: 'number',
    name: 'b',
    index: null,
    parentPath: 'a',
    required: true,
    desc: 'a.b 是一个数字',
    children: [],
  }, {
    type: 'array',
    name: 'c',
    index: null,
    parentPath: 'a',
    required: true,
    desc: 'a.c 是一个数组',
    children: [{
      type: 'string',
      name: null,
      index: 0,
      parentPath: 'a.c',
      children: [],
      required: false,
      desc: 'a.c.0 是一个字符串',
    }],
  }],
}, {
  type: 'string',
  name: 'hello',
  index: null,
  parentPath: null,
  required: true,
  desc: 'hello 是一个字符串',
  children: [],
}];

function storeValuesToDataSource(storeValues$: ItemStore[]): Row[] {
  return flatten(storeValues$.map((current$) => {
    const { value, children$, parent$ } = current$;
    const { name, type, index, parentPath, required, desc, children } = value;
    const item = { type, name, index, required, desc, parentPath, children, children$, parent$, current$ };
    if (children.length) {
      return [item, storeValuesToDataSource(children$)];
    }
    return item;
  }));
}

function ObjectEditor(props: ISchemaFieldComponentProps): JSX.Element {
  props;
  // const componentProps = props.props?.['x-component-props'] as Props;
  const store$: Store = useMemo(() => createStore(initialValues), [initialValues]);
  const storeValues$ = useObservable(store$, []);
  const dataSource = useMemo(() => storeValuesToDataSource(storeValues$), [storeValues$]);

  function handleRowChange(keyType: keyof ObjectSchema, current$: ItemStore) {
    return (e: ChangeEvent<HTMLInputElement> | string) => {
      current$.set(keyType, isString(e) ? e : e.target.value);
      store$.update();
    };
  }

  const columns = [{
    title: '参数名称',
    dataIndex: 'name',
    render: ({ name, parentPath, current$, index }: Row) => {
      const path = getFullPath(parentPath, name);
      const level = path.split('.').length;
      return (
        <div className="flex content-center" style={{ marginLeft: (level - 1) * 15 }}>
          <Icon name="keyword_arrow_up" className="mr-5" />
          {name && (<input
            className="text-caption-no-color-weight text-gray-400"
            value={name}
            onChange={handleRowChange('name', current$)}
          />)}
          {!name && (`${index}`)}
        </div>
      );
    },
  }, {
    title: '参数类型',
    dataIndex: 'type',
    render: ({ type, current$ }: Row) => {
      return (
        <FieldTypeSelector type={type} onChange={handleRowChange('type', current$)} />
      );
    },
  }, {
    title: '是否必填',
    dataIndex: 'required',
    render: ({ required }: Row) => {
      return required ? '是' : '否';
    },
  }, {
    title: '描述',
    dataIndex: 'desc',
    render: ({ desc, current$ }: Row) => {
      return (
        <input
          className="text-caption-no-color-weight text-gray-400"
          value={desc}
          onChange={handleRowChange('desc', current$)}
        />
      );
    },
  }];

  const titles = columns.map(({ title }) => title);
  const dataIndexes = columns.map(({ dataIndex }) => dataIndex);

  return (
    <section className="container mx-auto p-6 font-mono">
      <div className="w-full mb-8 overflow-hidden shadow-lg rounded-8">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-md font-semibold tracking-wide text-left text-gray-900">
                {titles.map((title) => (<th key={title} className="px-6 py-8 border">{title}</th>))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {dataSource.map((row, index) => {
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
                          {columns.find((column) => column.dataIndex === dataIndex)?.render?.(row)}
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
