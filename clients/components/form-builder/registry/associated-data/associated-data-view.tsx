import React, { useState } from 'react';

import Modal from '@c/modal';
import FormDataDetailsCard from '@c/form-data-details-card';

type Props = {
  schema: ISchema;
  value: LabelValue;
}

export default function AssociatedDataValueRender({ schema, value }: Props):JSX.Element {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div onClick={() => setVisible(true)} className='text-blue-600 cursor-pointer'>{value.label}</div>
      {visible && (
        <Modal
          title={`${schema.title}详情`}
          onClose={() => setVisible(false)}
        >
          <FormDataDetailsCard
            className='p-10'
            appID={schema['x-component-props']?.appID as string}
            tableID={schema['x-component-props']?.associationTableID as string}
            rowID={value.value}
          />
        </Modal>
      )}
    </>
  );
}
