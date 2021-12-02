import { OverlayProps } from '@m/qxp-ui-mobile/overlay/types';
import React, { useEffect, useRef } from 'react';
import { isDef } from '@m/qxp-ui-mobile/utils';
import useLockScroll from '@m/qxp-ui-mobile/utils/hooks/use-lock-scroll';
import { getZIndexStyle } from '@m/qxp-ui-mobile/utils/format/unit';
import { CSSTransition } from 'react-transition-group';
import cs from 'classnames';

const Overlay: React.FC<OverlayProps> = (props) => {
  const nodeRef = useRef(null);
  const { visible, duration, zIndex } = props;
  const [lockScroll, unlockScroll] = useLockScroll(() => !!props.lockScroll);
  const innerLockRef = useRef(false);

  const preventTouchMove = (event: TouchEvent): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  const renderOverlay = (): JSX.Element => {
    const style = getZIndexStyle(zIndex, props.style);

    if (isDef(duration)) {
      style.animationDuration = `${duration}ms`;
    }

    return (
      <div
        ref={nodeRef}
        style={style}
        onClick={props.onClick}
        className={cs('overlay', props.className)}
        onTouchMove={props.lockScroll ? () => preventTouchMove : undefined}
      >
        {props.children}
      </div>
    );
  };

  useEffect(() => {
    if (!props.lockScroll) return;
    if (visible) {
      lockScroll();
      innerLockRef.current = true;
    }
    if (!visible && innerLockRef.current) {
      unlockScroll();
      innerLockRef.current = false;
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      if (props.lockScroll) unlockScroll();
    };
  }, []);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      mountOnEnter
      unmountOnExit
      in={visible}
      timeout={duration}
      classNames='fade'
      addEndListener={() => undefined}
    >
      {renderOverlay()}
    </CSSTransition>
  );
};

Overlay.defaultProps = {
  lockScroll: true,
  duration: 300,
};

export default Overlay;
