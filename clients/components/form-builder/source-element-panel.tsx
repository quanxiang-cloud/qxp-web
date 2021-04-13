import React from 'react';
import SourceElement from './SourceElement';
import registry from './registry';

type Props = {
}

function SourceElementPanel({ }: Props): JSX.Element {
  return (
    <div className="source-element-panel">
      <div className="text-caption mb-20">拖动下方组件至中间表单区域</div>
      {registry.categories.map((category) => {
        const { title, key } = category;

        return (
          <div className="source-element-section" key={key}>
            <div className="text-h6-bold source-element-section__title">{title}</div>
            {
              registry.categorizedElements[key]?.map((item) => {
                return (<SourceElement key={item.type} formItem={item} />);
              })
            }
          </div>
        );
      })}
    </div>
  );
}

export default SourceElementPanel;
