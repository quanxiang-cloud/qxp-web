import React from 'react';

import Editor from './editor';

interface Props {
  currentOperateType: string;
}

export default function Content({ currentOperateType }: Props) {
  return (
    <main className="flex flex-1">
      {currentOperateType === 'edit' && (
        <Editor />
      )}
    </main>
  );
}
