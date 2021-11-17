import React, { useRef, useCallback } from 'react';
import cs from 'classnames';
import { useKey } from 'react-use';
import { isEmpty } from 'ramda';

import Icon from '@c/icon';
import useObservable from '@lib/hooks/use-observable';

import ActionTrigger from './action/trigger';
import RightHandle from './handle/right';
import LeftHandle from './handle/left';
import BottomHandle from './handle/bottom';
import TopHandle from './handle/top';
import { isSomeActionShow } from '../utils';
import NodeRemove from './action/remove';
import { savePolyApiResult } from '../utils/build';
import InputEditor from '../components/input-editor';

export default function NodeWrapper({
  children, noPadding, selected, data, id, noBg,
}: POLY_API.NodeWrapperProps): JSX.Element | null {
  const nodeWrapperRef = useRef<HTMLElement | null>(null);
  const rightTriggerRef = useRef<HTMLDivElement | null>(null);
  const bottomTriggerRef = useRef<HTMLDivElement | null>(null);
  const titleEditorRef = useRef<HTMLInputElement | null>(null);
  const removeRef = useRef<HTMLInputElement | null>(null);
  const nodeData = useObservable<POLY_API.PolyNode>(data);

  const { handles, title } = nodeData;
  const isInput = nodeData.type === 'input';
  // const isRequest = nodeData.type === 'request';
  const isCondition = nodeData.type === 'if';
  const isEnd = nodeData.type === 'output';
  const showTitle = !isInput && !isEnd && !isCondition;
  const showBottomTrigger = !isInput && !isEnd;
  const showrightTrigger = !isEnd;

  useKey(
    (e) => e.key === 'Enter',
    () => titleEditorRef.current?.blur(),
    { target: titleEditorRef.current, event: 'keydown' },
    [titleEditorRef.current],
  );

  const handleTitleChange = useCallback((value: string) => {
    data.set('title', value.replace(/\s/g, ''));
    savePolyApiResult();
  }, [data]);

  function setSectionParentIndex(zIndex: string): void {
    if (!nodeWrapperRef.current?.parentElement) {
      return;
    }
    nodeWrapperRef.current.parentElement.style.zIndex = zIndex;
  }

  function handleMouseEnter(): void {
    if (rightTriggerRef.current) {
      rightTriggerRef.current.style.opacity = '1';
    }
    if (bottomTriggerRef.current) {
      bottomTriggerRef.current.style.opacity = '1';
    }
    if (removeRef.current) {
      removeRef.current.style.opacity = '1';
    }
    setSectionParentIndex('10');
  }

  function handleMouseLeave(): void {
    if (isSomeActionShow(nodeWrapperRef.current)) {
      return;
    }
    if (rightTriggerRef.current) {
      rightTriggerRef.current.style.opacity = '0';
    }
    if (bottomTriggerRef.current) {
      bottomTriggerRef.current.style.opacity = '0';
    }
    if (removeRef.current) {
      removeRef.current.style.opacity = '0';
    }
    !selected && setSectionParentIndex('3');
  }

  if (isEmpty(nodeData)) {
    return null;
  }

  return (
    <>
      {handles?.left && <LeftHandle id={handles.left} />}
      {handles?.top && <TopHandle id={handles.top} />}
      <section
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex items-center"
        ref={nodeWrapperRef}
      >
        <div className="flex flex-1 flex-col items-center">
          <header className="error-msg"></header>
          <footer
            style={{ maxWidth: 200 }}
            className={cs('relative flex flex-col justify-center items-center rounded-8', {
              'px-12 py-6': !noPadding,
              'bg-white': !noBg,
            })}
          >
            {showTitle && (
              <div className="py-6 px-12 bg-gray-50 flex items-center self-stretch rounded-t-8">
                <Icon className="mr-4 rounded-4" name="request-node" />
                <InputEditor
                  changeOnBlur
                  extraClassName="text-caption-no-weight font-semibold"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="请输入节点名称"
                />
              </div>
            )}
            {children}
          </footer>
          {showBottomTrigger && (
            <ActionTrigger
              ref={bottomTriggerRef}
              type="bottom"
              id={id}
              hideConditionSelect={isCondition}
            />
          )}
        </div>
        {showrightTrigger && (
          <ActionTrigger
            ref={rightTriggerRef}
            type="right"
            id={id}
            hideConditionSelect={isCondition}
          />
        )}
        {!isEnd && !isInput && <NodeRemove ref={removeRef} id={id} />}
      </section>
      {handles?.right && <RightHandle id={handles.right} />}
      {handles?.bottom && <BottomHandle id={handles.bottom} />}
    </>
  );
}
