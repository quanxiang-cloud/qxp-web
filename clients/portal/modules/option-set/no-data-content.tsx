import React from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';
import ShowModal from './show-modal';

import './index.scss';
import store from './store';

interface Props {
  type: string;
}

function NoDataContent({ type }: Props): JSX.Element {
  return (
    <div className='option-set-no-data'>
      <div className='option-set-no-data--content'>
        <div className='option-set-no-data--title'>
          选项集能用来做什么？
        </div>
        <div className='option-set-no-data--des'>
          在设计表单时，通常会预设置单选或多选框为用户提供选择项。
          有时不同的工作表，可能单选或多选的均是同样的数据内容，对于高复用的数据选项，
          建议维护成选项集，可以节省很多重复配置的操作，帮您提高效率。
        </div>
        {type === 'list' && (
          <>
            <div className='option-set-no-data--title'>
              单选项集可以应用到哪些表单字段？
            </div>
            <div className='option-set-no-data--des'>
              当您设计表单时，在使用字段【单选框】、【复选框】、【下拉单选框】、
              【下拉复选框】等字段时，均可以调用此处添加的选项集。
            </div>
            <div className='option-set-no-data--title'>
              单选项集扩展为多层级选项集？
            </div>
            <div className='option-set-no-data--des'>
              随着您的业务变复杂，需要从单选项集扩展为多级数据结构时，
              可以点击【复制】成多层级。省时省力。
            </div>
          </>
        )}
        {type === 'tree' && (
          <>
            <div className='option-set-no-data--title'>
              多选项集可以应用到哪些表单字段？
            </div>
            <div className='option-set-no-data--des'>
              当您设计表单时，在使用字段【级联选择】等字段时，均可以调用此处添加的选项集。
            </div>
          </>
        )}
        <Button
          iconName='add'
          modifier='primary'
          onClick={() => {
            store.modalOpen = true;
          }}
        >
          添加选项集
        </Button>
      </div>
      <div className='flex flex-1 items-start'>
        <img src={`/dist/images/no-data-option-set-${type}.svg`} />
      </div>
      {store.modalOpen && <ShowModal modalType='add' isNoData={true} />}
    </div>
  );
}

export default observer(NoDataContent);
