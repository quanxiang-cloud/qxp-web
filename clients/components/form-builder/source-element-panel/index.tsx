import React from 'react';
import SourceElement from './source-element';
import registry from '../registry';
import { ReactSortable } from 'react-sortablejs';

function SourceElementPanel(): JSX.Element {
  return (
    <div className="source-element-panel">
      <div className="text-caption mb-20">拖动下方组件至中间表单区域</div>
      {registry.categories.map((category) => {
        const { title, key } = category;

        return (
          <div className="source-element-section" key={key}>
            <div className="text-h6-bold source-element-section--title">{title}</div>
            {
              registry.categorizedElements[key]?.map((item) => {
                return (
                  <ReactSortable
                    key={item.componentName}
                    group={{
                      name: `form_builder_${key}`,
                      pull: true,
                      put: false,
                    }}
                    animation={400}
                    list={[{ id: 1 }]}
                    setList={() => console.log()}
                  >
                    <SourceElement
                      key={item.componentName}
                      formItem={item}
                    />
                  </ReactSortable>
                );
              })
            }
          </div>
        );
      })}
    </div>
  );
}

export default SourceElementPanel;
