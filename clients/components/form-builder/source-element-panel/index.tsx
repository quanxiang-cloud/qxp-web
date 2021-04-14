import React from 'react';
import SourceElement from './source-element';
import registry from '../registry';

function SourceElementPanel(): JSX.Element {
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
                return (<SourceElement key={item.componentName} formItem={item} />);
              })
            }
          </div>
        );
      })}
    </div>
  );
}

export default SourceElementPanel;
