import React, { useState, useEffect, useRef } from 'react';
import cs from 'classnames';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/Observable/of';
import { filter, map, concatAll } from 'rxjs/operators';
import { equals, pathEq } from 'ramda';
import { usePrevious } from 'react-use';
import ReactFlow, {
  useZoomPanHelper, Elements, useStoreState, Node, Edge, isNode,
} from 'react-flow-renderer';

import Toolbar from '../toolbar';
import { POLY_DESIGN_CONFIG } from '../constants';
import layout from './layout';
import nodeTypes from '../nodes';
import { isSomeActionShow } from '../utils';

const isTrue = equals(true);

interface Props {
  className?: string;
}

const initialElements: Elements<POLY_API.PolyNode> = [
  {
    id: '1',
    type: 'input',
    data: {
      label: 'Input Node',
      detail: { type: 'input', data: { inputs: [], consts: [] } },
      handles: { right: '1__right' },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'request',
    data: {
      label: <div>Default Node</div>,
      detail: {
        type: 'request',
        data: {
          rawPath: '',
          apiName: '',
          inputs: [],
        },
      },
      handles: { top: '2__top', left: '2__left', right: '2__right', bottom: '2__bottom' },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '3',
    type: 'end',
    data: {
      label: 'Output Node',
      detail: {
        type: 'end',
        data: {
          body: {
            type: 'object',
            data: [],
          },
        },
      },
      handles: { left: '3__left' },
    },
    position: { x: 0, y: 0 },
  },
  {
    type: POLY_DESIGN_CONFIG.EDGE_TYPE,
    arrowHeadType: POLY_DESIGN_CONFIG.ARROW_HEAD_TYPE,
    id: 'e1-2', source: '1', target: '2',
    sourceHandle: '1__right',
    targetHandle: '2__left',
    label: '是', labelShowBg: true, labelBgStyle: { fill: POLY_DESIGN_CONFIG.BACKGROUND_COLOR },
  },
  {
    type: POLY_DESIGN_CONFIG.EDGE_TYPE,
    arrowHeadType: POLY_DESIGN_CONFIG.ARROW_HEAD_TYPE,
    id: 'e2-3', source: '2', target: '3',
    sourceHandle: '2__right',
    targetHandle: '3__left',
    label: '否', labelShowBg: true, labelBgStyle: { fill: POLY_DESIGN_CONFIG.BACKGROUND_COLOR },
  },
];

function PolyDetailsDesigner({ className }: Props): JSX.Element {
  const { fitView } = useZoomPanHelper();
  const [elements, setElements] = useState<Elements<POLY_API.PolyNode>>(initialElements);
  const previsouElements = usePrevious(elements);
  const nodes = useStoreState((store) => store.nodes);
  const previousNodes = usePrevious(nodes);
  const edges = useStoreState((store) => store.edges);
  const previousEdges = usePrevious(edges);
  const tids = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const el = document.querySelector('.react-flow__pane');
    function dissNodeAction(): void {
      const triggers = Array.from(document.querySelectorAll('.node-action-trigger')) as HTMLDivElement[];
      triggers.forEach((trigger) => {
        trigger.classList.remove('active');
        const action = trigger.querySelector('.node-actions') as HTMLDivElement;
        action.style.opacity = '0';
        action.style.pointerEvents = 'none';
        const tid = setTimeout(() => {
          trigger.style.opacity = '0';
        }, 240);
        tids.current.push(tid);
      });
    }
    el?.addEventListener('click', dissNodeAction);
    return () => {
      el?.removeEventListener('click', dissNodeAction);
      tids.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  function updateElements(elements: Elements<POLY_API.PolyNode>): void {
    elements.length && !equals(elements, previsouElements) && setElements(elements);
  }

  function nodeStateChanged(nodes: Node<POLY_API.PolyNode>[]): boolean {
    return !equals(nodes, previousNodes);
  }

  function edgeStateChanged(edges: Edge<POLY_API.PolyNode>[]): boolean {
    return !equals(edges, previousEdges);
  }

  function handleCanvasClick(): void {
    const flowNodes = Array.from(document.querySelectorAll('.react-flow__node')) as HTMLElement[];
    const nodeActivedList = flowNodes
      .map((node: HTMLElement) => isSomeActionShow(node) ? node : false)
      .filter(Boolean) as HTMLElement[];
    nodeActivedList.forEach((node) => node.style.zIndex = '10');
  }

  function isLayoutComplete(): boolean {
    return elements.some((element) => {
      const positionNotEqZero = (p: string): boolean => !pathEq(['position', p], 0, element);
      return isNode(element) && positionNotEqZero('x') && positionNotEqZero('y');
    });
  }

  useEffect(() => {
    of(nodeStateChanged(nodes) || edgeStateChanged(edges)).pipe(
      filter(isTrue),
      map(() => fromPromise(layout(nodes, edges))),
      concatAll(),
    ).subscribe(updateElements);
  }, [nodes, edges]);

  useEffect(fitView, [elements]);

  return (
    <div className={cs(className)}>
      <ReactFlow
        className={cs('cursor-move', isLayoutComplete() ? '' : 'opacity-0')}
        style={{ backgroundColor: POLY_DESIGN_CONFIG.BACKGROUND_COLOR }}
        elements={elements}
        nodeTypes={nodeTypes}
        edgeTypes={{}}
        nodesConnectable={false}
        nodesDraggable={false}
        arrowHeadColor={POLY_DESIGN_CONFIG.EDGE_COLOR}
        onPaneClick={handleCanvasClick}
        onPaneContextMenu={handleCanvasClick}
      >
        <Toolbar />
      </ReactFlow>
    </div>
  );
}

export default PolyDetailsDesigner;
