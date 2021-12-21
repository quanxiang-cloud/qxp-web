import React from 'react';
import { EmptyProps } from './types';
import Icon from '@m/qxp-ui-mobile/icon';
import cs from 'classnames';

const Empty: React.FC<EmptyProps> = (props) => {
  const { icon, title, content, children } = props;
  return (
    <div style={props.style}
      className={cs('h-full flex flex-col justify-center items-center padding-16', props.className)}>
      {!!icon && (<Icon {...icon} />)}
      {children}
      {!!title && (
        <p className={
          cs('body1 text-secondary text-center',
            { 'mt-16': icon || children, 'mb-4': content },
          )}>
          {title}
        </p>)
      }
      {!!content && (<p className='body2 text-placeholder text-center'>{content}</p>)}
    </div>
  );
};

export default Empty;
