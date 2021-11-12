import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Icon from '@c/icon';

import FieldTypeSelector from './field-type-selector';

interface Props {
  nested?: string;
}

interface Row {
  name: string;
  type: string;
  level: number;
  path: string;
  required: boolean;
  desc: string;
}

function ObjectEditor(props: ISchemaFieldComponentProps): JSX.Element {
  const componentProps = props.props?.['x-component-props'] as Props;
  componentProps;
  const dataSource: Row[] = [{
    name: 'a',
    type: 'array',
    level: 1,
    path: 'a',
    required: true,
    desc: '人的信息元组',
  }, {
    name: '0',
    type: 'string',
    level: 2,
    path: 'a.0',
    required: true,
    desc: '姓名',
  }, {
    name: '1',
    type: 'number',
    level: 2,
    path: 'a.1',
    required: false,
    desc: '年龄',
  }, {
    name: '新建参数',
    type: 'create',
    level: 1,
    path: '',
    required: false,
    desc: '',
  }];

  function handleAddRow(): void {
    dataSource.push({ name: '', type: 'string', level: 1, path: '', required: false, desc: '' });
  }

  const columns = [{
    title: '参数名称',
    dataIndex: 'name',
    render: ({ type, name, level = 1 }: any) => {
      if (type === 'create') {
        return (
          <span
            className="cursor-pointer text-gray-400 text-caption-no-color-weight"
            onClick={handleAddRow}
          >
            {name}
          </span>
        );
      }
      return (
        <div className="flex content-center" style={{ marginLeft: (level - 1) * 28 }}>
          <Icon name="keyword_arrow_up" className="mr-5" />
          <span className="text-caption-no-color-weight text-gray-400">{name}</span>
        </div>
      );
    },
  }, {
    title: '参数类型',
    dataIndex: 'type',
    render: ({ type }: any) => (<FieldTypeSelector type={type} />),
  }, {
    title: '是否必填',
    dataIndex: 'required',
    render: ({ required }: any) => (required ? '是' : '否'),
  }, {
    title: '描述',
    dataIndex: 'desc',
    render: ({ desc }: any) => (desc),
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
              {dataSource.map((row) => {
                const rowKeys = Object.keys(row).filter((k) => dataIndexes.includes(k));
                return (
                  <tr className="text-gray-700" key={JSON.stringify(row)}>
                    {rowKeys.map((key) => (
                      <td
                        key={key}
                        className="px-6 py-8 border">
                        {columns.find((column) => column.dataIndex === key)?.render?.(row)}
                      </td>
                    ))}
                  </tr>
                );
              },
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

ObjectEditor.isFieldComponent = true;

export default ObjectEditor;
