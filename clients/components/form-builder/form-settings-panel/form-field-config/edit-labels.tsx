
import React, { useState } from 'react';
import { uniq } from 'lodash';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Button from '@c/button';

import OptionLabels from './input-for-labels';

function EditLabels({ props, form, mutators }: ISchemaFieldComponentProps): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  const { isLinkedFieldHide, isLinkedTableReadonly } = props?.['x-component-props'] || {};
  const { getFieldValue } = form;
  const availableOptions = getFieldValue('availableOptions');

  return (
    <>
      <Button onClick={() => setShowModal(true)}>编辑选项</Button>
      {showModal && (
        <OptionLabels
          form={form}
          defaultValue={availableOptions.map(({ label }: any) => label).join('\n')}
          onClose={() => setShowModal(false)}
          onSubmit={(optionLabels) => {
            mutators.change(uniq(optionLabels));
            setShowModal(false);
          }}
          isLinkedFieldHide={isLinkedFieldHide}
          isLinkedTableReadonly={isLinkedTableReadonly}
        />
      )}
    </>
  );
}

EditLabels.isFieldComponent = true;

export default EditLabels;
