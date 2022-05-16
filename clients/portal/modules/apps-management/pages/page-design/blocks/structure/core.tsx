import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { RadioButtonGroup } from '@one-for-all/ui';
import { Artery, Node } from '@one-for-all/artery';

import Outline from './outline';

type Mode = 'tree' | 'code' | string;

type Props = {
  artery: Artery;
  activeNode?: Node;
  onChange: (artery: Artery) => void;
  setActiveNode: (node?: Node) => void;
};

function PageTree({
  artery,
  activeNode,
  onChange,
  setActiveNode,
}: Props): JSX.Element {
  const [mode, setMode] = useState<Mode>('tree');

  function handleChangeNode(node: Node): void {
    onChange({ ...artery, node });
  }

  return (
    <div className="w-full h-full flex flex-col items-center overflow-hidden relative page-tree">
      <RadioButtonGroup
        listData={[
          { label: '大纲视图', value: 'tree' },
          { label: '源码视图', value: 'code' },
        ]}
        onChange={(mode) => setMode(mode as string)}
        currentValue={mode}
      />
      <div className="w-full h-full mt-10 overflow-auto">
        {mode === 'tree' && (<Outline
          node={artery.node}
          onChange={handleChangeNode}
          activeNode={activeNode}
          setActiveNode={setActiveNode}
        />)}
        {mode === 'code' && (
          <pre className='mt-8'>
            {artery.node ? JSON.stringify(artery.node, null, 2) : <p>暂无数据</p>}
          </pre>
        )}
      </div>
    </div>
  );
}

export default observer(PageTree);
