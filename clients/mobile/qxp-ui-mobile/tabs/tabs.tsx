import React, {
  useMemo,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
  useContext, ReactNode, MutableRefObject,
} from 'react';
import Sticky from '../sticky';
import { TabPaneProps, TabsInstance, TabsProps } from './types';
import PopupContext from '../popup/context';
import {
  getElementTop,
  getVisibleHeight,
  scrollLeftTo,
  setRootScrollTop,
} from '@m/qxp-ui-mobile/utils/scroll';
import { isDef } from '@m/qxp-ui-mobile/utils';
import { unitToPx } from '@m/qxp-ui-mobile/utils/format/unit';
import { callInterceptor, isHidden } from '@m/qxp-ui-mobile/utils/dom';
import useRefs from '@m/qxp-ui-mobile/utils/hooks/use-refs';
import { parseChildList } from '../utils/format/react';
import TabsContext from './context';
import TabsTitle from './tabs-title';
import { NumberString } from '@m/qxp-ui-mobile';
import cs from 'classnames';
import TabsContent from '@m/qxp-ui-mobile/tabs/tabs-content';
import { useSetState, useUpdateEffect, useWindowSize } from 'react-use';

const Tabs = forwardRef<TabsInstance, TabsProps>((props: TabsProps, ref) => {
  const popupContext = useContext(PopupContext);

  const {
    children,
    color,
    duration = 300,
    swipeThreshold = 5,
    offsetTop = 0,
    ellipsis = true,
    lazyRender = true,
    active = 0,
    animated,
    canSwipe,
    titleActiveColor,
    titleInactiveColor,
    sticky,
  } = props;

  const root = useRef<HTMLDivElement>(null);
  const [wrapRef, setWrapRef] = useState<HTMLDivElement | null>(null);
  const initChange = useRef<boolean>(false);
  const stickyFixed = useRef<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();

  const [titleRefs, setTitleRefs] = useRefs();

  const tabHeight = useMemo(() => {
    if (!wrapRef) return 0;
    return getVisibleHeight(wrapRef);
  }, [wrapRef]);

  const tabHeightRef = useRef(tabHeight);

  tabHeightRef.current = tabHeight;

  const [state, setState] = useSetState({
    inited: false,
    position: '',
    currentIndex: -1,
    lineStyle: {
      color: 'transparent',
      overflow: 'hidden',
      backgroundColor: color,
    } as React.CSSProperties,
  });

  const childrenList = useMemo(
    () => parseChildList<TabPaneProps>(props.children),
    [props.children],
  );

  // whether the nav is scrollable
  const scrollable = useMemo(
    () => childrenList.length > swipeThreshold || !ellipsis,
    [childrenList.length, swipeThreshold, ellipsis],
  );

  const navStyle = useMemo(
    () => ({
      borderColor: color,
    }),
    [color],
  );

  const getTabName = (tab: TabPaneProps, index: number): string | number => tab?.name ?? index;

  const currentName = useMemo(() => {
    const activeTab = childrenList[state.currentIndex];
    return activeTab && getTabName(activeTab, state.currentIndex);
  }, [state.currentIndex]);

  const offsetTopPx = useMemo(() => unitToPx(offsetTop), [offsetTop]);

  // scroll active tab into view
  const scrollIntoView = (immediate?: boolean): void => {
    const nav = navRef.current;
    if (!scrollable || !nav || !titleRefs || !titleRefs[state.currentIndex]) {
      return;
    }

    const title = titleRefs[state.currentIndex];

    const to = title.offsetLeft - ((nav.offsetWidth - title.offsetWidth) / 2);
    scrollLeftTo(nav, to, immediate ? 0 : +duration);
  };

  const setLine = (immediate?: boolean): void => {
    let shouldAnimate = state.inited;
    if (immediate) shouldAnimate = false;
    const titles = titleRefs;
    const hidden = isHidden(root.current as HTMLDivElement);
    if (!titles || !titles[state.currentIndex] || hidden) {
      return;
    }

    const title = titles[state.currentIndex];
    const left = title.offsetLeft + (title.offsetWidth / 2);

    const length = Math.min(childrenList.length, 4);
    const lineStyle = {
      backgroundColor: color,
      transform: `translateX(${left}px) translateX(-50%)`,
      maxWidth: `calc(100vw/${length} - ${length}*0.08rem)`,
    } as React.CSSProperties;

    if (shouldAnimate) {
      lineStyle.transitionDuration = `${duration}ms`;
    }

    setState({ lineStyle });
  };

  const findAvailableTab = (index: number): number | null => {
    let _index = index;
    const diff = _index < state.currentIndex ? -1 : 1;
    while (_index >= 0 && _index < childrenList.length) {
      if (!childrenList[_index].disabled) {
        return _index;
      }
      _index += diff;
    }
    return null;
  };

  const setCurrentIndex = (currentIndex: number): void => {
    const newIndex = findAvailableTab(currentIndex);

    if (!isDef(newIndex)) {
      return;
    }
    const newTab = childrenList[newIndex];
    const newName = getTabName(newTab, newIndex);
    const shouldEmitChange = state.currentIndex !== null;

    setState({ currentIndex: newIndex });

    if (!initChange.current) {
      initChange.current = true;
      return;
    }

    if (initChange.current) {
      if (shouldEmitChange) {
        props.onChange?.(newName, newTab.title ?? '');
      }
    }
  };

  // correct the index of active tab
  const setCurrentIndexByName = (name: string | number): void => {
    const currentIndex = childrenList.findIndex(
      (tab: TabPaneProps, index) => getTabName(tab, index) === name,
    );
    setCurrentIndex(currentIndex < 0 ? 0 : currentIndex);
  };

  const onClickTab = (item: TabPaneProps, index: number, event: React.MouseEvent): void => {
    const { title = '', disabled = false } = item;
    const name = getTabName(item, index);
    props.onClickTab?.({
      name,
      title,
      event,
      disabled,
    });
    if (disabled) return;

    callInterceptor({
      interceptor: props.beforeChange,
      args: [name],
      done: () => {
        if (index !== state.currentIndex) {
          setCurrentIndex(index);
        }
      },
    });
  };

  const scrollTo = (name: NumberString): void => {
    setCurrentIndexByName(name);
  };

  const onStickyScroll = (params: { isFixed: boolean; scrollTop: number }): void => {
    stickyFixed.current = params.isFixed;
    props.onScroll?.(params);
  };

  const renderNav = (): ReactNode => {
    return childrenList.map((item: TabPaneProps, index: number) => {
      return (
        <TabsTitle
          ref={setTitleRefs(index)}
          key={item.key}
          badge={item.badge}
          title={item.title}
          color={color}
          style={item.titleStyle}
          className={props.titleClassName}
          isActive={index === state.currentIndex}
          disabled={item.disabled}
          scrollable={scrollable}
          renderTitle={item.renderTitle}
          activeColor={titleActiveColor}
          inactiveColor={titleInactiveColor}
          onClick={(event) => {
            onClickTab(item, index, event);
          }}
        />
      );
    });
  };

  const renderHeader = (): JSX.Element => {
    return (
      <div
        ref={setWrapRef}
        className={cs('tabs__wrap', { 'tabs__wrap--scrollable': scrollable })}
      >
        <div
          ref={navRef}
          role="tablist"
          className={cs('tabs__nav tabs__nav--line', { 'tabs__nav--complete': scrollable })}
          style={navStyle}
        >
          {renderNav()}
          <div className='tabs__line' style={state.lineStyle}>
            {childrenList[state.currentIndex > -1 ? state.currentIndex : 0].title}
          </div>
        </div>
      </div>
    );
  };

  useUpdateEffect(() => {
    setLine();
  }, [color, windowSize.width]);

  useUpdateEffect(() => {
    if (active !== currentName) {
      setCurrentIndexByName(active);
    }
  }, [active]);

  useUpdateEffect(() => {
    if (state.inited) {
      setCurrentIndexByName(active || currentName);
      setLine();
      scrollIntoView(true);
    }
  }, [React.Children.count(children)]);

  useUpdateEffect(() => {
    scrollIntoView();
    setLine();
    // scroll to correct position
    if (stickyFixed.current) {
      setRootScrollTop(Math.ceil(getElementTop(root.current as HTMLDivElement) - offsetTopPx));
    }
  }, [state.currentIndex]);

  const init = (): void => {
    setCurrentIndexByName(active);
    scrollIntoView(true);
    setState({ inited: true });
  };

  useEffect(() => {
    init();
  }, []);

  useUpdateEffect(() => {
    if (popupContext.visible) {
      setLine();
    }
  }, [popupContext.visible]);

  useImperativeHandle(ref, () => ({
    resize: setLine,
    scrollTo,
  }));

  const onStickyChange = (): void => {
    setLine(true);
  };

  return (
    <TabsContext.Provider value={{ props, currentName, scrollIntoView, setLine }}>
      <div ref={root} className={cs(props.className, 'tabs--line')}>
        {sticky ? (
          <Sticky
            container={root as MutableRefObject<HTMLElement>}
            offsetTop={offsetTopPx}
            onChange={onStickyChange}
            onScroll={onStickyScroll}
          >
            {renderHeader()}
            {props.navBottom}
          </Sticky>
        ) : (
          <>
            {renderHeader()}
            {props.navBottom}
          </>
        )}
        <TabsContent
          count={childrenList.length}
          inited={state.inited}
          animated={animated}
          duration={duration}
          canSwipe={canSwipe}
          lazyRender={lazyRender}
          currentIndex={state.currentIndex}
          onChange={setCurrentIndex}
        >
          {React.Children.toArray(children)
            .filter(Boolean)
            .map((node, index: number) =>
              React.cloneElement(node as React.ReactElement, {
                index,
              }),
            )}
        </TabsContent>
      </div>
    </TabsContext.Provider>
  );
});

export default Tabs;
