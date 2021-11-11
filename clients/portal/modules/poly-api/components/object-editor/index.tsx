import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Icon from '@c/icon';

import FieldTypeSelector from './field-type-selector';

interface Props {
  nested?: string;
}

function ObjectEditor(props: ISchemaFieldComponentProps): JSX.Element {
  const componentProps = props.props?.['x-component-props'] as Props;
  const ths = ['参数名称', '参数类型', '是否必填', '描述'];

  const tds = [{
    id: 1,
    render: ({ name, level }: any) => (
      <div className="flex content-center" style={{ marginLeft: (level - 1) * 28 }}>
        <Icon name="keyword_arrow_up" className="mr-5" />
        <span className="text-caption-no-color-weight text-gray-400">{name}</span>
      </div>
    ),
  }, {
    id: 2,
    render: ({ type }: any) => (<FieldTypeSelector type={type} />),
  }];

  return (
    <section className="container mx-auto p-6 font-mono">
      <div className="w-full mb-8 overflow-hidden shadow-lg rounded-8">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="text-md font-semibold tracking-wide text-left text-gray-900"
              >
                {ths.map((th) => (<th key={th} className="px-4 py-3 border">{th}</th>))}
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="text-gray-700">
                {tds.map((td) => (
                  <td key={td.id} className="px-4 py-3 border">{td.render(1)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

ObjectEditor.isFieldComponent = true;

export default ObjectEditor;
