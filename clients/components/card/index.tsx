import React, { HTMLAttributes, ReactNode, CSSProperties } from 'react';
import cs from 'classnames';

import './index.scss';

function getAction(actions: ReactNode[]): ReactNode[] {
  const actionList = actions.map((action, index) => (
    <li style={{ width: `${100 / actions.length}%` }} key={`action-${index}`}>
      <span>{action}</span>
    </li>
  ));
  return actionList;
}

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  extra?: ReactNode;
  bordered?: boolean;
  headStyle?: CSSProperties;
  bodyStyle?: CSSProperties;
  style?: CSSProperties;
  children?: ReactNode;
  className?: string;
  cover?: ReactNode;
  actions?: ReactNode[];
}

const Card: React.FC<CardProps> = (props) => {
  const {
    className,
    extra,
    headStyle = {},
    bodyStyle = {},
    title,
    bordered = true,
    cover,
    actions,
    children,
    ...otherProps
  } = props;

  // todo optimization
  const prefixCls = 'qxb-card';

  let head: ReactNode;

  if (title || extra) {
    head = (
      <div className={`${prefixCls}-head`} style={headStyle}>
        <div className={`${prefixCls}-head-wrapper`}>
          {title && <div className={`${prefixCls}-head-title`}>{title}</div>}
          {extra && <div className={`${prefixCls}-extra`}>{extra}</div>}
        </div>
      </div>
    );
  }
  const coverDom = cover ? <div className={`${prefixCls}-cover`}>{cover}</div> : null;
  const body = (
    <div className={`${prefixCls}-body`} style={bodyStyle}>
      {children}
    </div>
  );
  const actionDom =
    actions && actions.length ? (
      <ul className={`${prefixCls}-actions`}>{getAction(actions)}</ul>
    ) : null;
  const classString = cs(
    prefixCls,
    {
      [`${prefixCls}-bordered`]: bordered,
    },
    className,
  );

  return (
    <div {...otherProps} className={classString}>
      {head}
      {coverDom}
      {body}
      {actionDom}
    </div>
  );
};

export default Card;
