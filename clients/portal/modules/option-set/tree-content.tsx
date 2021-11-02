import React, { useState } from 'react';
import { get } from 'lodash';
import cs from 'classnames';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import toast from '@lib/toast';
import RemoveOptionSetItems from './option-set-popconfirm/remove-items';
import AddOptionSetItem from './option-set-popconfirm/add-item';
import EditOptionSetItem from './option-set-popconfirm/edit-item';
import DeleteOptionSetItem from './option-set-popconfirm/delete-item';

import store from './store';

import './index.scss';

interface Props {
  className?: string;
}

function TreeContent({ className }: Props): JSX.Element {
  const { tree, path } = store;
  const [addLevel, setAddLevel] = useState(false);

  const levels = path.split('.');
  const levelHighLight = levels.map((itm) => {
    const idx = itm.indexOf('[') + 1;
    return itm.slice(idx, -1);
  });

  function getNodePath(prefix: string, idx: number): string {
    /*
      level-0: path=[1]
      level-1: path=[0].children[1]
      level-2: path=[0].children[1].children[2]
     */
    if (!prefix) {
      return `[${idx}]`;
    }
    return `${prefix}.children[${idx}]`;
  }

  function getLevelFromPrefix(prefix: string): number {
    if (!prefix) {
      return 0;
    }
    return prefix.split('.').length;
  }

  function getZhCNLevel(level: number): string {
    switch (level) {
    case 0:
      return '一';
    case 1:
      return '二';
    case 2:
      return '三';
    case 3:
      return '四';
    default:
      return '';
    }
  }

  function renderTree(treeItems: OptionSetTreeItem[], prefix: string): JSX.Element | undefined {
    const level = getLevelFromPrefix(prefix);
    const zhCNLevel = getZhCNLevel(level);
    if (level > 3) return;
    return (
      <div
        key={prefix}
        className={cs(
          'flex flex-col option-set-item h-full rounded-lg box-border text-blueGray-400',
          { 'border-r-1': level !== 3 })
        }>
        <div className={cs('flex flex-row items-center bg-gray-100', { 'rounded-tl-8': level === 0 }) }>
          <span className='pl-16 py-8 w-5/6'>
            {zhCNLevel}级可选项
          </span>
          <RemoveOptionSetItems zhCNLevel={zhCNLevel} prefix={prefix}/>
        </div>
        <AddOptionSetItem type='tree' prefix={prefix} />
        {treeItems &&
            treeItems.map((itm, idx) => {
              const nodePath = getNodePath(prefix, idx);
              return (
                <div
                  className={
                    cs('flex pl-16 py-8 hover:bg-blue-100 cursor-pointer action-shows action-to-shows',
                      { 'bg-blue-100': idx.toString() === levelHighLight[level] },
                    )}
                  key={[nodePath, idx].join('--')}
                  data-path={nodePath}
                  data-idx={idx}
                >
                  <span
                    title={itm.label}
                    className='w-2/3 items-center text-gray-900 overflow-hidden overflow-ellipsis whitespace-nowrap flex-1'
                    onClick={() => {
                      store.path = nodePath;
                      setAddLevel(false);
                    }}
                  >
                    {itm.label}
                  </span>
                  <div className='flex action-show'>
                    <EditOptionSetItem type='tree' label={itm.label} nodePath={nodePath} />
                    <DeleteOptionSetItem type='tree' nodePath={nodePath} prefix={prefix} />
                  </div>
                  {Array.isArray(itm.children) && !!itm.children.length && (
                    <span className="action-to-show">
                      <Icon name="keyboard_arrow_right" size={20}/>
                    </span>
                  )}
                </div>
              );
            })}
      </div>
    );
  }

  function additionalItem(level: number): JSX.Element | undefined {
    if (level > 2) return;
    return (
      <div className='flex flex-col flex-1 option-set-item h-full text-blueGray-400 rounded-lg box-border'>
        <div
          className='option-set-add-item flex items-center bg-gray-100'
          onClick={() => {
            setAddLevel(true);
          }}
        >
          { addLevel ?
            (<span className='pl-12 py-8 option-set-item border-r-1'>
              {getZhCNLevel(level + 1)}级可选项
            </span>) :
            (<span
              className='pl-16 py-8 w-5/6 hover:text-blue-600 cursor-pointer option-set-item border-r-1'
            >
              <Icon name='add' size={20} className='mr-4 pb-3 text-current' />
              添加分级
            </span>)
          }
        </div>
        <div className='flex h-full option-set-item border-r-1'>
          {addLevel && (
            <span
              className='option-set-add-alert option-set-item pl-12 py-8 mt-8 cursor-pointer'
              onClick={() => {
                toast.error('请先选择一个左侧的上级数据。');
              }}
            >
              <Icon name='add' size={20} className='items-center pb-3 text-current'/>
              <span className='ml-8'>
                添加选项数据
              </span>
            </span>
          )}
        </div>
      </div>
    );
  }

  if (!levels[0]) {
    return (
      <div className='tree-content flex h-full overflow-auto mx-16'>
        {renderTree(tree, path)}
        {additionalItem(getLevelFromPrefix(path))}
      </div>
    );
  } else {
    const levelPath = [];
    for (let i = 0; i < levels.length; i = i + 1) {
      if (!i) {
        levelPath.push(levels[0]);
      } else {
        levelPath.push(levels.slice(0, i + 1).join('.'));
      }
    }

    return (
      <>
        {getLevelFromPrefix(path) > 2 && (
          <div className='dataset-alert mx-16 items-center bg-blue-100 text-blueGray-400 py-12 pl-16 mb-8'>
            <Icon name='info' type='primary' className='mb-2' />
            <span className='ml-16 text-blue-600'>可选项仅支持添加 4 级。</span>
          </div>
        )}
        <div className='tree-content flex h-full overflow-auto mx-16 text-blueGray-400'>
          <div className={cs('flex', { 'w-full': getLevelFromPrefix(path) < 2 })}>
            <div className={cs('flex h-full rounded-lg', className)}>
              {renderTree(tree, '')}
              {
                levelPath.map((itm) => {
                  return renderTree(get(tree, itm)?.children, itm);
                })
              }
            </div>
            {additionalItem(getLevelFromPrefix(path))}
          </div>
        </div>
      </>
    );
  }
}

export default observer(TreeContent);
