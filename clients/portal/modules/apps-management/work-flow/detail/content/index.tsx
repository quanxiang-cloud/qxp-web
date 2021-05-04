import React from 'react';

import Editor from './editor';
import GlobalConfig from './global-config';
import Variables from './variables';

interface Props {
  currentOperateType: string;
}

export default function Content({ currentOperateType }: Props) {
  return (
    <main className="flex flex-1">
      {currentOperateType === 'edit' && (
        <Editor />
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
