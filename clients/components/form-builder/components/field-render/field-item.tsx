/* eslint-disable operator-linebreak */
import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';
import { get } from 'lodash';

import { registry } from '@c/form-builder';
import CanvasContext from '@c/form-builder/canvas-context';
import DeleteButton from '@c/form-builder/delete-button';
import MoveButton from '@c/form-builder/move-button';
import CloneButton from '@c/form-builder/clone-button';

import { StoreContext } from '../../context';
import DragDrop from '../drag-drop';
import { LabelProps } from './field-label';
import { ContentProps } from './field-content';
import FieldFragment from './field-fragment';

type ReactMouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

type DragDropProps = {
  id: string;
  pid?: string;
  tabIndex?: string;
}

function FieldItem(field: ISchema): JSX.Element {
  const store = useContext(StoreContext);
  const { isInCanvas } = useContext(CanvasContext);
  const componentMode = isInCanvas ? 'placeholderComponents' : 'components';
  const { title, description, display = false, required = false, readOnly = false } = field;
  const {
    tabIndex,
    isLayoutComponent = false,
    fieldId = '',
    parentFieldId: pid,
  } = field['x-internal'] || {};
  const comp_name = field?.['x-component'] || 'input';
  const Comp = registry[componentMode][comp_name.toLocaleLowerCase()];

  const labelProps: LabelProps = {
    isLayoutComponent,
    required: !!required,
    title: title as string,
    labelAlign: store.labelAlign || 'left',
  };

  const contentProps: ContentProps = {
    isLayoutComponent,
    readOnly,
    field,
    description: description as string,
    Comp,
  };

  const setActiveFieldId = (e: ReactMouseEvent, fieldId: string): void => {
    e.stopPropagation();
    e.preventDefault();

    store.setActiveFieldKey(fieldId);
  };

  const dragDropProps: DragDropProps = {
    id: fieldId,
    pid,
    tabIndex,
  };

  return (
    <DragDrop {...dragDropProps} key={fieldId}>
      <div
        className={cs(
          'field-render',
          'field-item',
          { 'opacity-40': !display },
          { 'field-item-active': store.activeFieldId === fieldId },
        )}
        onClick={(e) => setActiveFieldId(e, fieldId)}
      >
        {/* <span style={{ color: 'red' }}>{fieldId}+{field['x-index']}</span> */}
        {isLayoutComponent
          ? React.createElement(Comp, { ...field })
          : (<FieldFragment
            isTopAlign={store.labelAlign === 'top'}
            labelProps={labelProps}
            contentProps={contentProps}
          />)}

        <DeleteButton filedId={fieldId} />
        <MoveButton fieldId={fieldId} />
        {!get(field, 'x-internal.isLayoutComponent') &&
          <CloneButton fieldId={fieldId} />}
      </div>
    </DragDrop>
  );
}

export default observer(FieldItem);
