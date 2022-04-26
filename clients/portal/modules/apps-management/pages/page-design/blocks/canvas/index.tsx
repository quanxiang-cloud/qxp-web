import React, { useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { useDrop } from 'react-dnd';
import { toJS } from 'mobx';
import { BlockItemProps } from '@one-for-all/artery-engine';

import useObservable from '@lib/hooks/use-observable';

import { useCtx } from '../../ctx';
import { ElementInfo, BlocksCommunicationType } from '../../types';
import NodeRender from './node-render';
import NodeToolbox from './node-toolbox';
import { loadDevEnvPageArtery } from '../../utils/helpers';
import { useStyle } from '../../hooks/use-style';
import { updateBlocksCommunicationState } from '../../utils/state';

import styles from './index.m.scss';
import './style.scss';
import { initPageArtery } from '../../stores/page-helpers';

function Canvas({ schema, blocksCommunicationState$ }: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const { page } = useCtx();
  const state = useObservable<BlocksCommunicationType>(
    // @ts-ignore
    blocksCommunicationState$,
    { activeNodeID: '', menu: { currentGroupType: '', groupTypeContentPinned: false } },
  );
  const { currentGroupType = '', groupTypeContentPinned = false, pannelWith } = state.menu || {};
  const toolRef = useRef<any>();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['elem', 'source_elem'],
    drop: (item: any, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      console.log('dropped %o onto canvas: ', item);
      page.appendNode(item, null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  useEffect(() => {
    loadDevEnvPageArtery();
    // sync schema prop with store state
    schema && page.setSchema(schema as any);

    return () => page.setSchema(initPageArtery());
  }, []);

  useStyle(
    '.page-engine-layer-block:nth-child(3)',
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
  }, [toJS(page.schema.node)]);

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
    !groupTypeContentPinned && updateBlocksCommunicationState<string>({
      state: blocksCommunicationState$,
      path: 'menu.currentGroupType',
      value: '',
    });
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
