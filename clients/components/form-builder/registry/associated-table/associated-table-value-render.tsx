/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import AssociatedTableModal from './associated-table-modal';

type Props = {
  schema: ISchema;
  value: LabelValue;
  rowData: any;
}

export default function AssociatedTableValueRender({ schema, value, rowData }: Props): JSX.Element {
  const [showTableModal, setShowTableModal] = useState(false);
  const { title } = schema || {};
  const componentProps = schema?.['x-component-props'] || {};
  const { defaultValue, linkedTableField } = componentProps;
  const rowDataId = rowData?._id;
  const filterConfig = {
    tag: 'must',
    condition: [
      {
        key: `${linkedTableField}.value`,
        op: 'eq',
        value: rowDataId,
        valueFrom: 'fixedValue',
      },
    ],
  };

  return (
    <>
      <div
        onClick={() => setShowTableModal(true)}
        className='text-blue-600 cursor-pointer'>
        {defaultValue}
      </div>
      {showTableModal && (
        <AssociatedTableModal
          title={title}
          componentProps={componentProps}
          filterConfig={filterConfig}
          onClose={()=> setShowTableModal(false)}
        />
      )}
    </>
  );
}
