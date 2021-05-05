import React from 'react';
import { useHistory } from 'react-router-dom';

import Switch from '@c/switch';
import Button from '@c/button';
import More from '@c/more';
import TextHeader from '@c/text-header';
import ItemWithTitleDesc from '@c/item-with-title-desc';
import Icon from '@c/icon';

import './style.scss';

interface Props {
  onTriggerTypeChange: (value: 'FORM_DATA' | 'FORM_TIME' | '') => void;
}

export default function({ onTriggerTypeChange }: Props) {
  const history = useHistory();

  function newWorkFlow(flowType: string) {
    history.push(`/apps/flow/new/${flowType}`);
  }

  return (
    <div className="flex flex-row self-start">
      <Switch
        className="mr-20"
        options={[{
          label: '全部',
          value: '',
        }, {
          label: '工作表触发',
          value: 'FORM_DATA',
        }, {
          label: '工作表时间触发',
          value: 'FORM_TIME',
        }]}
        onChange={(value) => onTriggerTypeChange(value as ('FORM_DATA' | 'FORM_TIME' | ''))}
      />
      <More<JSX.Element>
        contentClassName="left-0 right-auto w-552"
        contentItemClassName="cursor-pointer"
        items={[(
          <div
            key="FORM_DATA"
            className="flex items-center justify-between px-16 py-12 create-flow-menu-group"
            onClick={() => newWorkFlow('form-data')}
          >
            <ItemWithTitleDesc
              itemRender={(<Icon size={44} name="form-data" className="icon-border-radius" />)}
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
        ), (
          <div
            key="FORM_TIME"
            className="flex items-center justify-between px-16 py-12 create-flow-menu-group"
            onClick={() => newWorkFlow('form-time')}
          >
            <ItemWithTitleDesc
              itemRender={(<Icon size={44} name="form-time" className="icon-border-radius" />)}
              title="工作时间触发"
              titleClassName="text-h6"
              desc="指定一个工作表中的时间字段，并将该时间作为触发工作流的时间"
              descClassName="text-caption"
              textClassName="whitespace-nowrap"
            />
            <Icon
              name="nav-right"
              className="ml-80 transition-all"
              size={24}
            />
          </div>
        )]}
        header={(
          <TextHeader
            title="选择要新建的工作流触发方式："
            action={<a className="ease-linear text-underline"> 📌 如何选择？</a>}
            className="px-16 py-7 whitespace-nowrap"
          />
        )}
      >
        <Button iconName="add" modifier="primary">
          新建工作流
        </Button>
      </More>
    </div>
  );
}
