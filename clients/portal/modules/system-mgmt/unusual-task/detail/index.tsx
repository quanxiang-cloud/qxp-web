import React, { useMemo, useState } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import Button from '@c/button';
import Icon from '@c/icon';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import { isMeanless } from '@lib/utils';
import { buildQueryRef } from '@lib/http-client-form';
import { getFlowFormData } from '@lib/api/flow';
import { schemaToFields } from '@lib/schema-convert';

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
  const urlParams = useParams<{
    flowInstanceId: string,
    processInstanceId: string,
    taskId: string,
    status: string
  }>();
  const { processInstanceId, taskId, status } = urlParams;

  const { data: formDataItem } = useQuery('GET_ABNORMAL_TASK_FORM', () => getAbnormalTaskForm({
    processInstanceId,
    taskId,
  }));

  const { formSchema } = formDataItem?.taskDetailModels[0] || {};

  const { data: formData } = useQuery(['GET_FLOW_FORM_DATA', formSchema], () => {
    if (!formSchema) {
      return Promise.resolve({} as Record<string, any>);
    }
    return getFlowFormData(processInstanceId, taskId, buildQueryRef(formSchema));
  });

  const [details] = useMemo(() => {
    if (!formDataItem) {
      return [[], []];
    }

    const _details: FormDataProp[] = [];
    const _systems: FormDataProp[] = [];

    schemaToFields(formSchema).forEach((field) => {
      const hasValue = formData && !isMeanless(formData[field.id]);
      if (field['x-internal']?.isSystem) {
        _systems.push({
          label: field.title as string,
          key: field.id,
          value: hasValue ? (
            <FormDataValueRenderer schema={field} value={formData?.[field.id]} />
          ) : '?????????',
          fieldSchema: field,
        });
        return;
      }

      _details.push({
        label: field.title as string,
        key: field.id,
        value: hasValue ? (
          <FormDataValueRenderer schema={field} value={formData?.[field.id]} />
        ) : '?????????',
        fieldSchema: field,
      });
    });
    return [_details, _systems];
  }, [formDataItem]);

  const cardRender = (list: FormDataProp[]): JSX.Element => {
    return (
      <div style={{ maxHeight: 'calc(100% - 139px)' }} className='grid gap-20 grid-cols-2 p-20 overflow-auto'>
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
      {modalType === 'flow_modal' && (
        <FlowModal processInstanceId={processInstanceId} closeModal={() => setModalType('')} />
      )}
      <div className='flex items-center'>
        <Icon name='reply' size={20} onClick={goBack} />
        <NavLink to='/system'>????????????</NavLink>
        <span className="mx-8">/</span>
        <NavLink to='/system/unusual'>????????????</NavLink>
        <span className="mx-8">/</span>
        <span className='text-black-50 '>??????????????????</span>
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
                    <Button className="mr-8" onClick={() => setCurrAction('STEP_BACK')}>????????????</Button>
                    <Button className="mr-8" onClick={() => setCurrAction('SEND_BACK')}>????????????</Button>
                    <Button className="mr-8" onClick={() => setCurrAction('APPOINT')}>???????????????</Button>
                    <Button onClick={() => setCurrAction('DELETE')}>????????????</Button>
                  </>
                )
              }
            </div>
            <div className="p-10 flex" onClick={viewFlow}>
              <span>???????????????</span>
              {/* <Icon name='reply' size={20} onClick={goBack} /> */}
            </div>
          </div>
          <div className="border-t-2 border-gray-100">
            {cardRender(details)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnusualTaskDetail;
