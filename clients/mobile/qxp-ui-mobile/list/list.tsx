import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  isValidElement,
  MutableRefObject,
  ReactNode,
} from 'react';
import { useSetState, useUpdateEffect } from 'react-use';
import cs from 'classnames';

import Loading from '../loading';
import useScrollParent from '../utils/hooks/use-scroll-parent';
import { getRect } from '../utils/hooks/use-rect';
import { isHidden } from '../utils/dom';
import useEventListener from '../utils/hooks/use-event-listener';

import { ListInstance, ListProps } from './types';

const List = forwardRef<ListInstance, ListProps>((props: ListProps, ref) => {
  const {
    offset = 300,
    direction = 'down',
    immediateCheck = true,
    autoCheck = true,
    loadingText = '加载中...',
    finishedText,
    errorText,
    loading = false,
    error = false,
    finished,
  } = props;
  const [state, updateState] = useSetState({
    loading,
    error,
  });

  const root = useRef<HTMLDivElement>();
  const scrollParent = useRef<Element | Window>(null) as MutableRefObject<Element | Window>;
  const placeholder = useRef<HTMLDivElement>();

  scrollParent.current = useScrollParent(root);

  const check = async (): Promise<void> => {
    if (!props.onLoad) return;
    if (state.loading || finished || state.error) {
      return;
    }
    const scrollParentRect = getRect(scrollParent.current);

    if (!scrollParentRect.height || isHidden(root.current)) {
      return;
    }

    let isReachEdge;
    const placeholderRect = getRect(placeholder.current);

    if (direction === 'up') {
      isReachEdge = scrollParentRect.top - placeholderRect.top <= offset;
    } else {
      isReachEdge = placeholderRect.bottom - scrollParentRect.bottom <= offset;
    }
    if (isReachEdge) {
      try {
        updateState({ loading: true });
        if (props.onLoad) await props.onLoad();
        updateState({ loading: false });
      } catch (error) {
        updateState({ loading: false, error: true });
      }
    }
  };

  const renderFinishedText = (): ReactNode => {
    if (finished && finishedText) {
      return <div className='list__finished-text text-placeholder'>{finishedText}</div>;
    }
    return null;
  };

  const clickErrorText = (): void => {
    updateState({ error: false });
    check();
  };

  const renderErrorText = (): ReactNode => {
    if (state.error && errorText) {
      return (
        <div className='list__error-text text-placeholder' onClick={clickErrorText}>
          {errorText}
        </div>
      );
    }
    return null;
  };

  const renderLoading = (): ReactNode => {
    if (state.loading && !finished) {
      return (
        <div className='list__loading text-placeholder'>
          {typeof loadingText === 'function' && isValidElement(loadingText) ? (
            loadingText()
          ) : (
            <Loading className='list__loading-icon text-placeholder' size='.18rem'>
              {loadingText}
            </Loading>
          )}
        </div>
      );
    }
    return null;
  };

  useUpdateEffect(() => {
    if (autoCheck) {
      check();
    }
  }, [state.loading, finished, error]);

  useUpdateEffect(() => {
    updateState({ loading, error });
  }, [loading, error]);

  useUpdateEffect(() => {
    if (scrollParent.current && immediateCheck) {
      check();
    }
  }, [scrollParent.current]);

  useEventListener('scroll', check, {
    target: scrollParent.current,
    depends: [state.loading, finished, state.error],
  });

  useImperativeHandle(ref, () => ({
    check,
    state,
  }));

  const Placeholder = (
    <div
      ref={placeholder as MutableRefObject<HTMLDivElement>}
      className='list__placeholder' />
  );

  return (
    <div ref={root as MutableRefObject<HTMLDivElement>}
      role="feed"
      className={cs('list', props.className)}
      style={props.style}
      aria-busy={state.loading}>
      {direction === 'down' ? props.children : Placeholder}
      {renderLoading()}
      {renderFinishedText()}
      {renderErrorText()}
      {direction === 'up' ? props.children : Placeholder}
    </div>
  );
});

export default List;
