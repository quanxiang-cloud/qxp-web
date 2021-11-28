import React from 'react';
import './index.scss';
import { Props } from '@m/qxp-ui-mobile';
import cs from 'classnames';

export interface HomeCardProps extends Props {
  title: string
}

const HomeCard: React.FC<HomeCardProps> = (props): JSX.Element => {
  return (
    <div className='home-card'>
      <div className={cs(
        'home-card--title title3 text-primary truncate',
        { [props.className ?? '']: props.className },
      )}
      style={props.style}>
        {props.title}
      </div>
      {props.children}
    </div>
  );
};

export default HomeCard;
