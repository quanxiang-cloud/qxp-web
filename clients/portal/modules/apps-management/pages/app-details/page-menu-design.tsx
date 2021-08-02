import React from 'react';

import './index.scss';
import PageNav from './page-list';
import PageDetails from './page-details';

function PageMenuDesign(): JSX.Element {
  return (
    <>
      <PageNav />
      <PageDetails />
    </>
  );
}

export default PageMenuDesign;
