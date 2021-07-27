import React, { useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Button from '@c/button';

import LinkageConfig from './default-value-linkage-config';

function DefaultValueLinkageConfigBtn(props: ISchemaFieldComponentProps): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  const { isLinkedFieldShow, isLinkedTableReadonly } = props.props?.['x-component-props'] || {};

  return (
    <>
      <Button onClick={() => setShowModal(true)}>设置联动规则</Button>
      {
        showModal && (
          <LinkageConfig
            isLinkedFieldShow={isLinkedFieldShow}
            isLinkedTableReadonly={isLinkedTableReadonly}
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
