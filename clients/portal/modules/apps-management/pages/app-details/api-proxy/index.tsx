import React from 'react';
import SideNav from './side-nav';

interface Props {
  className?: string;
}

function ApiProxy(props: Props) {
  return (
    <div className='flex flex-grow'>
      <SideNav/>

    </div>
  );
}

export default ApiProxy;
