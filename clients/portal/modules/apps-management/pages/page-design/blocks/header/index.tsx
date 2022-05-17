import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { toJS, reaction } from 'mobx';
import { Icon, Button, Tooltip, Modal } from '@one-for-all/ui';
import { ArteryRenderer } from '@one-for-all/artery-renderer';
import type { BlockItemProps } from '@one-for-all/artery-engine';

import { useCtx } from '@pageDesign/ctx';
import type { BlocksCommunicationType } from '@pageDesign/types';
import componentLoader from '@c/artery-renderer/component-loader';
import repository from '@c/artery-renderer/repository';

import styles from './style.m.scss';
import './style.scss';

const Divider = (): JSX.Element => <div className='w-1 h-20 bg-gray-200 mx-16' />;
const historySizeLimit = 50;

function Toolbar({ sharedState, artery }: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const ctx = useCtx();
  const { page, designer } = ctx;
  const [openTestPreview, setOpenPreview] = useState(false);
  const [historyList, setHistoryList] = useState<string[]>([]); // page schema history
  const [hisIdx, setHisIdx] = useState(0); // history queue index
  const { docLink = '', hideTestPreview } = sharedState;

  useEffect(()=> {
    const dispose = reaction(()=> JSON.stringify(toJS(page.schema)), (schema)=> {
      setHistoryList((prevHis)=> {
        if (prevHis[0] === schema) {
          // no need put new layer
          return prevHis;
        }
        if (prevHis.length === historySizeLimit) {
          return [schema, ...prevHis.slice(0, -1)];
        }
        return [schema, ...prevHis];
      });
      // setHisIdx(0); // when add history layer, reset idx
    });

    return dispose;
  }, []);

  function handleSave(): void {
    ctx.onSave?.(artery);
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

  function canUndo(): boolean {
    return historyList.length > 1 && hisIdx < historyList.length - 1;
  }

  function canRedo(): boolean {
    return historyList.length > 1 && hisIdx > 0 && hisIdx < historyList.length;
  }

  function handleRedo(): void {
    setHisIdx((prevIdx)=> {
      const curIdx = prevIdx > 0 ? prevIdx - 1 : 0;
      if (prevIdx !== curIdx) {
        page.setSchema(JSON.parse(historyList[curIdx]));
      }
      return curIdx;
    });
  }

  function handleUndo(): void {
    setHisIdx((prevIdx)=> {
      const curIdx = prevIdx < historyList.length - 1 ? prevIdx + 1 : historyList.length - 1;
      if (prevIdx !== curIdx && curIdx > 0) {
        page.setSchema(JSON.parse(historyList[curIdx]));
      }
      return curIdx;
    });
  }

  return (
    <div className={cs('bg-gray-50 h-44 flex justify-between items-center px-16', styles.toolbar)}>
      <div className={styles.brand}>{designer.vdoms.title}</div>
      <div className={cs('flex items-center', styles.actions)}>
        <Tooltip position='top' label='撤销'>
          <Icon
            name='undo'
            className='mr-16'
            clickable={canUndo()}
            disabled={!canUndo()}
            onClick={handleUndo}
          />
        </Tooltip>
        <Tooltip position='top' label='重做'>
          <Icon
            name='redo'
            clickable={canRedo()}
            disabled={!canRedo()}
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
            <Icon name='help_doc' color='gray' clickable/>
          </a>
        </Tooltip>
        {window.__isDev__ && !hideTestPreview && (
          <>
            <Divider />
            <Tooltip position='top' label='测试预览'>
              <Icon name='eye-open' color='gray' clickable onClick={()=> setOpenPreview(true)}/>
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
          onClose={()=> setOpenPreview(false)}
          fullscreen
        >
          {rendeArtery()}
        </Modal>
      )}
    </div>
  );
}

export default observer(Toolbar);
