import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';

import Editor from './editor';
import GlobalConfig from './global-config';
import Variables from './variables';

interface Props {
  currentOperateType: string;
}

export default function Content({ currentOperateType }: Props): JSX.Element {
  return (
    <main className="flex flex-1">
      {currentOperateType === 'edit' && (
        <ReactFlowProvider>
          <Editor />
        </ReactFlowProvider>
      )}
      {currentOperateType === 'settings' && (
        <GlobalConfig />
      )}
      {currentOperateType === 'variables' && (
        <Variables />
      )}
    </main>
  );
}
