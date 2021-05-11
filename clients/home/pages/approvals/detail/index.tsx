import React, { useState } from 'react';
import { TextArea } from '@QCFE/lego-ui';
import { useParams } from 'react-router';

import Breadcrumb from '@c/breadcrumb';
import { useURLSearch } from '@lib/hooks';
import Tab from '@c/tab';
import Icon from '@c/icon';
import Button from '@c/button';
import Select from '@c/select';
import Modal from '@c/modal';

import Panel from './panel';
import TaskForm from './form';
import * as apis from '../api';

import './index.scss';

const moreActions = [
  { label: '打印', value: 'print' },
  { label: '分享', value: 'share' },
  { label: '流转图', value: 'chart' },
];

function ApprovalDetail(): JSX.Element {
  const [search] = useURLSearch();
  const listType = search.get('list') || 'todo';
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const { processInstanceID, taskID } = useParams<{ processInstanceID: string; taskID: string }>();

  const [openModal, setOpenModal] = useState(false);

  console.log('detail form data:', formValues);

  return (
    <div>
      <Breadcrumb
        segments={[
          { key: 'list', text: '返回审批列表', path: `/approvals?list=${listType}` },
          { key: 'current', text: 'todo current approval name' },
        ]}
      />

      <div className="approval-detail w-full h-full flex px-20">
        <Panel className="flex flex-col flex-1 mr-20 px-24 py-24">
          <div className="approval-detail-toolbar flex justify-between items-center px-10 pb-20 mb-24">
            <div className="left-btns flex flex-1">
              <span><Icon name="api" /> 转交</span>
              <span><Icon name="api" /> 加签</span>
              <span><Icon name="api" /> 回退</span>
              <span><Icon name="api" /> 打回重填</span>
              <span><Icon name="api" /> 抄送</span>
              <span><Icon name="api" /> 邀请阅示</span>
              <span>
                <Select multiple={false} options={moreActions} onChange={() => {}}>
                  <span>
                    <Icon name="more_horiz" /> 更多
                  </span>
                </Select>
              </span>
            </div>
            <div className="right-btns">
              <Button iconName="close" modifier="danger">拒绝</Button>
              <Button iconName="done" modifier="primary" className="btn-item-done"
                onClick={() => setOpenModal(true)}>通过</Button>
            </div>
          </div>
          <TaskForm onChange={setFormValues} />
        </Panel>
        <Panel className="approval-detail-tab w-400">
          <Tab
            items={[
              {
                id: 'history',
                name: '动态',
                content: (<div>动态</div>),
              },
              {
                id: 'discuss',
                name: '讨论',
                content: (<div>讨论</div>),
              },
            ]}
          />
        </Panel>
      </div>

      {openModal && (
        <Modal
          title={'通过 工作流'}
          onClose={() => setOpenModal(false)}
          onConfirm={async () => {
            const res = await apis.reviewTask(processInstanceID, taskID, { remark: '', handleType: 'AGREE' });
            console.log('review task res: ', res);
          }}
        >
          <TextArea rows={4} name="comment" placeholder="输入通过意见 (选填)" />
        </Modal>
      )}
    </div>
  );
}

export default ApprovalDetail;
