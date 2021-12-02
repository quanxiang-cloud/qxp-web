import { BadgeProps } from './types';
import React, { CSSProperties, ReactElement, ReactNode } from 'react';
import { isDef, isNumeric } from '@m/qxp-ui-mobile/utils';
import { addUnit } from '@m/qxp-ui-mobile/utils/format/unit';
import cs from 'classnames';

const Badge: React.FC<BadgeProps> = (props) => {
  const { content, max, dot, showZero, tag } = props;

  function hasContent(): boolean {
    if (props.content) {
      return true;
    }
    return isDef(content) && content !== '' && (showZero || +content !== 0);
  }

  function renderContent(): ReactNode {
    if (!dot && hasContent()) {
      if (isDef(max) && isNumeric(content?.toString()) && +(content ?? '') > max) {
        return `${max}+`;
      }

      return content;
    }
    return null;
  }

  function renderBadge(): ReactElement | null {
    if (hasContent() || props.dot) {
      let style: CSSProperties = {
        background: props.color,
      };

      if (props.offset) {
        const [x, y] = props.offset;

        if (props.children) {
          style.top = addUnit(y);
          if (String(x).indexOf('-') === 0) {
            style.right = addUnit(String(x).substr(1));
          } else {
            style.right = `-${addUnit(x)}`;
          }
        } else {
          style.marginTop = addUnit(y);
          style.marginLeft = addUnit(x);
        }
      }

      if (!props.children) {
        style = { ...props.style, ...style };
      }
      return (
        <div
          className={cs('badge',
            {
              [props.className ?? '']: props.className && !props.children,
            },
            { 'badge--dot': props.dot, 'badge--fixed': !!props.children },
          )}
          style={style}
        >
          {renderContent()}
        </div>
      );
    }
    return null;
  }

  if (props.children) {
    return React.createElement(
      tag ?? 'div',
      {
        className: cs('badge__wrapper', props.className),
        onClick: props.onClick,
        onTouchStart: props.onTouchStart,
        style: props.style,
      },
      props.children,
      renderBadge(),
    );
  }

  return renderBadge();
};

Badge.defaultProps = {
  tag: 'div',
  showZero: false,
  max: 99,
};

export default Badge;
