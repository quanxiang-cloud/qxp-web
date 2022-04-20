import React, { useState, useRef, useEffect } from 'react';
import cs from 'classnames';

import { DirectoryChild, CollectionState, PathType } from '@lib/api-collection';
import { isApi } from '@lib/api-collection/utils';
import Search from '@c/search';
import TwoLevelMenu, { NodeItem } from '@c/two-level-menu';
import { findFirstLeafNode } from '@c/two-level-menu/utils';

import { createMenus, filterMenusByKeyWord, sortMenusByOrder, concatApiDataList } from './utils';

interface Props {
  collectionValue: CollectionState;
  className?: string;
  hideTitle?: boolean;
  onSelectNode?: (node: NodeItem<any> | undefined) => void;
  onGetApiList?: (directoryPath: string, pathType?: PathType ) => void;
}

function DocumentNav({ collectionValue, className, hideTitle, onSelectNode, onGetApiList }: Props): JSX.Element {
  const [keyWord, setKeyWord] = useState('');
  const [menus, setMenus] = useState<NodeItem<DirectoryChild>[]>([]);
  const canReselected = useRef(true);

  useEffect(() => {
    let currentMenus = createMenus(concatApiDataList(collectionValue.apiDataList), true);
    currentMenus = sortMenusByOrder(filterMenusByKeyWord(currentMenus, keyWord));
    reselected(currentMenus);
    setMenus(currentMenus);
  }, [collectionValue, keyWord]);

  const reselected = (menus: NodeItem<DirectoryChild>[]): void => {
    if (!canReselected.current) return;
    const menu = findFirstLeafNode(menus);
    if (menu) {
      onSelectNode?.(menu);
      canReselected.current = false;
    } else {
      onSelectNode?.(undefined);
    }
  };

  const changeKeyWord = (keyWord: string): void => {
    setKeyWord(keyWord);
    if (!keyWord) return;
    canReselected.current = true;
  };

  const handleSelect = (node: NodeItem<DirectoryChild>): void => {
    if (node.leafIsApi && node.source && !isApi(node.source) && (!node.children || !node.children.length)) {
      const { parent, name, pathType } = node.source;
      onGetApiList?.(`${parent}/${name}`, pathType);
    }
    if (!node.disableSelect) {
      onSelectNode?.(node);
    }
  };

  return (
    <div className={cs('api-doc-details-nav rounded-tl-12 flex flex-col', className)}>
      {!hideTitle && <div className='h-44 text-gray-400 text-14 font-semibold flex items-center pl-16'>API文档</div>}
      <Search
        className="mx-8 mb-8 text-12"
        placeholder="输入目录名称..."
        onChange={changeKeyWord}
      />
      <TwoLevelMenu<any>
        menus={menus}
        style={{
          height: 'calc(100% - 76px)',
        }}
        onSelect={handleSelect}
      />
    </div>
  );
}

export default DocumentNav;
