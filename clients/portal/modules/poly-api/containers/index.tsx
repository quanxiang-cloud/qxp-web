import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { ReactFlowProvider } from 'react-flow-renderer';

import Loading from '@c/loading';

import PolyDetailsHeader from './header';
import PolyDetailsDesigner from './designer';
import NodeConfigDrawer from './node-config';
import { useQueryPolyInfo } from '../effects/api/poly';
import store$ from '../store';

function PolyDetails(): JSX.Element {
  const { appID, polyFullPath } = useParams<POLY_API.PolyParams>();
  const { data, isLoading } = useQueryPolyInfo({ path: polyFullPath }, { enabled: !!polyFullPath });

  useEffect(() => {
    if (!data) {
      return;
    }
    store$.set('polyInfo', data);
  }, [appID, polyFullPath, data]);

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
