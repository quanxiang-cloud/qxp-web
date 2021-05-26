import React, { useState, useRef, DragEvent } from 'react';
import dagre from 'dagre';
import cs from 'classnames';
import { useParams } from 'react-router-dom';
import ReactFlow, {
  ReactFlowProvider,
  ConnectionLineType,
  isNode,
  Position,
  Edge,
  Connection,
  addEdge,
  removeElements,
  Background,
  BackgroundVariant,
  MiniMap,
  FlowElement,
  Elements,
  ArrowHeadType,
  OnLoadParams,
} from 'react-flow-renderer';

import { uuid } from '@lib/utils';
import useObservable from '@lib/hooks/use-observable';

import FormDataNode from './nodes/form-data';
import End from './nodes/end';
import FillIn from './nodes/fill-in';
import Approve from './nodes/approve';
import Plus from './edges/plus';
import Control from './control';
import Components from './components';
import store, { updateStore } from './store';
import type { StoreValue } from './type';
import { getNodeInitialData } from './utils';
import DrawerForm from './forms';

import 'react-flow-renderer/dist/style.css';
import 'react-flow-renderer/dist/theme-default.css';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export default function Editor() {
  const { currentConnection, elements } = useObservable<StoreValue>(store);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [fitViewFinished, setFitViewFinished] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
  const { flowID } = useParams<{ flowID: string; }>();

  function setElements(elements: Elements) {
    updateStore((s) => ({ ...s, elements }));
  }

  function getLayoutedElements(elements: Elements) {
    dagreGraph.setGraph({ rankdir: 'TB' });
    elements.forEach((el) => {
      if (isNode(el)) {
        dagreGraph.setNode(el.id, {
          width: el.data.nodeData.width,
          height: el.data.nodeData.height,
        });
      } else {
        dagreGraph.setEdge(el.source as string, el.target as string);
      }
    });
    dagre.layout(dagreGraph);
    return elements.map((el, index) => {
      if (isNode(el)) {
        const nodeWithPosition = dagreGraph.node(el.id);
        el.targetPosition = Position.Top;
        el.sourcePosition = Position.Bottom;
        // if (el.position.x === 0 && el.position.y === 0) {
        el.position = {
          x: nodeWithPosition.x - (el.data.nodeData.width / 2),
          y: nodeWithPosition.y + (index * 80),
        };
        // }
      }
      return el;
    });
  }

  function onConnect(connection: Edge | Connection) {
    setElements(addEdge({ ...connection, type: 'plus' }, store.value.elements));
  }

  function onElementsRemove(elementsToRemove: Elements) {
    setElements(removeElements(elementsToRemove, store.value.elements));
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    if (!e.dataTransfer) {
      return;
    }
    e.dataTransfer.dropEffect = 'move';
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    if (!reactFlowWrapper?.current || !reactFlowInstance || !e.dataTransfer) {
      return;
    }
    // const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const { nodeType: type, width, height, nodeName } = JSON.parse(
      e.dataTransfer.getData('application/reactflow')
    );
    const { source, target, position } = currentConnection;
    if (!source || !target || !position) {
      return;
    }
    // const position = (reactFlowInstance as any).project({
    //   x: e.clientX - reactFlowBounds.left,
    //   y: e.clientY - reactFlowBounds.top,
    // });
    const id = type + uuid();
    function updateElementPosition(
      element: FlowElement<any>,
      insertPosition: number,
      currentPosition: number
    ) {
      if (!(element as any).position || element.id === id) {
        return element;
      }
      const position = { ...(element as any).position };
      if (insertPosition > currentPosition) {
        position.y = position.y - 72;
      } else if (insertPosition < currentPosition) {
        position.y = position.y + 72;
      }
      return { ...element, position };
    }
    const newElements: Elements = [];
    let insertPosition = store.value.elements.length;
    store.value.elements.forEach((element: FlowElement, index: number) => {
      if (element.id !== `e${source}-${target}`) {
        newElements.push(updateElementPosition(element, insertPosition, index));
      }
      if (element.id === source) {
        insertPosition = index;
        newElements.push({
          id,
          type,
          position: { x: position.x - (width / 2), y: position.y - (height / 2) },
          data: {
            nodeData: { width, height, name: nodeName },
            businessData: getNodeInitialData(type),
          },
        });
      }
    });
    setElements(newElements);
    onConnect({
      id: `e${source}-${id}`, source, target: id, label: '+',
      arrowHeadType: ArrowHeadType.ArrowClosed,
    });
    onConnect({
      id: `e${id}-${target}`, source: id, target, label: '+',
      arrowHeadType: ArrowHeadType.ArrowClosed,
    });
    updateStore((s) => ({ ...s, currentConnection: {} }));
  }

  function onLoad(reactFlowInstance: OnLoadParams) {
    const { fitView } = reactFlowInstance;
    setReactFlowInstance(reactFlowInstance);
    !flowID && setElements(getLayoutedElements(elements));
    setTimeout(() => {
      fitView({ padding: 1.2 });
      setFitViewFinished(true);
    }, 0);
  }

  return (
    <div className={cs('w-full h-full flex-1 relative transition', {
      'opacity-0': !fitViewFinished,
    })}>
      <ReactFlowProvider>
        <div className="reactflow-wrapper w-full h-full" ref={reactFlowWrapper}>
          <ReactFlow
            className="cursor-move"
            elements={elements}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            connectionLineType={ConnectionLineType.Step}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={{
              formData: FormDataNode,
              end: End,
              fillIn: FillIn,
              approve: Approve,
            }}
            edgeTypes={{
              plus: Plus,
            }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={12}
              size={0.5}
            />
            <MiniMap
              nodeColor={(node) => {
                switch (node.type) {
                case 'input':
                  return 'red';
                case 'default':
                  return '#00ff00';
                case 'output':
                  return 'rgb(0,0,255)';
                default:
                  return '#eee';
                }
              }}
              nodeStrokeWidth={3}
            />
            <Control className="left-16 top-16 right-16 flex absolute z-10" />
          </ReactFlow>
        </div>
        <Components />
        <DrawerForm />
      </ReactFlowProvider>
    </div>
  );
}
