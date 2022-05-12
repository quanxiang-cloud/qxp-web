import React, { ChangeEvent } from 'react';
import cs from 'classnames';

import Checkbox from '@c/checkbox';
import { NodeRenderProps } from '@c/headless-tree/types';

import { onChangeFieldState } from './store';

type Props = NodeRenderProps<SwagField> & {
  isAll: boolean;
  type?: string;
}

function FieldRender({ node, store, isAll, type = 'output' }: Props): JSX.Element {
  const nodeLabel = node.data.title || node.name || node.id || '';
  const required = node.data.must || false;

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    onChangeFieldState(node, store, e.target.checked);
  }

  const INIT_WIDTH = 142;
  const PLACEHODER_WIDTH = 16;
  const level = node.isLeaf ? node.level - 1 : node.level;
  const checkboxWidth = INIT_WIDTH - (level * PLACEHODER_WIDTH);

  return (
    <div className='flex justify-end w-full'>
      <div className='pl-4' style={{ width: `${checkboxWidth}px` }}>
        <Checkbox
          key={node.id}
          disabled={isAll || required}
          checked={node.data?.acceptable || isAll || required || false}
          onChange={onChange}
        />
      </div>
      <div className={cs(
        'flex-1 overflow-auto grid gap-x-16 grid-flow-row-dense',
        type === 'output' ? 'grid-cols-3' : 'grid-cols-4',
      )}>
        <div className='truncate'>{nodeLabel}</div>
        <div className='truncate'>{node.id || ''}</div>
        <div className='truncate'>{node.data.type}</div>
        {type === 'input' && (<div>{node.data?.in || 'body'}</div>)}
      </div>
    </div>
  );
}

export default FieldRender;
