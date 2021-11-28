import React from 'react';
import { HomePageProps } from '../types';
import cs from 'classnames';

const Mine: React.FC<HomePageProps> = (props) => {
  return (
    <div className={cs('h-full bg-white', { hidden: !props.active })} key={props.key}>
            mine
    </div>
  );
};

export default Mine;
