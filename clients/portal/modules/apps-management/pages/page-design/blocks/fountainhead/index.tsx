import React, { useCallback, useContext, useEffect } from 'react';
import { Panel } from '@one-for-all/ui';
import { and, mergeRight, when } from 'ramda';
import { BlockItemProps } from '@one-for-all/artery-engine';
import type { Node } from '@one-for-all/artery';
import { appendChild, insertAfter } from '@one-for-all/artery-utils';

import type { BlocksCommunicationType } from '@pageDesign/types';
import { GROUP_TITLE_MAP } from '@pageDesign/constants';
import { useMenuPanel } from '@pageDesign/hooks';

import Core from './core';
import { FountainheadContextProvider } from './context';
import FountainContext from '../../fountain-context';

const Fountainhead = (props: BlockItemProps<BlocksCommunicationType>): JSX.Element => {
  const { activeNode, artery, onChange } = props;
  const { getNodePropsSpec } = useContext(FountainContext);

  const { ref, currentType, onClose, onPin, pinned, onSharedStateChange, visible, panelWidth, onForceClose } =
    useMenuPanel(mergeRight(props, { type: 'fountainhead' }));

  useEffect(() => {
    const resetWrapperVisibility = (): string => (ref.current!.style.visibility = 'visible');
    when(
      (el) => and(and(currentType !== 'fountainhead', !!el), !pinned),
      () => setTimeout(resetWrapperVisibility, 300),
    )(ref.current);
  }, [currentType, pinned]);

  const onHide = useCallback((): void => {
    if (ref.current && !pinned) {
      ref.current.style.visibility = 'hidden';
    }
  }, [pinned]);

  const onAddNode = useCallback(
    (newNode: Node): void => {
      if (
        (newNode.type !== 'html-element' && newNode.type !== 'react-component') ||
        !activeNode ||
        (activeNode.type !== 'html-element' && activeNode.type !== 'react-component')
      ) {
        return;
      }

      !pinned && onSharedStateChange('menu.currentType', '');

      const { isContainer } = getNodePropsSpec(activeNode) || {};
      let newRootNode: Node | undefined;
      if (isContainer) {
        newRootNode = appendChild(artery.node, activeNode.id, newNode);
      } else {
        newRootNode = insertAfter(artery.node, activeNode.id, newNode);
      }

      if (newRootNode) {
        onChange({ ...artery, node: newRootNode });
      }
    },
    [pinned, onSharedStateChange, onChange, artery, activeNode],
  );

  return (
    <div ref={ref} style={{ pointerEvents: 'auto' }}>
      <Panel
        pinnable
        closable
        title={GROUP_TITLE_MAP[currentType ?? '']}
        onClose={onForceClose}
        onPin={onPin}
        visible={visible}
        pinned={pinned}
        width={panelWidth}
      >
        <FountainheadContextProvider onPanelHide={onHide} onPanelClose={onClose}>
          <Core onAddNode={onAddNode} />
        </FountainheadContextProvider>
      </Panel>
    </div>
  );
};

export default Fountainhead;
