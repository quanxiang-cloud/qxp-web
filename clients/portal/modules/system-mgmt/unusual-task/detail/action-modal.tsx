import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { toJS } from 'mobx';
import { TextArea } from '@QCFE/lego-ui';

import Icon from '@c/icon';
import Modal from '@c/modal';
import Button from '@c/button';
import Toast from '@lib/toast';
import ReceiverPicker from '@c/employee-or-department-picker';
import ReceiverList from '@c/employee-receiver-list';

import SelectStepBackNode from './select-step-back-node';
import { Actions } from './index';
import { abandonTask, deliverTask, sendTask, stepTask } from '../api';

interface Props {
  action: Actions;
  closeModal(): void;
}

const actionValues: Record<Actions, string> = {
  STEP_BACK: '退回某步',
  SEND_BACK: '打回重填',
  APPOINT: '指定处理人',
  DELETE: '作废流程',
};

function ActionModal({ closeModal, action }: Props): JSX.Element {
  const [showReceiverPicker, setShowPicker] = useState(false);
  const [chosenEmployees, setChosenEmployees] = useState([]);
  const [showTips, setShowTips] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [stepBackId, setStepBackId] = useState('');

  const history = useHistory();
  const urlParams = useParams<{ processInstanceId: string, taskId: string }>();
  const { processInstanceId, taskId } = urlParams;

  function renderContent(): (JSX.Element | null) {
    if (action === 'STEP_BACK') {
      return (
        <div className="p-20">
          <p className="text-yellow-600 flex items-center mb-24">
            <Icon name="info" className="text-yellow-600 mr-8" />
            将工作流任务回退至已流转过的节点（除开始节点），不中断任务
          </p>
          <SelectStepBackNode onChange={setStepBackId} />
          {(showTips && stepBackId === '') && <p className="text-red-600">请选择要回退的节点</p>}
          <div style={{ width: '500px' }}>
            <TextArea
              rows={4}
              name="comment"
              placeholder='输入退回原因 (选填)'
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTextValue(e.target.value)}
            />
          </div>
        </div>
      );
    }

    if (action === 'DELETE') {
      return <div>是否确定作废该流程？</div>;
    }

    if (action === 'APPOINT') {
      return (
        <div>
          <div className="mb-24">
            <Button iconName="add" onClick={() => setShowPicker(true)}>添加处理人</Button>
            { (showTips && chosenEmployees.length === 0) && <p className="text-red-600">请选择处理人</p>}
            { (showTips && chosenEmployees.length > 1) && <p className="text-red-600">处理人只能为1人</p>}
          </div>
          <ReceiverList
            className="mb-24"
            receivers={chosenEmployees}
            onRemove={(id) => {
              setChosenEmployees((current) => current.filter((item: { id: string }) => item.id !== id));
            }} />
          <TextArea
            rows={4}
            name="comment"
            placeholder='输入处理原因 (选填)'
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTextValue(e.target.value)}
          />
        </div>
      );
    }

    if (action === 'SEND_BACK') {
      return (
        <div>
          <p className="text-yellow-600 flex items-center mb-24">
            <Icon name="info" className="text-yellow-600 mr-8" />
            将工作流任务打回至初始节点，发起人重新填写后继续流转，不中断任务
          </p>
          <div>
            <TextArea
              rows={4}
              name="comment"
              placeholder='输入打回重填原因'
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setTextValue(e.target.value);
              }}
            />
            {(showTips && textValue === '') && <p className="text-red-600">请输入打回重填原因</p>}
          </div>
        </div>
      );
    }

    return null;
  }

  function onOkClick(): void {
    if (action === 'STEP_BACK') {
      console.log(stepBackId);
      setShowTips(stepBackId === '' ? true : false);
      if (!stepBackId) return;
      stepTask({ processInstanceId, taskId }, { activityInstanceId: stepBackId, remark: textValue }).then(
        (res) => {
          if (res) {
            closeModal();
            Toast.success('操作成功！');
            history.push('/system/unusual');
          } else {
            Toast.error(res.msg || '');
          }
        },
      );
    }

    if (action === 'DELETE') {
      abandonTask({ processInstanceId, taskId }).then((res) => {
        if (res) {
          closeModal();
          Toast.success('操作成功！');
          history.push('/system/unusual');
        } else {
          Toast.error(res.msg || '');
        }
      });
    }

    if (action === 'APPOINT') {
      const isPass = chosenEmployees.length === 0 || chosenEmployees.length > 1;
      setShowTips(isPass ? true : false);
      if (isPass) return;
      const ids: string[] = [];
      chosenEmployees.map((employ: Employee) => {
        ids.push(employ.id);
      });
      deliverTask({ processInstanceId, taskId }, { handleType: 'DELIVER', handleUserIds: ids }).then(
        (res) => {
          if (res) {
            closeModal();
            Toast.success('操作成功！');
            history.push('/system/unusual');
          } else {
            Toast.error(res.msg || '');
          }
        });
    }

    if (action === 'SEND_BACK') {
      setShowTips(textValue === '' ? true : false);
      if (!textValue) return;
      sendTask({ processInstanceId, taskId }, { remark: textValue }).then((res) => {
        console.log(res);
        if (res) {
          closeModal();
          Toast.success('操作成功！');
          history.push('/system/unusual');
        } else {
          Toast.error(res.msg || '');
        }
      });
    }
  }

  return (
    <>
      <Modal
        title={`${actionValues[action]}`}
        onClose={closeModal}
        footerBtns={[
          {
            key: 'close',
            text: '取消',
            onClick: () => {
              closeModal();
            },
          },
          {
            key: 'sure',
            modifier: 'primary',
            text: '确定',
            onClick: () => onOkClick(),
          },
        ]}
      >
        {
          renderContent()
        }
      </Modal>
      {showReceiverPicker && (
        <ReceiverPicker
          onlyEmployees
          onSubmit={(departments, employees) => {
            const receivers = employees.map((v) => toJS(v));
            setShowPicker(false);
            // @ts-ignore
            setChosenEmployees(receivers);
            return Promise.resolve(true);
          }}
          onCancel={() => setShowPicker(false)}
          title="选择抄送人"
          submitText="确定选择"
          employees={chosenEmployees}
          departments={[]}
        />
      )}
    </>
  );
}

export default ActionModal;
