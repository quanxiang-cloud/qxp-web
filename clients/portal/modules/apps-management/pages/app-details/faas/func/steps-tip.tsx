import React from 'react';

import Icon from '@c/icon';

import '../index.scss';

const STEP = ['新建函数', '定义函数', '构建镜像', '部署上线'];

function StepsTip(): JSX.Element {
  return (
    <div className="guide">
      <div className="steps">
        {STEP.map((step, index) => {
          return (
            <div key={step} className="text-14 font-medium flex items-center">
              <div className="step">{index}</div>
              <div>{step}</div>
            </div>
          );
        })}
      </div>
      <a
        href='#'
        rel='noreferrer noopener'
        className='text-12 text-blue-600 text-right flex items-center'>
          查看文档
        <Icon className="ml-4" name="arrow_forward" />
      </a>
    </div>
  );
}

export default StepsTip;
