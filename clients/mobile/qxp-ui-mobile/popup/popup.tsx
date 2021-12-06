import React, {
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { PopupProps } from './types';
import { isDef } from '@m/qxp-ui-mobile/utils';
import useSsrCompat from '@m/qxp-ui-mobile/utils/hooks/use-ssr-compat';
import { callInterceptor, GetContainer, renderToContainer } from '@m/qxp-ui-mobile/utils/dom';
import PopupContext from './context';
import { CSSTransition } from 'react-transition-group';
import Overlay from '@m/qxp-ui-mobile/overlay';
import Icon from '@m/qxp-ui-mobile/icon';
import cs from 'classnames';
import useEventListener from '@m/qxp-ui-mobile/utils/hooks/use-event-listener';
import { getZIndexStyle } from '@m/qxp-ui-mobile/utils/format/unit';

let globalZIndex = 2000;

const Popup = (
  props: React.PropsWithChildren<PopupProps>,
  ref: React.ForwardedRef<HTMLDivElement>): JSX.Element => {
  const {
    round,
    visible,
    title,
    children,
    duration = 300,
    overlay = true,
    lockScroll = true,
    position = 'center',
    closeIcon,
    closeIconPosition = 'top-right',
    closeIconSize = '.24rem',
    closeOnClickOverlay = true,
    teleport = () => document.body,
  } = props;
  const opened = useRef(false);
  const zIndex = useRef<number>(props.zIndex ?? globalZIndex);
  const popupRef = useRef<HTMLDivElement>();
  const [animatedVisible, setAnimatedVisible] = useState(visible);
  const [ssrCompatRender, rendered] = useSsrCompat();

  const style = useMemo(() => {
    const initStyle = getZIndexStyle(zIndex.current, props.style);

    if (isDef(duration)) {
      const key = position === 'center' ? 'animationDuration' : 'transitionDuration';
      initStyle[key] = `${duration}ms`;
    }
    return initStyle;
  }, [zIndex.current, props.style, duration]);

  const open = (): void => {
    if (props.zIndex !== undefined) {
      zIndex.current = +props.zIndex;
    } else {
      globalZIndex += 1;
      zIndex.current = globalZIndex;
    }

    opened.current = true;
    props.onOpen?.();
  };

  const close = (): void => {
    if (opened.current) {
      callInterceptor({
        interceptor: props.beforeClose,
        args: ['close'],
        done: () => {
          opened.current = false;
          props.onClose?.();
        },
      });
    }
  };

  const onClickOverlay = (event: React.MouseEvent): void => {
    props.onClickOverlay?.(event);

    if (closeOnClickOverlay) {
      close();
    }
  };

  const renderOverlay = (): JSX.Element | null => {
    if (overlay) {
      return (
        <Overlay
          visible={visible && rendered}
          lockScroll={lockScroll}
          className={props.overlayClass}
          style={props.overlayStyle}
          zIndex={zIndex.current}
          duration={duration}
          onClick={onClickOverlay}
        />
      );
    }
    return null;
  };

  const onClickCloseIcon = (e: React.MouseEvent): void => {
    if (props.onClickCloseIcon) {
      props.onClickCloseIcon(e);
    }
    close();
  };

  const renderCloseIcon = (): JSX.Element | null => {
    if (closeIcon) {
      return (
        <div className={cs('popup__close-icon', `popup__close-icon--${closeIconPosition}`)}
          onClick={onClickCloseIcon}>
          <Icon name={closeIcon} size={closeIconSize}/>
        </div>
      );
    }
    return null;
  };

  const renderTitle = (): JSX.Element | null => {
    if (title) {
      return <div className='popup__title title3'>{title}</div>;
    }
    return null;
  };

  const renderPopup = (): JSX.Element => {
    const { safeAreaInsetBottom } = props;
    return (
      <div
        ref={popupRef as MutableRefObject<HTMLDivElement>}
        style={{
          ...style,
          display: !visible && !animatedVisible ? 'none' : undefined,
        }}
        className={cs('popup', {
          [`popup--${position}`]: position,
          [`popup--${position}__popup--round`]: position && round,
          'safe-area-bottom': safeAreaInsetBottom,
        },
        props.className,
        )}
        onClick={props.onClick}
      >
        {renderTitle()}
        {children}
        {renderCloseIcon()}
      </div>
    );
  };

  const renderTransition = (): JSX.Element => {
    const { transition, destroyOnClose, forceRender } = props;
    const name =
      position === 'center' ? 'fade' : `popup-slide-${position}`;

    return (
      <CSSTransition
        in={visible && rendered}
        nodeRef={popupRef}
        timeout={duration}
        classNames={transition || name}
        mountOnEnter={!forceRender}
        unmountOnExit={destroyOnClose}
        onEnter={open}
        onEntered={props.onOpened}
        onExited={() => {
          setAnimatedVisible(false);
          props.onClosed?.();
        }}
        addEndListener={() => void 0}
      >
        {renderPopup()}
      </CSSTransition>
    );
  };

  useEventListener('popstate', () => {
    if (props.closeOnPopstate) {
      close();
    }
  });

  useEffect(() => {
    if (!rendered) return;
    if (visible) {
      setAnimatedVisible(true);
    }
  }, [visible, rendered]);

  useImperativeHandle(ref, () => (ref as MutableRefObject<HTMLDivElement>)?.current);

  return ssrCompatRender(() =>
    renderToContainer(
      teleport as GetContainer,
      <PopupContext.Provider value={{ visible }}>
        {renderOverlay()}
        {renderTransition()}
      </PopupContext.Provider>,
    ),
  );
};

export default React.forwardRef<HTMLDivElement, PopupProps>(Popup);
