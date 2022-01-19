import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { ReactFlowProvider } from 'react-flow-renderer';

import Loading from '@c/loading';
import FlowRender from '@c/flow-render';
import useObservable from '@lib/hooks/use-observable';

import PolyDetailsHeader from './header';
import NodeConfigDrawer from './node-config';
import { useQueryPolyInfo } from '../effects/api/poly';
import { parseArrangeFromString, parsePolySourceFromApi } from '../utils/build';
import store$ from '../store';
import { POLY_DESIGN_CONFIG } from '../constants';
import { initGraphElements, isSomeActionShow } from '../utils';
import useCloseNodeAction from '../effects/hooks/use-close-node-action';

function PolyDetails(): JSX.Element {
  const { polyFullPath } = useParams<POLY_API.PolyParams>();
  const elements = useObservable<POLY_API.Element[]>(store$.nodes$, []);
  const { data, isLoading } = useQueryPolyInfo({
    path: polyFullPath,
  }, { enabled: !!polyFullPath, cacheTime: -1 });

  useEffect(() => {
    data && parsePolySourceFromApi(data);
  }, [data]);

  useEffect(() => {
    if (!data?.arrange) {
      return;
    }
    const { nodes } = parseArrangeFromString(data.arrange) ?? {};
    !nodes && store$.nodes$.set(initGraphElements());
  }, [data]);

  useCloseNodeAction();

  const siblings = useMemo(() => <NodeConfigDrawer />, []);

  function handleCanvasClick(): void {
    const flowNodes = Array.from(document.querySelectorAll('.react-flow__node')) as HTMLElement[];
    const nodeActivedList = flowNodes
      .map((node: HTMLElement) => isSomeActionShow(node) ? node : false)
      .filter(Boolean) as HTMLElement[];
    nodeActivedList.forEach((node) => node.style.zIndex = '10');
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen items-center justify-center">
        <Loading desc="加载中..." />;
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-nowrap h-screen items-center">
      <ReactFlowProvider>
        <PolyDetailsHeader className="h-48 w-full bg-white" />
        <FlowRender
          elements={elements}
          siblings={siblings}
          nodeTypes={POLY_DESIGN_CONFIG.NODE_TYPES}
          layoutType='elk'
          direction="right"
          onPaneClick={handleCanvasClick}
          onPaneContextMenu={handleCanvasClick}
          style={{ backgroundColor: POLY_DESIGN_CONFIG.BACKGROUND_COLOR }}
          arrowHeadColor={POLY_DESIGN_CONFIG.EDGE_COLOR}
          nodesConnectable={false}
          nodesDraggable={false}
        />
      </ReactFlowProvider>
    </div>
  );
}

export default PolyDetails;
