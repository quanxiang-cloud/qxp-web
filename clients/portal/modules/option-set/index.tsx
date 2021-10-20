import React from 'react';
import cs from 'classnames';
import { useTitle } from 'react-use';

import TextHeader from '@c/text-header';

import OptionSetList from './option-set-list';
import OptionSetContent from './option-set-content';

import './index.scss';

interface Props {
  className?: string;
}

function OptionSet(props: Props): JSX.Element {
  useTitle('应用管理 - 选项集管理');

  return (
    <div className={cs('flex flex-col h-full', props.className)}>
      <TextHeader
        title="选项集"
        desc="作为公共数据可以被自建应用的表单调用。例如，表单字段下拉选择、级联选择可以关联此处的选项集。"
        // action="❓ 哪些地方用到选项集？"
        className="app-list-headertitle bg-gray-1000 px-20 py-16 header-background-image"
        itemTitleClassName="text-h5"
      />
      <div className="flex overflow-hidden dataset h-full">
        <OptionSetList />
        <OptionSetContent />
      </div>
    </div>
  );
}

export default OptionSet;
