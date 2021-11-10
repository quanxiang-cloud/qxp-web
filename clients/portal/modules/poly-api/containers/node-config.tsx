import React from 'react';
import { isEmpty } from 'ramda';
import { Input } from '@formily/antd-components';
import { SchemaForm } from '@formily/react-schema-renderer';

import Drawer from '@c/drawer';
import useObservable from '@lib/hooks/use-observable';

import store$ from '../store';

export default function NodeConfigDrawer(): JSX.Element {
  const store = useObservable(store$);
  const initialConfigParams = {
    currentNodeConfigParams: { schema: {}, currentNode: undefined, onClose: undefined, configForm: null },
  };
  const {
    currentNodeConfigParams: { schema, currentNode, onClose, configForm: ConfigForm },
  } = isEmpty(store) ? initialConfigParams : store;

  function onCancel(): void {
    onClose?.();
    store$.set('currentNodeConfigParams', {
      schema: {},
      configForm: null,
      currentNode: undefined,
      onClose: undefined,
      full: false,
    });
  }

  return (
    <Drawer
      position="right"
      className="node-config-drawer"
      title={`配置${currentNode?.value.type}节点`}
      onCancel={onCancel}
      visible={!!((schema || ConfigForm) && currentNode)}
    >
      {ConfigForm && <ConfigForm />}
      {!ConfigForm && !isEmpty(schema) && <SchemaForm schema={schema} components={{ input: Input }} />}
    </Drawer>
  );
}
