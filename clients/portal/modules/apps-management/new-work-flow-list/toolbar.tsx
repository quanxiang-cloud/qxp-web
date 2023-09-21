import React, { useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Button from '@c/button';
import Search from '@c/search';
import TextHeader from '@c/text-header';
import ItemWithTitleDesc from '@c/item-with-title-desc';
import Icon from '@c/icon';
import Popper from '@c/popper';

import './style.scss';

interface Props {
  onTriggerTypeChange: (value: 'FORM_DATA' | 'FORM_TIME' | '') => void;
  onSearchInputChange: (value: string) => void;
}

export default function({ onSearchInputChange }: Props): JSX.Element {
  const history = useHistory();
  const { appID } = useParams<{ appID: string; }>();
  const reference = useRef<HTMLButtonElement>(null);

  function newWorkFlow(flowType: string): void {
    history.push(`/apps/flow/new/${flowType}/${appID}`);
  }

  return (
    <div className="flex justify-between mb-8">
      <Button ref={reference} iconName="add" textClassName="text-12" modifier="primary">
          新建工作流
      </Button>
      <Popper
        reference={reference}
        placement="bottom-start"
        modifiers={[{ name: 'offset', options: { offset: [0, 4] } }]}
      >
        <div className="w-552 z-20 shadow-title bg-white rounded-6 mr-2 group">
          <TextHeader
            title="选择要新建的工作流触发方式："
            className="px-16 py-7 whitespace-nowrap"
          />
          <div
            key="FORM_DATA"
            className="flex cursor-pointer items-center justify-between px-16 py-12 create-flow-menu-group"
            onClick={() => newWorkFlow('form-data')}
          >
            <ItemWithTitleDesc
              itemRender={(<Icon size={44} name="form-data" className="corner-12-2-12-12" />)}
              title="工作表触发"
              titleClassName="text-h6"
              desc="当工作表中新增记录或已有记录发生变更时触发"
              descClassName="text-caption"
              textClassName="whitespace-nowrap"
            />
            <Icon
              name="nav-right"
              className="ml-80 transition-all"
              size={24}
            />
          </div>
          <div
            key="FORM_TIME"
            className="flex cursor-pointer items-center justify-between px-16 py-12 create-flow-menu-group"
            onClick={() => newWorkFlow('time-flow')}
          >
            <ItemWithTitleDesc
              itemRender={(<Icon size={44} name="form-time" className="corner-12-2-12-12" />)}
              title="定时触发"
              titleClassName="text-h6"
              desc="根据设定的定时触发规则，在定时生效时触发流程"
              descClassName="text-caption"
              textClassName="whitespace-nowrap"
            />
            <Icon
              name="nav-right"
              className="ml-80 transition-all"
              size={24}
            />
          </div>
        </div>
      </Popper>
      <Search
        className="flow-search"
        placeholder="搜索工作流名称……"
        onChange={onSearchInputChange}
      />
    </div>
  );
}
