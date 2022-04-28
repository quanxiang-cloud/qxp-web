import React, { useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { useDrop } from 'react-dnd';
import { BlockItemProps } from '@one-for-all/artery-engine';

import { useCtx } from '@pageDesign/ctx';
import { ElementInfo, BlocksCommunicationType } from '@pageDesign/types';
import { loadDevEnvPageArtery } from '@pageDesign/utils/helpers';
import { useStyle } from '@pageDesign/hooks/use-style';
import { initPageArtery } from '@pageDesign/stores/page-helpers';

import NodeRender from './node-render';
import NodeToolbox from './node-toolbox';

import styles from './index.m.scss';
import './style.scss';

import { findNodeByID } from '@one-for-all/artery-utils';

function Canvas(props: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const { artery, sharedState, onSharedStateChange, setActiveNode } = props;
  const { page } = useCtx();
  const { currentGroupType = '', groupTypeContentPinned = false, pannelWith } = sharedState.menu ?? {};
  const toolRef = useRef<any>();

  const [, drop] = useDrop(() => ({
    accept: ['elem', 'source_elem'],
    drop: (item: any, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      page.appendNode(item, null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  useEffect(() => {
    loadDevEnvPageArtery();
    // sync schema prop with store state
    artery && page.setSchema(artery as any);
    return () => page.setSchema(initPageArtery());
  }, []);

  useStyle(
    '.artery-engine-layer-block:nth-child(3)',
    useMemo(
      () => ({
        overflow: 'hidden',
        paddingBottom: '10px',
        transition: 'all .3s linear',
        paddingLeft: currentGroupType ? `${pannelWith}px` : '0px',
      }),
      [currentGroupType],
    ),
  );

  useLayoutEffect(() => {
    // get all elems on page
    const root = document.querySelector('.pge-canvas') as HTMLDivElement;
    const _rootChildren = Array.from(root.children || []);
    const elementMap: any = {};
    handleEle(_rootChildren, elementMap);
    page.setSchemaElements(elementMap);

    toolRef.current.computedPlace();
  }, [page.schema.node]);

  function handleEle(elements: Element[], newElements: Record<string, ElementInfo>): void {
    elements.map((element: Element) => {
      const nodeKey = element.getAttribute('data-node-key');
      const _children = Array.from(element.children);
      if (nodeKey) {
        newElements[nodeKey] = {
          element,
          position: element.getBoundingClientRect(),
        };
      }
      if (_children.length > 0) {
        handleEle(_children, newElements);
      }
    });
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    e.stopPropagation(); // Onclick event of inner element
    e.preventDefault(); // Default behavior of the link component

    // get event target's closest parent with attribute data-node-key
    // because some elem may has children, like container
    const nodeKey = (e.target as Element)?.closest('[data-node-key]')?.getAttribute('data-node-key') || '';
    nodeKey && page.setActiveElemId(nodeKey);
    !groupTypeContentPinned && onSharedStateChange('menu.currentGroupType', '');
    setActiveNode(findNodeByID(artery.node, nodeKey));
  }

  return (
    <div
      className={cs('relative pge-canvas my-3 w-full bg-white overflow-auto h-full', styles.page)}
      onClick={handleClick}
      ref={drop}
    >
      <NodeRender schema={page.schema.node} />
      <NodeToolbox
        ref={toolRef}
        currentGroupType={currentGroupType}
        groupTypeContentPinned={groupTypeContentPinned}
      />
    </div>
  );
}

export default observer(Canvas);
