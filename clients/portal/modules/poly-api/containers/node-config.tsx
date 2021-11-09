import React from 'react';
import { SchemaForm } from '@formily/react-schema-renderer';
import { isEmpty } from 'ramda';
import { Input } from '@formily/antd-components';

import Drawer from '@c/drawer';
import useObservable from '@lib/hooks/use-observable';

import store$ from '../store';

export default function NodeConfigDrawer(): JSX.Element {
  const store = useObservable(store$);
  const initialConfigParams = {
    currentNodeConfigParams: { schema: {}, currentNode: undefined, onClose: undefined },
  };
  const {
    currentNodeConfigParams: { schema, currentNode, onClose },
  } = isEmpty(store) ? initialConfigParams : store;

  function onCancel(): void {
    onClose?.();
    store$.set('currentNodeConfigParams', {
      schema: {},
      currentNode: undefined,
      onClose: undefined,
    });
  }

  return (
    <Drawer
      title="node config"
      onCancel={onCancel}
      visible={!!(schema && currentNode)}
      position="right"
    >
      <SchemaForm schema={schema} components={{ input: Input }} />
    </Drawer>
  );
}
