import React, { useContext } from 'react';
import { useCss } from 'react-use';
import { useDrag } from 'react-dnd';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Icon from '@c/icon';
import { StoreContext } from '@c/form-builder/context';

export type DragEle = { dataId: string; index: number };

type Props = {
  formItem: FormBuilder.SourceElement<any>;
}

function SourceElement(props: Props): JSX.Element {
  const store = useContext(StoreContext);

  const { formItem } = props;
  const id = `form_builder_${formItem.componentName}`;

  const [_, drag] = useDrag(() => ({
    type: 'sideEle',
    item: {
      dropId: 'root',
      sourceId: formItem.componentName,
      index: 0,
      from: 'sourceElement',
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // quick insert field
  const quickInsert = (curFieldName: string): void => {
    const dropField = store.flattenFieldsMap[store.activeFieldId];
    const index = (dropField?.['x-index'] || 0) + 1;
    const { parentFieldId, tabIndex } = dropField?.['x-internal'] || {};

    const quickInsertParam: any = {
      fieldId: curFieldName,
      index,
      parentFieldId,
      tabIndex,
    };

    store.insert(quickInsertParam);
  };

  return (
    <div
      ref={drag}
      data-id={id}
      className={
        cs('source-element-section--element',
          useCss({
            cursor: 'pointer',
            '&:hover': {
              boxShadow: '0 0 10px var(--gray-200)',
            },
          }))
      }
      onClick={() => quickInsert(formItem.componentName)}
    >
      <Icon name={formItem.icon} size={20} className="mr-6" />
      {formItem.displayName}
    </div>
  );
}

export default observer(SourceElement);
