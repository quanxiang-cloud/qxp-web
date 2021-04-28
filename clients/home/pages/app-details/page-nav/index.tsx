import React, { useCallback } from 'react';
import { observer } from 'mobx-react';

import PageLoading from '@appC/page-loading';
import Tree from '@c/headless-tree';

import PageItem from './page-item';
import store from '../../store';
import './index.scss';

function PageNav() {
  const { treeStore, setCurPage } = store;

  const onSelect = (pageNode: PageInfo) => {
    if (pageNode.menuType === 1) {
      return;
    }

    setCurPage(pageNode);
  };

  const PageItemRender = useCallback((props) => {
    return (<PageItem {...props} />);
  }, []);

  if (!treeStore) {
    return <div className='app-details-nav'><PageLoading /></div>;
  }

  return (
    <div className='app-details-nav'>
      <div className='app-page-tree-wrapper'>
        <Tree
          hideRootNode
          nodeDraggable={(): boolean => false}
          store={treeStore}
          canDropOn={(): boolean => false}
          NodeRender={PageItemRender}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}

export default observer(PageNav);
