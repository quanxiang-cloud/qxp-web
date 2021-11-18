import React, { useEffect, useCallback, useState } from 'react';
import cs from 'classnames';
import { useStoreState, OnLoadParams, isNode, isEdge } from 'react-flow-renderer';

import useObservable from '@lib/hooks/use-observable';
import Loading from '@c/loading';

import { initGraphElements, layoutPolyCanvas } from '../utils';
import store$ from '../store';
import Canvas from './canvas';

interface Props {
  className?: string;
}

function PolyDetailsDesigner({ className }: Props): JSX.Element | null {
  const [flowInstance, setFlowInstance] = useState<OnLoadParams<POLY_API.Element>>();
  const elements$ = store$.value.nodes;
  const elements = useObservable<POLY_API.Element[]>(elements$, []);

  const nodes = useStoreState((store) => store.nodes);
  const edges = useStoreState((store) => store.edges);

  const onLoad = useCallback((instance) => {
    !flowInstance && setFlowInstance(instance);
  }, [flowInstance]);

  const isLayoutFinished = useCallback(() => {
    return flowInstance && nodes.every((node) => node.position.x || node.position.y);
  }, [nodes, flowInstance]);

  useEffect(() => {
    isLayoutFinished() && flowInstance?.fitView();
  }, [flowInstance, elements, isLayoutFinished]);

  const isIniting = useCallback(() => {
    return nodes.some((node) => !node.__rf.width);
  }, [nodes]);

  useEffect(() => {
    if (!flowInstance || isIniting() || isLayoutFinished()) {
      return;
    }
    layoutPolyCanvas(nodes, edges);
  }, [nodes, edges, flowInstance, isLayoutFinished, isIniting]);

  useEffect(() => {
    if (!elements.length || elements.some((element) => isNode(element) && !element.__rf?.width)) {
      return;
    }
    const nodes = elements.filter((element) => isNode(element)) as POLY_API.NodeElement[];
    const edges = elements.filter((element) => isEdge(element)) as POLY_API.EdgeElement[];
    if (!edges.length) {
      return;
    }
    console.log('再次布局', nodes, edges);
    layoutPolyCanvas(nodes, edges);
  }, [elements.length]);

  useEffect(() => {
    !elements.length && elements$.set(initGraphElements());
  }, [elements]);

  if (!elements.length) {
    return <Loading />;
  }

  return (
    <div className={cs(className)}>
      <Canvas
        hidden={!isLayoutFinished()}
        elements={elements}
        onLoad={onLoad}
      />
    </div>
  );
}

export default PolyDetailsDesigner;
