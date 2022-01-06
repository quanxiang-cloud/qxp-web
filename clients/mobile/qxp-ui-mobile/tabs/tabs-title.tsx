import React, { useMemo, CSSProperties, ReactElement } from 'react';
import cs from 'classnames';

import Badge from '../badge';

import { TabsTitleProps } from './types';

const TabsTitle = (props: TabsTitleProps, ref: React.Ref<HTMLDivElement>): JSX.Element => {
  const { color, isActive, activeColor, inactiveColor, disabled, className } = props;

  const customStyle = useMemo(() => {
    const style: CSSProperties = { ...(props.style || {}) };

    const titleColor = isActive ? activeColor : inactiveColor;
    if (titleColor) {
      style.color = titleColor;
    }

    return style;
  }, [color, disabled, isActive, activeColor, inactiveColor]);

  const renderText = (): ReactElement => {
    const Text = (
      <span className={cs('tab__text', { 'tab__text--ellipsis': !props.scrollable })}>
        {(() => {
          if (typeof props.renderTitle === 'function') {
            return props.renderTitle(isActive);
          }
          return props.renderTitle || props.title;
        })()}
      </span>
    );

    if (props.badge) {
      return (
        <Badge {...props.badge}>
          {Text}
        </Badge>
      );
    }

    return Text;
  };

  return (
    <div
      ref={ref}
      className={cs('tab', { 'tab--active': isActive, 'tab--disabled': disabled }, className)}
      style={customStyle}
      aria-selected={props.isActive}
      onClick={props.onClick}
    >
      {renderText()}
    </div>
  );
};

export default React.forwardRef<HTMLDivElement, TabsTitleProps>(TabsTitle);
