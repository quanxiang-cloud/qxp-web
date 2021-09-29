/**
 * feat: layout-grid placeholder component in canvas builder
 */
import React from 'react';
import { get, isEmpty } from 'lodash';

import FieldRender from '@c/form-builder/components/field-render';
import { EmptyLayout } from '@c/form-builder/components/empty-layout';
import { getFieldId } from '@c/form-builder/utils/fields-operator';

function Placeholder(layoutGridField: ISchema): JSX.Element {
  const { properties } = layoutGridField;
  const pid = getFieldId(layoutGridField);
  const columns = get(layoutGridField, 'x-component-props.columns') || 2;

  return (
    <div
      className="min-h-32 border_b6 grid layout-grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {isEmpty(properties) ?
        <EmptyLayout cols={2} pid={pid} /> :
        <FieldRender schema={{ properties }} />
      }
    </div >
  );
}

Placeholder.isVirtualFieldComponent = true;

export default Placeholder;
