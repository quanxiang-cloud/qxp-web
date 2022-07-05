import React, { useRef, useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import cs from 'classnames';

import './index.scss';
import openDocsPortal from './portal';
import { closeBtn, collapseBtn, doc, expandBtn, loading, minimizeBtn, newWindowBtn } from './icons';

export type Props = {
  targetUrl: string;
  hide?: () => void;
  close?: () => void;
  maxWidth?: number;
  maxHeight?: number;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function InsideDocsPortal({
  targetUrl,
  maxWidth = 1024,
  maxHeight = 800,
  width = 400,
  height = window.innerHeight < 660 ? window.innerHeight : 660,
  close,
  className,
  style,
}: Props): JSX.Element {
  const contentIFrameRef = useRef<HTMLIFrameElement>(null);
  const rndRef = useRef<Rnd>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [minSize, setMinSize] = useState({ width: 400, height: 400 });
  const [isExpand, setIsExpand] = useState(false);
  const [isHide, setIsHide] = useState(false);
  const [isOperating, setIsOperating] = useState(false);
  const [windowStatus, setWindowStatus] = useState({
    width,
    height,
    x: window.innerWidth - width - 20,
    y: window.innerHeight - height - 20,
  });
  const [miniButtonPosition, setMiniButtonPosition] = useState<{ x: number, y: number }>({
    x: window.innerWidth - 50,
    y: window.innerHeight - 70,
  });
  const [iframeCurrUrl, setIframeCurrUrl] = useState<string>('');

  // const handleIframeBack = () => {
  //   const iframe: HTMLIFrameElement | null = contentIFrameRef.current;
  //   if (iframe && iframe.contentWindow) {
  //     iframe.contentWindow.history.back();
  //   }
  // };

  const handleExpand = (): void => {
    const { innerWidth, innerHeight } = window;
    if (rndRef) {
      if (!isExpand) {
        const x = (innerWidth - maxWidth) / 2;
        const y = maxHeight > innerHeight ? 0 : (innerHeight - maxHeight) / 2;
        const expandHeight = maxHeight > innerHeight ? innerHeight : maxHeight;
        rndRef.current?.updatePosition({ x, y });
        rndRef.current?.updateSize({
          width: maxWidth,
          height: expandHeight,
        });
        saveCurrentWindowState({ x, y, width: maxWidth, height: expandHeight });
        setIsExpand(true);
      } else {
        const x = innerWidth - width - 20;
        const y = maxHeight > innerHeight ? 0 : innerHeight - height - 20;
        const shrinkHeight = height > innerHeight ? innerHeight : height;
        rndRef.current?.updatePosition({ x, y });
        rndRef.current?.updateSize({
          width,
          height: shrinkHeight,
        });
        saveCurrentWindowState({ x, y, width, height: shrinkHeight });
        setIsExpand(false);
      }
    }
  };

  const handleClose = (): void => {
    close?.();
  };

  function saveCurrentWindowState(status: { x?: number, y?: number, width?: number, height?: number }): void {
    setWindowStatus((prevStatus) => ({ ...prevStatus, ...status }));
  }

  const toggleHide = (e: React.MouseEvent<HTMLSpanElement>): void => {
    e.stopPropagation();
    setIsHide((prevHide) => !prevHide);
    if (!isHide) {
      setMinSize({ width: 40, height: 40 });
      rndRef.current?.updateSize({ width: 40, height: 40 });
      rndRef.current?.updatePosition(miniButtonPosition);
      return;
    }
    setMinSize({ width, height });
    rndRef.current?.updateSize({ width: windowStatus.width, height: windowStatus.height });
    rndRef.current?.updatePosition({ x: windowStatus.x, y: windowStatus.y });
  };

  function onReceiveMessage(event: { data: string; }): void {
    if (event.data && typeof event.data === 'string') {
      setIframeCurrUrl(JSON.parse(event.data).url);
    }
  }

  useEffect(() => {
    const iframe: HTMLIFrameElement | null = contentIFrameRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.onload = () => {
        setIsLoading(false);
      };
    }
    // 获取iframe中文档的当前url会违反同源策略，需要使用postMassage解决
    window.addEventListener('message', onReceiveMessage, false);
  }, []);

  return (
    <Rnd
      ref={rndRef}
      className={cs('iframe-wrap', className, {
        'transition-all ease-in-out duration-300': !isOperating,
      })}
      style={style}
      minWidth={minSize.width}
      minHeight={minSize.height}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      default={{
        x: window.innerWidth - width - 20,
        y: window.innerHeight <= height ? 0 : window.innerHeight - height - 20,
        width,
        height,
      }}
      bounds="window"
      dragHandleClassName="iframe-tool-bar"
      enableResizing={!isHide}
      disableDragging={isHide}
      onResizeStart={() => {
        setIsOperating(true);
      }}

      onResizeStop={() => {
        setIsOperating(false);
        !isHide && saveCurrentWindowState({
          width: rndRef.current?.getSelfElement()?.offsetWidth || 0,
          height: rndRef.current?.getSelfElement()?.offsetHeight || 0,
        });
      }}

      onDragStart={() => {
        setIsOperating(true);
      }}

      onDragStop={(_, { x, y }) => {
        setIsOperating(false);
        if (isHide) {
          setMiniButtonPosition({ ...rndRef.current?.getDraggablePosition() || { x: 0, y: 0 } });
        } else {
          saveCurrentWindowState({
            x, y,
          });
        }
      }}
    >
      {
        isLoading && (
          <div className="iframe-loading">
            {loading}
          </div>
        )
      }
      <div className="flex flex-col items-center h-full">
        <div className={cs('iframe-tool-bar', {
          'iframe-tool-bar-hide': isHide,
          'cursor-move': !isHide,
        })}>
          <div onClick={toggleHide} className="iframe-expand-btn">
            {isHide ? doc : minimizeBtn}
          </div>
          {
            !isHide && (
              <>
                <span onClick={handleExpand} className="iframe-expand-btn">
                  {!isExpand ? expandBtn : collapseBtn}
                </span>
                <span onClick={handleClose} className="iframe-close-btn">
                  {closeBtn}
                </span>
              </>
            )
          }
        </div>
        <iframe
          ref={contentIFrameRef}
          title="iframe"
          frameBorder="0"
          src={targetUrl}
          className={cs('iframe-portal', {
            'h-0': isHide,
          })}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          scrolling="auto"
        />
        <div
          className="open-new-window"
          onClick={() => {
            iframeCurrUrl && window.open(iframeCurrUrl, '_blank');
          }}
        >
          <span>{newWindowBtn}</span>
          <span>在新窗口查看</span>
        </div>
      </div>

    </Rnd>
  );
}

InsideDocsPortal.show = openDocsPortal;
