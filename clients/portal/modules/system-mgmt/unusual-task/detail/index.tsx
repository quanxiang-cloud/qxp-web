import React, { useMemo, useState } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import Button from '@c/button';
import Icon from '@c/icon';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import { Schema } from '@formily/react-schema-renderer';
import { isEmpty } from '@lib/utils';

import { getAbnormalTaskForm } from '../api';
import ActionModal from './action-modal';
import FlowModal from './flow-modal';

type FormDataProp = {
  label: string;
  key: string;
  value: any;
  fieldSchema: ISchema;
}

export type Actions = 'STEP_BACK' | 'SEND_BACK' | 'APPOINT' | 'DELETE';

function UnusualTaskDetail(): JSX.Element {
  const [currAction, setCurrAction] = useState<Actions | ''>('');
  const [modalType, setModalType] = useState('');
  const history = useHistory();
  const urlParams = useParams<{ flowInstanceId: string, processInstanceId: string, taskId: string, status: string }>();
  const { processInstanceId, taskId, status, flowInstanceId } = urlParams;

  const { data: formDataItem } = useQuery('GET_ABNORMAL_TASK_FORM', () => getAbnormalTaskForm({
    processInstanceId,
    taskId,
  }));

  const [details] = useMemo(() => {
    if (!formDataItem) {
      return [[], []];
    }

    const _details: FormDataProp[] = [];
    const _systems: FormDataProp[] = [];
    const { formSchema, formData } = formDataItem.taskDetailModels[0];

    Object.entries(formSchema.table.properties || {}).forEach(([fieldKey, fieldSchema]) => {
      const hasValue = formData && !isEmpty(formData[fieldKey]);
      if ((fieldSchema as any)['x-internal']?.isSystem) {
        _systems.push({
          label: fieldSchema.title as string,
          key: fieldKey,
          value: hasValue ? (
            <FormDataValueRenderer schema={fieldSchema as Schema} value={formData?.[fieldKey]} />
          ) : '无数据',
          fieldSchema,
        });
        return;
      }

      _details.push({
        label: fieldSchema.title as string,
        key: fieldKey,
        value: hasValue ? (
          <FormDataValueRenderer schema={fieldSchema as Schema} value={formData?.[fieldKey]} />
        ) : '无数据',
        fieldSchema,
      });
    });

    return [_details, _systems];
  }, [formDataItem]);

  const cardRender = (list: FormDataProp[]): JSX.Element => {
    return (
      <div className='grid gap-20 grid-cols-2'>
        {list.map(({ label, value, key }) => (
          <div className='page-data-info-view' key={key}>
            <div className='text-body2-no-color text-gray-600'>{label}</div>
            <div className='text-body2 truncate'>{value}</div>
          </div>
        ))}
      </div>
    );
  };

  function goBack(): void {
    history.goBack();
  }

  function viewFlow(): void {
    setModalType('flow_modal');
  }

  return (
    <div
      className="py-20 px-58 flex justify-center items-start flex-grow overflow-hidden
      flex-col flex-1"
      style={{
        height: 'calc(100vh - 62px)',
      }}
    >
      {currAction !== '' && (
        <ActionModal
          action={currAction}
          closeModal={() => setCurrAction('')}
        />
      )}
      {
        modalType === 'flow_modal' && <FlowModal flowInstanceId={flowInstanceId} closeModal={() => setModalType('')} />
      }
      <div className='flex items-center'>
        <Icon name='reply' size={20} onClick={goBack} />
        <NavLink to='/system'>系统管理</NavLink>
        <span className="mx-8">/</span>
        <NavLink to='/system/unusual'>异常任务</NavLink>
        <span className="mx-8">/</span>
        <span className='text-black-50 '>异常任务详情</span>
      </div>
      <div
        className="w-full overflow-hidden"
        style={{ height: 'calc(100% - 24px)' }}
      >
        <div className="relative w-full mt-16 rounded-12 bg-white h-full">
          <div className="p-20 flex items-center justify-between">
            <div className="flex">
              {
                Number(status) === 0 && (
                  <>
                    <Button className="mr-8" onClick={() => setCurrAction('STEP_BACK')}>退回某步</Button>
                    <Button className="mr-8" onClick={() => setCurrAction('SEND_BACK')}>打回重填</Button>
                    <Button className="mr-8" onClick={() => setCurrAction('APPOINT')}>指定处理人</Button>
                    <Button onClick={() => setCurrAction('DELETE')}>作废流程</Button>
                  </>
                )
              }
            </div>
            <div className="p-10 flex" onClick={viewFlow}>
              <span>查看流程图</span>
              {/* <Icon name='reply' size={20} onClick={goBack} /> */}
            </div>
          </div>
          <div className="h-1 border-b-2 border-gray-100">
            {cardRender(details)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnusualTaskDetail;
