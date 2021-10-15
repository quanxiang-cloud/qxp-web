import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';

import PolyDetailsHeader from './header';
import PolyDetailsDesigner from './designer';

function PolyDetails(): JSX.Element {
  return (
    <div className="flex flex-col flex-nowrap h-screen items-center">
      <ReactFlowProvider>
        <PolyDetailsHeader className="h-48 w-full bg-white" />
        <PolyDetailsDesigner className="flex-1 w-full" />
      </ReactFlowProvider>
    </div>
  );
}

export default PolyDetails;
