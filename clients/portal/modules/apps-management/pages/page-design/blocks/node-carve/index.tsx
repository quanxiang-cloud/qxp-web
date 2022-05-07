import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { BlockItemProps } from '@one-for-all/artery-engine';
import type { BlocksCommunicationType } from '@pageDesign/types';

import { Tab } from '@one-for-all/ui';
import { findNodeByID, getNodeParents } from '@one-for-all/artery-utils';

import { ConfigContext, NodeAttrType } from './context';
import PropsPanel from './props-panel';
import StylePanel from './style-panel';
import EventPanel from './event-panel';
import RendererPanel from './renderer-panel';
import ModalBindState from './modal-bind-state';
import ModalComponentNode from './modal-component-node';

import styles from './index.m.scss';
import './style.scss';
import { isSystemComponent } from '../../utils/helpers';
import { findNode } from './utils/tree';

function SettingPanel({
  artery,
  onChange,
  activeNode,
}: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const [modalBindStateOpen, setModalBindStateOpen] = useState<boolean>(false);
  const [modalComponentNodeOpen, setModalComponentNodeOpen] = useState<boolean>(false);
  const [nodeAttr, setNodeAttr] = useState<NodeAttrType | null>(null);

  const value = {
    nodeAttr,
    artery,
    activeNode,
    rawActiveNode: activeNode ? findNode(artery.node, activeNode?.id, true) : null,
    setNodeAttr,
    setModalBindStateOpen,
    setModalComponentNodeOpen,
    onArteryChange: onChange,
  };

  const [activePanel, setActivePanel] = useState<string>('props');
  const eventPanelContent = useMemo(() => <EventPanel />, []);
  const rendererPanelContent = useMemo(() => <RendererPanel />, []);
  const renderPropsPanel = useMemo(() => <PropsPanel />, []);
  const getAvailablePanels = useCallback(() => {
    const panels = [
      {
        id: 'props',
        name: '属性',
        content: renderPropsPanel,
      },
      {
        id: 'style',
        name: '样式',
        content: <StylePanel />,
      },
    ];

    if (isSystemComponent((activeNode as any).category)) {
      return panels;
    }

    return panels.concat([
      {
        id: 'event',
        name: '生命周期',
        content: eventPanelContent,
      },
      {
        id: 'renderer',
        name: '动态渲染',
        content: rendererPanelContent,
      },
    ]);
  }, [activeNode]);

  useEffect(() => {
    setActivePanel('props');
  }, [activeNode]);

  const segments = useMemo(() => {
    if (!activeNode) {
      return [];
    }
    const node = findNodeByID(artery.node, activeNode.id);
    console.log(node);
    const parents = getNodeParents(artery.node, activeNode.id);
    console.log(parents);
  }, [activeNode]);

  function renderCont(): JSX.Element {
    if (!activeNode) {
      return (
        <div className="flex justify-center items-center flex-col h-full">
          <p>当前层级没有内容</p>
          <p>请在左侧画布选中其他元素</p>
        </div>
      );
    }

    return (
      <>
        <div className={styles.curElem}>
          <span className="mr-8">{activeNode?.label} ID: </span>
          <span>{activeNode?.id}</span>
        </div>
        <Tab
          className={styles.tabs}
          contentClassName={styles.tabCont}
          navsClassName={styles.tabNav}
          navTitleClassName='node-crave-tab-nav-title'
          items={getAvailablePanels()}
          currentKey={activePanel}
          onChange={setActivePanel}
        />
      </>
    );
  }

  return (
    <ConfigContext.Provider value={value}>
      <div className={styles.panel}>
        {renderCont()}
        {modalBindStateOpen && <ModalBindState />}
        {modalComponentNodeOpen && <ModalComponentNode />}
      </div>
    </ConfigContext.Provider>
  );
}

export default SettingPanel;
