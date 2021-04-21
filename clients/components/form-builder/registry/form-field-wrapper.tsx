import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Icon from '@c/icon';
import { StoreContext } from '../context';
import FormBuilderStore from '../store';

function renderActions(store: FormBuilderStore): JSX.Element {
  return (
    <div className="absolute flex -top-16 right-16 z-10">
      <span
        className={classnames('field-action-icon', 'mr-8')}
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
        className={classnames('field-action-icon', 'mr-8')}
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
        className={classnames('field-action-icon', 'mr-8')}
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

function InnerWrapper(props: ISchemaFieldComponentProps) {
  const store = React.useContext(StoreContext);
  const ref = React.useRef<HTMLDivElement>(null);
  const active = store.activeFieldWrapperName == props.name;

  function handleFieldClick() {
    // todo refactor this
    // how could someone else knows why trim the first 5 chars?
    store.setActiveFieldKey(props.name.slice(5));
  }

  const childrenInvisible = props.props['x-component-props'].childrenInvisible;

  return (
    <div
      ref={ref}
      onClick={handleFieldClick}
      className={classnames('relative', 'form-field-wrapper', {
        'form-field-wrapper--active': active,
        'form-field-wrapper--hidden-children': childrenInvisible,
      })}
    >
      {active && renderActions(store)}
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
