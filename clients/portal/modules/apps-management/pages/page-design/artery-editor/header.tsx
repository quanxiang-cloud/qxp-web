import React from 'react';
import cs from 'classnames';
import Icon from '@one-for-all/icon';

import { getQuery } from '@lib/utils';
import Button from '@c/button';

import { EditorMode } from './index';

type Props = {
  editorMode: EditorMode;
  onChangeMode: (mode: EditorMode) => void;
  onSave: () => void;
  onSaveAndExit: () => void;
  onGoBack: () => void;
}

function Header({ editorMode, onGoBack, onChangeMode, onSave, onSaveAndExit }: Props): JSX.Element {
  const { pageName } = getQuery<{ pageName: string }>();
  const className = cs(
    'px-20 h-44 flex items-center justify-between text-gray-900',
    'text-12 bg-white shadow-flow-header',
  );

  return (
    <div className={className}>
      <div className="font-bold flex items-center">
        <span onClick={onGoBack}>
          <Icon name="keyboard_backspace" className='mr-8 cursor-pointer' />
        </span>
        <span className='mr-4'>正在设计页面:</span>
        <span>{pageName}</span>
      </div>
      <div>
        <span
          onClick={() => onChangeMode('edit')}
          className={cs('p-8 rounded-4 cursor-pointer font-bold', {
            'bg-blue-100': editorMode === 'edit',
            'text-blue-600': editorMode === 'edit',
          })}
        >
          编辑模式
        </span>
        <span
          onClick={() => onChangeMode('preview')}
          className={cs('p-8 rounded-4 cursor-pointer font-bold', {
            'bg-blue-100': editorMode === 'preview',
            'text-blue-600': editorMode === 'preview',
          })}
        >
          预览模式
        </span>
      </div>
      <div>
        <Button iconName="save" onClick={onSave} className="mr-8">保存</Button>
        <Button iconName="save" modifier="primary" onClick={onSaveAndExit}>保存并退出</Button>
      </div>
    </div>
  );
}

export default Header;
