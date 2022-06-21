import React from 'react';

import Menu from './navigation-menu';

function Test(): JSX.Element {
  return (
    <>
      <Menu mode="top" />
      <div className='h-280 bg-indigo-300'></div>
      <Menu mode="side" />
    </>
  );
}

export default Test;

