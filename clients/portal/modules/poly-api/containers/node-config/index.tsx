import React, { useEffect, useState, useRef } from 'react';
import { isEmpty } from 'ramda';
import { Input } from '@formily/antd-components';
import { SchemaForm } from '@formily/react-schema-renderer';

import Button from '@c/button';
import Drawer from '@c/drawer';
import useObservable from '@lib/hooks/use-observable';
import store$ from '@polyApi/store';
import { NODE_INIT_CONFIG_PARAMS, NODE_TYPE_MAPPER } from '@polyApi/constants';
import BodyEditor from '@polyApi/components/body-editor';

import DrawerTitle from './drawer-title';

export default function NodeConfigDrawer(): JSX.Element {
  const store = useObservable(store$);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const {
    currentNodeConfigParams: { schema, currentNode, onClose, configForm: ConfigForm },
  } = isEmpty(store) ? NODE_INIT_CONFIG_PARAMS : store;
  const nodeData = useObservable(currentNode);
  const [configValue, setConfigValue] = useState<POLY_API.PolyNodeDetail>(nodeData.detail);

  useEffect(() => {
    setConfigValue(nodeData.detail);
    return () => drawerRef.current?.classList.remove('drawer-fullscreen');
  }, [nodeData.detail]);

  function onSave(): void {
    currentNode?.set('detail', configValue);
    onCancel();
  }

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

  function onToggleFullscreen(): void {
    drawerRef.current?.classList.toggle('drawer-fullscreen');
    setIsFullScreen(!!drawerRef.current?.classList.contains('drawer-fullscreen'));
  }

  const { title, doc, desc } = NODE_TYPE_MAPPER[nodeData.type] || {};

  return (
    <Drawer
      ref={drawerRef}
      position="right"
      className="node-config-drawer"
      title={(
        <DrawerTitle
          title={title}
          desc={desc}
          doc={doc}
          onToggleFullscreen={onToggleFullscreen}
          isFullScreen={isFullScreen}
        />
      )}
      onCancel={onCancel}
      visible={!!((schema || ConfigForm) && currentNode)}
    >
      <section className="node-config-form-section">
        {ConfigForm && (
          <ConfigForm
            value={configValue}
            onChange={setConfigValue}
          />
        )}
        {!ConfigForm && !isEmpty(schema) && (
          <SchemaForm
            schema={schema}
            value={configValue}
            onChange={setConfigValue}
            components={{ input: Input, bodyEditor: BodyEditor }}
          />
        )}
      </section>
      <div
        className="bg-gray-50 text-right px-20 py-8 border-t-1 border-gray-200 flex justify-end
        content-center items-center"
      >
        <Button iconSize={14} className="mr-12 h-28" iconName="close" onClick={onCancel}>取消</Button>
        <Button
          iconSize={14}
          className="h-28"
          modifier="primary"
          iconName="save"
          onClick={onSave}
        >
          保存
        </Button>
      </div>
    </Drawer>
  );
}
