import React, { useEffect } from 'react';
import { HomePageProps } from '../types';
import Header from '../header/header';
import store from '@home/pages/store';

const Workbench: React.FC<HomePageProps> = (props) => {
  useEffect(() => {
    if (props.active) {
      store.fetchAppList();
    }
  }, [props.active]);

  return (
    <Header active={props.active} key={props.key}>
        workbench
    </Header>
  );
};

export default Workbench;
