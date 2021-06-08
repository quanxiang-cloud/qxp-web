import React, { useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Button from '@c/button';

import LinkageConfig from './default-value-linkage-config';

function DefaultValueLinkageConfigBtn(props: ISchemaFieldComponentProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        设置联动规则
      </Button>
      {
        showModal && (
          <LinkageConfig
            linkage={props.value}
            onClose={() => setShowModal(false)}
            onSubmit={(config) => {
              props.mutators.change(config);
              setShowModal(false);
            }}
          />
        )
      }
    </>
  );
}

DefaultValueLinkageConfigBtn.isFieldComponent = true;

export default DefaultValueLinkageConfigBtn;
