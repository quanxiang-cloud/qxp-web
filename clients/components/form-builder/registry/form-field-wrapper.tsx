import React from 'react';
import { useDrop } from 'react-dnd';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Icon from '@c/icon';
import { StoreContext } from '../context';
import FormBuilderStore from '../store';

function renderActions(store: FormBuilderStore, index: number): JSX.Element {
  const hideMoveUp = index === 0;
  // todo refactor this
  const hideMoveDown = index === store.fields.length - 1;

  return (
    <div className="absolute flex -top-16 right-16 z-10">
      <span
        className={cs({
          'mr-8': !hideMoveUp,
          'field-action-icon': !hideMoveUp,
          hidden: hideMoveUp,
        })}
        onClick={() => {
          if (!store.activeField) {
            return;
          }

          store.moveUp(store.activeField?.fieldName);
        }}
      >
        <Icon name="arrow_upward" size={20} />
      </span>
      <span
        className={cs({
          'field-action-icon mr-8': !hideMoveDown,
          hidden: hideMoveDown,
        })}
        onClick={() => {
          if (!store.activeField) {
            return;
          }

          store.moveDown(store.activeField?.fieldName);
        }}
      >
        <Icon name="arrow_downward" size={20} />
      </span>
      <span
        className={cs('field-action-icon', 'mr-8')}
        onClick={() => {
          if (!store.activeField) {
            return;
          }

          store.duplicate(store.activeField?.fieldName);
        }}
      >
        <Icon name="content_copy" size={20} />
      </span>
      <span
        className={'field-action-icon'}
        onClick={() => {
          if (!store.activeField) {
            return;
          }

          store.delete(store.activeField?.fieldName);
        }}
      >
        <Icon name="delete" size={20} />
      </span>
    </div>
  );
}

type CollectedProps = {
  isOver: boolean;
}

function InnerWrapper(props: ISchemaFieldComponentProps) {
  const store = React.useContext(StoreContext);
  const active = store.activeFieldWrapperName == props.name;

  const [{ isOver }, drop] = useDrop<DragObject, DropResult, CollectedProps>({
    accept: 'SOURCE_ELEMENT',
    drop: () => {
      return {
        id: props.name,
        item: 'something?',
        index: props.props['x-index'],
        // todo refactor this
        dropPosition: 'up',
      };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function handleFieldClick() {
    // todo refactor this
    // how could someone else knows why trim the first 5 chars?
    store.setActiveFieldKey(props.name.slice(5));
  }

  return (
    <div
      ref={drop}
      onClick={handleFieldClick}
      className={cs('relative', 'form-field-wrapper', { 'form-field-wrapper--active': active || isOver })}
    >
      {active && renderActions(store, props.props['x-index'])}
      {props.children}
    </div>
  );
}

const decoratedComponent = observer(InnerWrapper);

function FormFieldWrapper(props: ISchemaFieldComponentProps) {
  return React.createElement(decoratedComponent, props);
}

FormFieldWrapper.isVirtualFieldComponent = true;

export default FormFieldWrapper;
