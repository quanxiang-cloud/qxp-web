import React, { useState, useCallback, useEffect, useMemo } from 'react';

import { Tab } from '@one-for-all/ui';
import { getNodeParents } from '@one-for-all/artery-utils';
import type { BlockItemProps } from '@one-for-all/artery-engine';
import { HTMLNode, ReactComponentNode } from '@one-for-all/artery';
import Icon from '@one-for-all/icon';

import Breadcrumb from '@c/breadcrumb';
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
import { usePackagePropsSpecs } from '../fountainhead/store';
import { findNode } from './utils';

import styles from './index.m.scss';
import './style.scss';

function NodeCarve({
  artery,
  onChange,
  setActiveNode,
  activeNode,
}: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const [modalBindStateOpen, setModalBindStateOpen] = useState<boolean>(false);
  const [modalComponentNodeOpen, setModalComponentNodeOpen] = useState<boolean>(false);
  const [updateAttrPayload, setUpdateAttrPayload] = useState<UpdateAttrPayloadType | null>(null);
  const { packageName, packageVersion } = activeNode as ReactComponentNode || {};
  const packagePropsSpec = usePackagePropsSpecs({ name: packageName, version: packageVersion });

  const value = {
    artery,
    activeNode,
    rawActiveNode: activeNode ? findNode(artery.node, activeNode?.id, true) : null,
    packagePropsSpec,
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
  const getAvailablePanels = useCallback(() => {
    const panels = [
      {
        id: 'props',
        name: <ToolTip label='属性配置' position='left'>
          <Icon name='list' size={18}></Icon>
        </ToolTip>,
        content: renderPropsPanel,
      },
      {
        id: 'style-station',
        name: <ToolTip label='样式配置' position='left'>
          <Icon name='featured_video' size={18}></Icon>
        </ToolTip>,
        content: <StyleStation />,
      },
    ];

    if (isSystemComponent((activeNode as any).category)) {
      return panels;
    }

    return panels.concat([
      {
        id: 'lifecycle',
        name: <ToolTip label='生命周期' position='left'>
          <Icon name='timeline' size={18}></Icon>
        </ToolTip>,
        content: eventPanelContent,
      },
      {
        id: 'renderer',
        name: <ToolTip label='动态渲染' position='left'>
          <Icon name='dynamic_feed' size={18}></Icon>
        </ToolTip>,
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
    const rawNode = findNode(artery.node, activeNode.id, true);
    const parents = getNodeParents(artery.node, rawNode.id);
    return [...(parents || []), activeNode].slice(-3).map((node) => {
      return {
        key: node.id,
        text: node.label || (node as HTMLNode).name || '',
      };
    });
  }, [activeNode]);

  function renderCont(): JSX.Element {
    if (!activeNode) {
      return (
        <div className='flex justify-center items-center flex-col h-full'>
          <p>当前层级没有内容</p>
          <p>请在左侧画布选中其他元素</p>
        </div>
      );
    }

    return (
      <>
        <div className='px-4'>
          <Breadcrumb
            segments={segments}
            separator='>'
            segmentRender={(segment) => (
              <span
                className='text-12'
                onClick={() => {
                  const node = findNode(artery.node, segment.key);
                  node && setActiveNode(node);
                }}
              >
                {segment.text}
              </span>
            )}
          />
        </div>
        <div className={styles.curElem}>
          <span className='mr-8'>{activeNode?.label} ID: </span>
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

export default NodeCarve;
