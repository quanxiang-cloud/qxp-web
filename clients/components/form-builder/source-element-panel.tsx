import React from 'react';
import styled from 'styled-components';
import SourceElement from './SourceElement';
import registry from './registry';

const ElementContainer = styled.div`
  overflow-y: auto;
  height: calc(100% - 20px);
`;

const ElementSectionTitle = styled.div`
  color: #939aa9;
  margin-bottom: 12px;
`;

type Props = {
}

function SourceElementPanel({ }: Props): JSX.Element {
  return (
    <ElementContainer>
      <div className="text-caption mb-20">拖动下方组件至中间表单区域</div>
      {registry.categories.map((category) => {
        const { title, key } = category;

        return (
          <div className="source-element-section" key={key}>
            <ElementSectionTitle>{title}</ElementSectionTitle>
            {
              registry.categorizedElements[key]?.map((item) => {
                return (<SourceElement key={item.type} formItem={item} />);
              })
            }
          </div>
        );
      })}
    </ElementContainer>
  );
}

export default SourceElementPanel;
