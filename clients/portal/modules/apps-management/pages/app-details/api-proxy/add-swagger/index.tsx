import React from 'react';

import SideNav from '../side-nav';
import Content from '../comps/content';

interface Props {
  className?: string;
}

function AddSwagger(props: Props) {
  return (
    <>
      <SideNav/>
      <Content>
        add swagger
      </Content>
    </>
  );
}

export default AddSwagger;
