import React from 'react';
import { Props } from '@m/qxp-ui-mobile';
import cs from 'classnames';

const SwiperItem: React.FC<Props> = (props) => {
  return (
    <div className={cs(props.className, 'swiper-item')} onClick={props.onClick} style={props.style}>
      {props.children}
    </div>
  );
};

export default SwiperItem;
