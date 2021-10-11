/**
 * feat: Render field by this instead of SchemaForm;
 * (core: render field placeholder)
 */

import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { get, values } from 'lodash';

import FieldItem from './field-item';
import { getSortedFields } from './utils';
import { StoreContext } from '../../context';
import './index.scss';

type Props = {
  schema: ISchema;
};

type GridStyle = {
  gridColumnStart?: number;
  gridColumnEnd?: number;
};

const FULL_ROW = ['subtable', 'associatedrecords'];

function FieldRender({ schema }: Props): JSX.Element {
  const store = useContext(StoreContext);

  const fieldsArr = getSortedFields(values(schema.properties));

  // Render subtable & associatedrecords with entire row
  const handleEntireRowStyle = (field: ISchema): GridStyle => {
    let style = {};
    const pid = get(field, 'x-internal.parentFieldId');
    const fieldCompName = get(field, 'x-component') || '';
    const copName = get(store.flattenFieldsMap[pid], 'componentName') || '';

    const shouldFullRow = copName?.toLowerCase() === 'layoutgrid' &&
      FULL_ROW.includes(fieldCompName?.toLocaleLowerCase());

    if (shouldFullRow) {
      const col = get(store.flattenFieldsMap[pid], 'configValue.columns');
      style = {
        gridColumnStart: 1,
        gridColumnEnd: col + 1,
      };
    }
    return style;
  };

  return (
    <>
      {fieldsArr
        .map((field: ISchema) => {
          return (
            <div
              key={get(field, 'x-internal.fieldId')}
              style={handleEntireRowStyle(field)}
            >
              <FieldItem {...field} />
            </div>
          );
        })
      }
    </>
  );
}

export default observer(FieldRender);
