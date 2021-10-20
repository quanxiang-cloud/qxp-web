import React from 'react';

import TextHeader from '@c/text-header';

import Container from '../container';
import UnusualTaskList from './unusual-task-list';

function UnusualTask(): JSX.Element {
  return (
    <Container>
      <div className="h-full flex flex-col flex-grow overflow-hidden">
        <TextHeader
          title="异常任务"
          desc="集中管理所有应用中工作异常的流程。"
          className="bg-gray-1000 px-20 header-background-image"
          itemTitleClassName="text-h5"
        />
        <UnusualTaskList />
      </div>
    </Container>
  );
}

export default UnusualTask;
