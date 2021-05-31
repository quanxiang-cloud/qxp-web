import React, { useContext, useState } from 'react';
import { StoreContext } from '@c/form-builder/context';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Button from '@c/button';

import LinkageConfig from './default-value-linkage-config';

function DefaultValueLinkageConfigBtn(props: ISchemaFieldComponentProps) {
  const store = useContext(StoreContext);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        设置联动规则
      </Button>
      {
        showModal && (
          <LinkageConfig
            onClose={() => setShowModal(false)}
            onSubmit={(config) => {
              console.log(config);
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
