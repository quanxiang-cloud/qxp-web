import React, { useEffect, useState, useRef } from 'react';
import { isEmpty, omit } from 'ramda';
import { Input } from '@formily/antd-components';
import { SchemaForm } from '@formily/react-schema-renderer';

import Button from '@c/button';
import Drawer from '@c/drawer';
import store$ from '@polyApi/store';
import EndBody from '@polyApi/nodes/forms/end';
import useObservable from '@lib/hooks/use-observable';
import Condition from '@polyApi/nodes/forms/condition';
import { savePolyApiResult } from '@polyApi/utils/save';
import BodyEditor from '@polyApi/components/body-editor';
import PolyDocDetail from '@polyApi/components/poly-doc-detail';
import ConstantsEditor from '@polyApi/components/constants-editor';
import { NODE_INIT_CONFIG_PARAMS, NODE_TYPE_MAPPER } from '@polyApi/constants';

import DrawerTitle from './drawer-title';

const schemaFormComponents = {
  input: Input,
  bodyEditor: BodyEditor,
  constantsEditor: ConstantsEditor,
  polyDocDetail: PolyDocDetail,
  condition: Condition,
  endBody: EndBody,
};

export default function NodeConfigDrawer(): JSX.Element {
  const store = useObservable(store$);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const {
    currentNodeConfigParams: { schema, currentNode, onClose, configForm: ConfigForm, excludedFields },
  } = isEmpty(store) ? NODE_INIT_CONFIG_PARAMS : store;
  const nodeData = useObservable(currentNode);
  const [configValue, setConfigValue] = useState<POLY_API.PolyNodeDetail>(nodeData.detail);

  useEffect(() => {
    setConfigValue(nodeData.detail);
    return () => drawerRef.current?.classList.remove('drawer-fullscreen');
  }, [nodeData.detail]);

  function onSave(): void {
    currentNode?.set('detail', omit(excludedFields || [], configValue) );
    savePolyApiResult();
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
            initialValues={nodeData.detail}
            value={configValue}
            onChange={setConfigValue}
          />
        )}
        {!ConfigForm && !isEmpty(schema) && (
          <SchemaForm
            schema={schema}
            initialValues={nodeData.detail}
            value={configValue}
            onChange={setConfigValue}
            components={schemaFormComponents}
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
