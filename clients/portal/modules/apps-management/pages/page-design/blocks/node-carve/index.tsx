import React, { useState, useEffect, useMemo } from 'react';

import { Tab } from '@one-for-all/ui';
import type { BlockItemProps } from '@one-for-all/artery-engine';
import Icon from '@one-for-all/icon';

import ToolTip from '@c/tooltip';
import type { BlocksCommunicationType } from '@pageDesign/types';

import { ConfigContext, UpdateAttrPayloadType } from './context';
import PropsPanel from './props-panel';
import StyleStation from './style-station';
import EventPanel from './event-panel';
import RendererPanel from './renderer-panel';
import ModalBindState from './modal-bind-state';
import ModalComponentNode from './modal-component-node';
import { isSystemComponent } from '../../utils/helpers';
import { findNode } from './utils';

import styles from './index.m.scss';
import './style.scss';

function NodeCarve({
  artery,
  onChange,
  activeNode,
}: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const [modalBindStateOpen, setModalBindStateOpen] = useState<boolean>(false);
  const [modalComponentNodeOpen, setModalComponentNodeOpen] = useState<boolean>(false);
  const [updateAttrPayload, setUpdateAttrPayload] = useState<UpdateAttrPayloadType | null>(null);

  const value = {
    artery,
    activeNode,
    rawActiveNode: activeNode ? findNode(artery.node, activeNode?.id, true) : null,
    updateAttrPayload,
    setUpdateAttrPayload,
    setModalBindStateOpen,
    setModalComponentNodeOpen,
    onArteryChange: onChange,
  };

  const [activePanel, setActivePanel] = useState<string>('props');
  const eventPanelContent = useMemo(() => <EventPanel />, []);
  const rendererPanelContent = useMemo(() => <RendererPanel />, []);
  const renderPropsPanel = useMemo(() => <PropsPanel />, []);
  const styleStationPanel = useMemo(() => <StyleStation />, []);
  const availablePanels = useMemo(() => {
    const panels = [
      {
        id: 'props',
        name: (
          <ToolTip label="属性配置" position="left">
            <Icon name="list" size={18}></Icon>
          </ToolTip>
        ),
        content: renderPropsPanel,
      },
      {
        id: 'style-station',
        name: (
          <ToolTip label="样式配置" position="left">
            <Icon name="featured_video" size={18}></Icon>
          </ToolTip>
        ),
        content: styleStationPanel,
      },
    ];

    if (activeNode && isSystemComponent((activeNode as any).category)) {
      return panels;
    }

    return panels.concat([
      {
        id: 'lifecycle',
        name: (
          <ToolTip label="生命周期" position="left">
            <Icon name="timeline" size={18}></Icon>
          </ToolTip>
        ),
        content: eventPanelContent,
      },
      {
        id: 'renderer',
        name: (
          <ToolTip label="动态渲染" position="left">
            <Icon name="dynamic_feed" size={18}></Icon>
          </ToolTip>
        ),
        content: rendererPanelContent,
      },
    ]);
  }, [activeNode]);

  useEffect(() => {
    const HasPanelIds = availablePanels.some((p) => p.id === activePanel);
    if (!HasPanelIds) {
      setActivePanel(availablePanels[0]?.id);
    }
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
          navTitleClassName="node-crave-tab-nav-title"
          items={availablePanels}
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

export default NodeCarve;
