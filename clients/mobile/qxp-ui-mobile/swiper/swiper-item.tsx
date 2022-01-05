import React from 'react';
import cs from 'classnames';

import { Props } from '..';

const SwiperItem: React.FC<Props> = (props) => {
  return (
    <div className={cs(props.className, 'swiper-item')} onClick={props.onClick} style={props.style}>
      {props.children}
    </div>
  );
};

export default SwiperItem;
