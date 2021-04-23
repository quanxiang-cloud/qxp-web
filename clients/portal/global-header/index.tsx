import React from 'react';
import { useLocation } from 'react-router-dom';

import NormalHeader from './normal';
import FlowHeader from './flow';

export default function GlobalHeader() {
  const location = useLocation();
  const { pathname } = location;

  if (pathname.startsWith('/flow/new')) {
    return (<FlowHeader />);
  }

  return (<NormalHeader />);
}
