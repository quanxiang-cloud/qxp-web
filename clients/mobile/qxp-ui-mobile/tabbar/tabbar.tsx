import React, { ReactElement, Ref, useRef } from 'react';
import cs from 'classnames';
import TabbarContext from './context';
import { TabbarProps } from '@m/qxp-ui-mobile/tabbar/types';
import useHeight from '@m/qxp-ui-mobile/utils/hooks/use-height';
import useMergedState from '@m/qxp-ui-mobile/utils/hooks/use-merged-state';
import { getZIndexStyle } from '@m/qxp-ui-mobile/utils/format/unit';
import { NumberString, RenderFunc } from '@m/qxp-ui-mobile';

const Tabbar: React.FC<TabbarProps> = (props) => {
  const { fixed, zIndex } = props;
  const [current, setCurrent] = useMergedState({ value: props.value, defaultValue: props.defaultValue });
  const root = useRef<HTMLDivElement>();
  const height = useHeight(root);

  function renderPlaceholder(renderContent: RenderFunc): JSX.Element {
    return (
      <div className={'tabbar--placeholder'} style={{ height }}>
        {renderContent()}
      </div>
    );
  }

  // enable safe-area-inset-bottom by default when fixed
  function enableSafeArea(): boolean {
    return props.safeAreaInsetBottom ?? fixed ?? true;
  }

  function setActive(active: NumberString): void {
    if (active !== props.value) {
      props.onChange?.(active);
      setCurrent(active);
    }
  }

  function renderTabbar(): JSX.Element {
    return (
      <TabbarContext.Provider value={{ parent: { ...props, value: current } }}>
        <div
          ref={root as Ref<HTMLDivElement>}
          style={getZIndexStyle(zIndex, props.style)}
          className={cs('tabbar', props.className, { 'tabbar--fixed': fixed }, {
            'safe-area-bottom': enableSafeArea(),
          })}
        >
          {React.Children.toArray(props.children).filter(Boolean).map(
            (child, index) =>
              React.cloneElement(child as ReactElement, {
                setActive,
                index,
              }),
          )}
        </div>
      </TabbarContext.Provider>
    );
  }

  if (props.fixed && props.placeholder) {
    return renderPlaceholder(renderTabbar);
  }
  return renderTabbar();
};

Tabbar.defaultProps = {
  fixed: true,
  defaultValue: 0,
};

export default Tabbar;
