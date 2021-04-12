import styled from 'styled-components';
import React, { useContext } from 'react';
import { useDrag } from 'react-dnd';
import Icon from '@c/icon';

import { StoreContext } from './context';
import { observer } from 'mobx-react';
const SourceElementDiv = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 2px;
  border: 1px dashed #d5dce7;
  width: 120px;
  height: 32px;
  margin-right: 8px;
  margin-bottom: 12px;
  padding-left: 12px;
  color: #3c4e5b;
  cursor: move;

  &.is-dragging {
    color: ${(props) => props.theme.primaryColor};
    border-color: ${(props) => props.theme.primaryColor};
  }
`;

type Props = {
  formItem: FormItem<any>;
}

function SourceElement({ formItem }: Props): JSX.Element {
  const store = useContext(StoreContext);
  const [{ isDragging }, dragRef] = useDrag<any, DropResult, any>({
    type: 'SOURCE_ELEMENT',
    item: formItem,
    end: () => store.append(formItem),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  return (
    <SourceElementDiv ref={dragRef} style={{ opacity }}>
      <Icon name={formItem.icon} size={20} className="mr-6" />
      {formItem.itemName}
    </SourceElementDiv>
  );
}

export default observer(SourceElement);
