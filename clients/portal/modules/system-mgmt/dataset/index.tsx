import React, { useEffect } from 'react';

import Container from '../container';
import DatasetNames from './dataset-names';
import DatasetContent from './dataset-content';

import './index.scss';

interface Props {
  className?: string;
}

function Dataset(props: Props) {
  useEffect(()=> {
    document.title = '系统管理 - 数据集管理';
  }, []);

  return (
    <Container>
      <div className="flex overflow-hidden dataset">
        <DatasetNames/>
        <DatasetContent/>
      </div>
    </Container>
  );
}

export default Dataset;
