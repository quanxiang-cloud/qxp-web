import React, { DragEvent, useContext, Fragment, useMemo } from 'react';
import cs from 'classnames';

import useObservable from '@lib/hooks/use-observable';
import FlowRender from '@c/flow-render';
import FlowContext from '@flow/flow-context';

import edgeTypes from './edges';
import nodeTypes from './nodes';
import Components from './components';
import store from './store';
import type { StoreValue } from './type';
import DrawerForm from './forms';
import { addNewNode } from './utils';

export default function Editor(): JSX.Element {
  const { appID } = useContext(FlowContext);
  const { currentConnection, elements, nodeIdForDrawerForm } = useObservable<StoreValue>(store);

  async function onDrop(e: DragEvent): Promise<void> {
    e.preventDefault();
    if (!e?.dataTransfer) {
      return;
    }
    const { nodeType, width, height, nodeName } = JSON.parse(
      e.dataTransfer.getData('application/reactflow'),
    );
    const { source, target, position } = currentConnection;
    if (!source || !target || !position) {
      return;
    }
    await addNewNode(elements, appID, { nodeType, width, height, nodeName, source, target, position });
  }

  const siblings = useMemo(() => {
    return (
      <Fragment>
        <Components nodeIdForDrawerForm={nodeIdForDrawerForm} />
        {nodeIdForDrawerForm && (
          <DrawerForm key={nodeIdForDrawerForm} />
        )}
      </Fragment>
    );
  }, [nodeIdForDrawerForm]);

  return (
    <div className={cs('w-full h-full flex-1 relative transition')}>
      <FlowRender
        elements={elements}
        onDrop={onDrop}
        siblings={siblings}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        layoutType='elk'
        direction="bottom"
      />
    </div>
  );
}
