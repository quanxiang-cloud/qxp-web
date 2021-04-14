import React, { useContext } from 'react';
import { useDrag } from 'react-dnd';
import Icon from '@c/icon';

import { StoreContext } from '../context';
import { observer } from 'mobx-react';

type Props = {
  formItem: SourceElement<any>;
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
    <div className="source-element-section__element" ref={dragRef} style={{ opacity }}>
      <Icon name={formItem.icon} size={20} className="mr-6" />
      {formItem.itemName}
    </div>
  );
}

export default observer(SourceElement);
