import React from 'react';

import Container from '../container';
import DatasetNames from './dataset-names';
import DatasetContent from './dataset-content';

import './index.scss';

interface Props {
  className?: string;
}

function Dataset(props: Props) {
  return (
    <Container>
      <div className="flex overflow-hidden">
        <DatasetNames/>
        <DatasetContent/>
      </div>
    </Container>
  );
}

export default Dataset;
