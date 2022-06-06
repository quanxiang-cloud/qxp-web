import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Icon, Button, Tooltip, Modal } from '@one-for-all/ui';
import { ArteryRenderer } from '@one-for-all/artery-renderer';
import type { BlockItemProps } from '@one-for-all/artery-engine';

import { useCtx } from '@pageDesign/ctx';
import type { BlocksCommunicationType } from '@pageDesign/types';
import componentLoader from '@c/artery-renderer/component-loader';
import repository from '@c/artery-renderer/repository';

import styles from './style.m.scss';
import './style.scss';

const MAX_MODIFICARIONS = 15;
const Divider = (): JSX.Element => <div className='w-1 h-20 bg-gray-200 mx-16' />;

function Toolbar({
  sharedState,
  artery,
  commands,
  commandsHasNext,
  commandsHasPrev,
}: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const ctx = useCtx();
  const { page, designer } = ctx;
  const [openTestPreview, setOpenPreview] = useState(false);
  const [modifications, setModifications] = useState(0);
  const { docLink = '', hideTestPreview } = sharedState;

  useEffect(() => {
    const timer = setInterval(() => {
      !!modifications && handleSave();
    }, 30 * 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setModifications(modifications + 1);
  }, [artery]);

  useEffect(() => {
    if (modifications === MAX_MODIFICARIONS) {
      handleSave();
    }
  }, [modifications]);

  function handleSave(): void {
    ctx.onSave?.(artery);
    setModifications(0);
  }

  function saveAndExit(): void {
    handleSave();
    history.back();
  }

  function handlePreview(): void {
    const renderSchema = toJS(page.schema);
    window.__isDev__ && console.log('preview render schema: ', renderSchema);
    ctx.onSave?.(renderSchema, { draft: true, silent: true });
    // open new page
    const aElem = document.createElement('a');
    Object.assign(aElem, {
      href: location.href.replace(/\/artery-engine/, '/artery-preview'),
      rel: 'noopener noreferrer',
      target: '_blank',
    });
    aElem.click();
  }

  function rendeArtery(): JSX.Element {
    const artery = toJS(page.schema);
    window.__isDev__ && console.log('preview page artery: ', artery);

    return (
      <ArteryRenderer
        artery={artery as any}
        plugins={{ componentLoader, repository }}
      />
    );
  }

  function handleRedo(): void {
    commands?.redo();
  }

  function handleUndo(): void {
    commands?.undo();
  }

  return (
    <div className={cs('bg-gray-50 h-44 flex justify-between items-center px-16', styles.toolbar)}>
      <div className={styles.brand}>{designer.vdoms.title}</div>
      <div className={cs('flex items-center', styles.actions)}>
        <Tooltip position='top' label='撤销'>
          <Icon
            name='undo'
            className='mr-16'
            clickable={commandsHasPrev}
            disabled={!commandsHasPrev}
            onClick={handleUndo}
          />
        </Tooltip>
        <Tooltip position='top' label='重做'>
          <Icon
            name='redo'
            clickable={commandsHasNext}
            disabled={!commandsHasNext}
            onClick={handleRedo}
          />
        </Tooltip>
        <Divider />
        <Tooltip position='top' label='点击前往查看如何使用页面设计器'>
          <a
            href={docLink}
            target='_blank'
            rel="noopener noreferrer"
          >
            <Icon name='help_doc' color='gray' clickable />
          </a>
        </Tooltip>
        {window.__isDev__ && !hideTestPreview && (
          <>
            <Divider />
            <Tooltip position='top' label='测试预览'>
              <Icon name='eye-open' color='gray' clickable onClick={() => setOpenPreview(true)} />
            </Tooltip>
          </>
        )}
        <Divider />
        <Button iconName='preview' onClick={handlePreview}>预览</Button>
        <Divider />
        <Button iconName='save' modifier='primary' onClick={handleSave} className={styles.btnSave}>保存</Button>
        <Button iconName='save' modifier='primary' onClick={saveAndExit}>保存并退出</Button>
      </div>
      {openTestPreview && (
        <Modal
          title='测试预览'
          onClose={() => setOpenPreview(false)}
          fullscreen
        >
          {rendeArtery()}
        </Modal>
      )}
    </div>
  );
}

export default observer(Toolbar);
