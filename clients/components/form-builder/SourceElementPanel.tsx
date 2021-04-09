import React from 'react';
import styled from 'styled-components';
import SourceElement from './SourceElement';
import registry from './registry';

const ElementContainer = styled.div`
  overflow-y: auto;
  height: calc(100% - 20px);
`;

const ElementSection = styled.div`
  margin-top: 12px;
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
      {registry.categories.map((category) => {
        const { title, key } = category;

        return (
          <ElementSection key={key}>
            <ElementSectionTitle>{title}</ElementSectionTitle>
            {
              registry.categorizedElements[key]?.map((item) => {
                return (<SourceElement key={item.type} formItem={item} />);
              })
            }
          </ElementSection>
        );
      })}
    </ElementContainer>
  );
}

export default SourceElementPanel;
