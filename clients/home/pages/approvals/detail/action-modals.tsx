import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useMutation } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Radio, Input } from 'antd';
import { toJS } from 'mobx';
import { isEmpty } from 'lodash';

import toast from '@lib/toast';
import Modal from '@c/modal';
import Button from '@c/button';
import Icon from '@c/icon';
import ReceiverPicker from '@c/employee-or-department-picker';
import ReceiverList from '@c/employee-receiver-list';
import { buildFormDataReqParams, formDataDiff } from '@home/utils';

import SelectStepBackNode from './select-step-back-node';
import store from './store';
import * as apis from '../api';
import { TaskHandleType } from '../constant';
import actionMap from './action-map';

const { TextArea } = Input;

interface Props {
  flowName?: string;
  schema: ISchema;
  formData: Record<string, unknown>;
  defaultValue: Record<string, unknown>;
  appID: string;
  tableID: string;
}

function ActionModals({
  flowName, formData, defaultValue, schema,
}: Props): JSX.Element | null {
  const { processInstanceID, taskID } = useParams<{ processInstanceID: string; taskID: string; }>();
  const history = useHistory();
  const [form] = Form.useForm();
  const [showReceiverPicker, setShowPicker] = useState(false);
  const [chosenEmployees, setChosenEmployees] = useState<EmployeeOrDepartmentOfRole[]>([]);
  const [stepBackId, setStepBackId] = useState('');
  const { action, modalInfo } = store;
  const [addSignType, setAddSignType] = useState('');
  const [addSignValue, setAddSignValue] = useState('');

  function handleSubmit(): void {
    form.submit();
  }

  function handleFinish(values: any): void {
    if (values.comment !== undefined) {
      store.setModalInfo({ payload: { remark: values.comment || '' } });
    }
    handleTaskMutation.mutate();
  }

  const handleTaskMutation = useMutation((): Promise<any> => {
    if (modalInfo.payload.remark !== undefined) {
      if (modalInfo.payload.remark.length > 100) {
        return Promise.reject(new Error('??????????????????100???'));
      }
    }
    if ([
      TaskHandleType.agree,
      TaskHandleType.refuse,
      TaskHandleType.fill_in,
    ].includes(action as TaskHandleType)) {
      let _formData = {};
      if (isEmpty(defaultValue)) {
        _formData = buildFormDataReqParams(schema, 'create', formData);
      } else {
        const newValue = formDataDiff(formData, defaultValue, schema);
        _formData = buildFormDataReqParams(schema, 'updated', newValue);
      }

      return apis.reviewTask(processInstanceID, taskID, {
        handleType: action,
        remark: modalInfo.payload.remark || '',
        formData: _formData,
      });
    }

    // ??????
    if (action === TaskHandleType.cancel) {
      return apis.cancelTask(processInstanceID);
    }

    // ??????
    if (action === TaskHandleType.deliver) {
      if (!chosenEmployees.length) {
        store.setShowTips(true);
        return Promise.reject(new Error());
      }
      return apis.deliverTask(processInstanceID, taskID, {
        handleType: action,
        remark: modalInfo.payload.remark || '',
        handleUserIds: chosenEmployees.map((v) => v.id),
      });
    }

    // ????????????
    if (action === TaskHandleType.step_back) {
      if (!stepBackId) {
        toast.error('????????????????????????');
        return Promise.reject(new Error());
      }
      return apis.stepBack(processInstanceID, taskID, {
        handleType: action,
        remark: modalInfo.payload.remark || '',
        taskDefKey: stepBackId,
      });
    }

    if (action === TaskHandleType.send_back) {
      const { remark } = modalInfo.payload;
      if (!remark) {
        store.setShowTips(true);
        return Promise.reject(new Error());
      }
      return apis.sendBack(processInstanceID, taskID, {
        handleType: action,
        remark,
      });
    }

    // ??????
    if (action === TaskHandleType.cc) {
      if (!chosenEmployees.length) {
        store.setShowTips(true);
        return Promise.reject(new Error());
      }
      return apis.ccFLow(processInstanceID, taskID, {
        handleType: action,
        remark: modalInfo.payload.remark || '',
        handleUserIds: chosenEmployees.map((v) => v.id),
      });
    }

    // ????????????/ ????????????
    if (action === TaskHandleType.hasCcHandleBtn) {
      return apis.readAll([taskID]);
    }

    // ??????
    if (action === TaskHandleType.add_sign) {
      if (!chosenEmployees.length) {
        store.setShowTips(true);
        return Promise.reject(new Error());
      }
      return apis.signTask(processInstanceID, taskID, {
        assignee: chosenEmployees,
        multiplePersonWay: addSignValue,
        type: addSignType,
      });
    }

    // ????????????
    if (action === TaskHandleType.read) {
      if (!chosenEmployees.length) {
        store.setShowTips(true);
        return Promise.reject(new Error());
      }
      return apis.readFlow(processInstanceID, taskID, {
        handleType: action,
        remark: modalInfo.payload.remark || '',
        handleUserIds: chosenEmployees.map((v) => v.id),
      });
    }

    // ????????????
    if (action === TaskHandleType.hasReadHandleBtn) {
      return apis.handleRead(processInstanceID, taskID, {});
    }

    // ????????????
    if (action === TaskHandleType.hasResubmitBtn) {
      let _formData = {};
      if (isEmpty(defaultValue)) {
        _formData = buildFormDataReqParams(schema, 'create', formData);
      } else {
        const newValue = formDataDiff(formData, defaultValue, schema);
        _formData = buildFormDataReqParams(schema, 'updated', newValue);
      }
      return apis.resubmit(processInstanceID, _formData);
    }

    // ??????
    if (action === TaskHandleType.hasCancelBtn) {
      return apis.cancelTask(processInstanceID);
    }

    // ??????
    if (action === TaskHandleType.hasUrgeBtn) {
      return apis.taskUrge(processInstanceID);
    }

    return Promise.reject(new Error(`????????????: ${action}`));
  }, {
    onSuccess: () => {
      toast.success('????????????');
      store.reset();
      setChosenEmployees([]);
      history.push('/approvals?list=todo');
    },
    onError: (err: Error) => {
      if (!err) {
        return;
      }
      toast.error(err.message || '????????????');
    },
  });

  const renderContent = (): JSX.Element | undefined => {
    const { payload } = store.modalInfo;
    if ([
      TaskHandleType.agree,
      TaskHandleType.refuse,
      TaskHandleType.fill_in].includes(action as TaskHandleType)
    ) {
      return (
        <Form.Item
          className="w-full"
          name="comment"
          rules={[
            { required: store.modalInfo.require, message: `??????${actionMap[action]?.text}??????` },
          ]}
        >
          <TextArea
            rows={4}
            placeholder={`??????${actionMap[action]?.text}??????`}
          />
        </Form.Item>
      );
    }

    // ??????
    if (action === TaskHandleType.cancel) {
      return (
        <p>??????????????????????????????????????????????????????????????????</p>
      );
    }

    // ??????
    if (action === TaskHandleType.hasCancelBtn) {
      return (
        <p>??????????????????????????????????????????????????????????????????</p>
      );
    }

    // ??????
    if (action === TaskHandleType.deliver) {
      return (
        <div>
          <div className="mb-24">
            <Button iconName="add" onClick={() => setShowPicker(true)}>???????????????</Button>
            {store.showTips && !chosenEmployees.length && <p className="text-red-600">??????????????????</p>}
          </div>
          <ReceiverList
            className="mb-24"
            receivers={chosenEmployees}
            onRemove={(id) => {
              setChosenEmployees((current) => current.filter(
                (item) => item.id !== id),
              );
            }} />
          <TextArea
            rows={4}
            name="comment"
            placeholder={`??????${actionMap[action]?.text}?????? (??????)`}
            onChange={(e) => store.setModalInfo({ payload: { remark: e.target.value } })}
          />
        </div>
      );
    }

    if (action === TaskHandleType.step_back) {
      const setStep = (id: string): void => {
        setStepBackId(id);
      };
      return (
        <div>
          <p className="text-yellow-600 flex items-center mb-24">
            <Icon name="info" className="text-yellow-600 mr-8" />
            ???????????????????????????????????????????????????????????????????????????????????????
          </p>
          <SelectStepBackNode onChange={setStep} />
          <div style={{ width: '500px' }}>
            <TextArea
              rows={4}
              name="comment"
              placeholder={`??????${actionMap[action]?.text}?????? (??????)`}
              onChange={(e) => {
                store.setModalInfo({ payload: { remark: e.target.value } });
              }}
            />
          </div>
        </div>
      );
    }

    // ????????????
    if (action === TaskHandleType.send_back) {
      return (
        <div>
          <p className="text-yellow-600 flex items-center mb-24">
            <Icon name="info" className="text-yellow-600 mr-8" />
            ????????????????????????????????????????????????????????????????????????????????????????????????
          </p>
          <div>
            <TextArea
              rows={4}
              name="comment"
              placeholder={`??????${actionMap[action]?.text}??????`}
              onChange={(e) => {
                store.setShowTips(!!e.target.value);
                store.setModalInfo({ payload: { remark: e.target.value } });
              }}
            />
            {store.showTips && !payload.remark && <p className="text-red-600">???????????????????????????</p>}
          </div>
        </div>
      );
    }

    // ??????
    if (action === TaskHandleType.cc) {
      return (
        <div>
          <div className="mb-24">
            <Button iconName="add" onClick={() => setShowPicker(true)}>???????????????</Button>
            {store.showTips && !chosenEmployees.length && <p className="text-red-600">??????????????????</p>}
          </div>
          <ReceiverList
            className="mb-24"
            receivers={chosenEmployees}
            onRemove={(id) => {
              setChosenEmployees((current) => current.filter(
                (item) => item.id !== id),
              );
            }} />
          <TextArea
            rows={4}
            name="comment"
            placeholder={`??????${actionMap[action]?.text}?????? (??????)`}
            onChange={(e) => store.setModalInfo({ payload: { remark: e.target.value } })}
          />
        </div>
      );
    }

    // ????????????/ ????????????
    if (action === TaskHandleType.hasCcHandleBtn) {
      return (
        <p>??????????????????????????????????</p>
      );
    }

    // ??????
    if (action === TaskHandleType.add_sign) {
      return (
        <div>
          <div className="mb-24">
            <Button className="mb-12" iconName="add" onClick={() => setShowPicker(true)}>???????????????</Button>
            {store.showTips && !chosenEmployees.length && <p className="text-red-600">??????????????????</p>}
            {<Radio.Group className="block" onChange={(e) => {
              setAddSignType(e.target.value);
            }
            }>
              <Radio value={'BEFORE'}>??????????????????</Radio>
              <Radio value={'AFTER'}>??????????????????</Radio>
            </Radio.Group>}
            {chosenEmployees.length > 1 && (<Radio.Group onChange={(e) => {
              setAddSignValue(e.target.value);
            }}>
              <Radio value={'and'}>??????</Radio>
              <Radio value={'or'}>??????</Radio>
            </Radio.Group>)}
          </div>
          <ReceiverList
            className="mb-24"
            receivers={chosenEmployees}
            onRemove={(id) => {
              setChosenEmployees((current) => current.filter(
                (item) => item.id !== id),
              );
            }} />
        </div>
      );
    }

    // ????????????
    if (action === TaskHandleType.read) {
      return (
        <div>
          <div className="mb-24">
            <Button iconName="add" onClick={() => setShowPicker(true)}>???????????????</Button>
            {store.showTips && !chosenEmployees.length && <p className="text-red-600">??????????????????</p>}
          </div>
          <ReceiverList
            className="mb-24"
            receivers={chosenEmployees}
            onRemove={(id) => {
              setChosenEmployees((current) => current.filter(
                (item) => item.id !== id),
              );
            }} />
          <TextArea
            rows={4}
            name="comment"
            placeholder={`??????${actionMap[action]?.text}?????? (??????)`}
            onChange={(e) => store.setModalInfo({ payload: { remark: e.target.value } })}
          />
        </div>
      );
    }

    // ????????????
    if (action === TaskHandleType.hasReadHandleBtn) {
      return (
        <div>
          <TextArea
            rows={4}
            name="comment"
            placeholder={`??????${actionMap[action]?.text}?????? (??????)`}
            onChange={(e) => store.setModalInfo({ payload: { remark: e.target.value } })}
          />
        </div>
      );
    }

    // // ????????????
    // if (action === TaskHandleType.hasResubmitBtn) {

    // }

    // ??????
    if (action === TaskHandleType.hasUrgeBtn) {
      return (
        <div>??????????????????????????????</div>
      );
    }
  };

  if (!store.modalOpen) {
    return null;
  }

  return (
    <>
      <Modal
        title={`${store.modalInfo.title} ${flowName || ''}`}
        // title={`${store.modalInfo.title} ${store.taskItem.taskName || ''}`}
        footerBtns={[
          {
            key: 'close',
            text: '??????',
            onClick: () => {
              store.openModal(false);
              store.reset();
              setStepBackId('');
            },
          },
          {
            key: 'sure',
            modifier: 'primary',
            text: `??????${store.modalInfo.title}`,
            onClick: handleSubmit,
          },
        ]}
        onClose={() => {
          store.openModal(false);
          store.reset();
          setStepBackId('');
        }}
      >
        <Form className="p-20" form={form} layout="vertical" onFinish={handleFinish}>
          {renderContent()}
        </Form>
      </Modal>

      {showReceiverPicker && (
        <ReceiverPicker
          onlyEmployees
          onSubmit={(_, employees) => {
            const receivers = employees.map((v) => toJS(v));
            setShowPicker(false);
            setChosenEmployees(receivers);
            return Promise.resolve(true);
          }}
          onCancel={() => setShowPicker(false)}
          title="???????????????"
          submitText="????????????"
          employees={chosenEmployees}
          departments={[]}
        />
      )}
    </>

  );
}

export default observer(ActionModals);
