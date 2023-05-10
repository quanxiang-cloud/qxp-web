/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';

import Tab from '@c/tab';
import Dynamic from './dynamic';

const DetailsApproval = (props: any) => {
  const { data } = props;
  return (
    <Tab
      navsClassName="px-16"
      contentClassName="px-16"
      items={[
        {
          id: 'history',
          name: '动态',
          content: (<Dynamic data={data}/>),
        },
      ]} />
  );
};

export default DetailsApproval;
