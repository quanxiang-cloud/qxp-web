import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { ReactFlowProvider, isNode } from 'react-flow-renderer';

import Loading from '@c/loading';
import toast from '@lib/toast';

import PolyDetailsHeader from './header';
import PolyDetailsDesigner from './designer';
import NodeConfigDrawer from './node-config';
import { useQueryPolyInfo } from '../effects/api/poly';
import store$ from '../store';
import PolyNodeStore from '../store/node';

function PolyDetails(): JSX.Element {
  const { polyFullPath } = useParams<POLY_API.PolyParams>();
  const { data, isLoading } = useQueryPolyInfo({ path: polyFullPath }, { enabled: !!polyFullPath });

  useEffect(() => {
    if (!data) {
      return;
    }
    const { arrange } = data;
    try {
      const arrangeResult = JSON.parse(arrange);
      const { nodes, ...attrs } = arrangeResult;
      nodes?.length && store$.value.nodes.set(nodes.map((node: POLY_API.PlainElement | void) => {
        if (!node) {
          return false;
        }
        if (isNode(node) && node.data) {
          Object.assign(node, { data: new PolyNodeStore(node.data) });
        }
        return node as unknown as POLY_API.Element;
      }).filter(Boolean));
      store$.update(attrs);
      store$.set('polyInfo', data);
    } catch (e) {
      console.error(e);
      toast.error('获取编排信息失败');
    }
  }, [polyFullPath, data]);

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
        <PolyDetailsDesigner className="flex-1 w-full" />
        <NodeConfigDrawer />
      </ReactFlowProvider>
    </div>
  );
}

export default PolyDetails;
