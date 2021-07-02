import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Tab from '@c/tab';
import Icon from '@c/icon';
import PopConfirm from '@c/pop-confirm';
import PageLoading from '@c/page-loading';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import { Schema } from '@formily/react-schema-renderer';

import { getOperateButtonPer } from '../utils';
import { getSchemaAndRecord } from '../api';
import store from '../store';

type Props = {
  onCancel: () => void;
  goEdit: (rowID: string) => void;
  delData: (rowIDs: string[]) => Promise<unknown>;
  rowID: string;
}

type FormDataProp = {
  label: string;
  key: string;
  value: any;
  fieldSchema: ISchema;
}

function DetailsDrawer({ onCancel, rowID, goEdit, delData }: Props): JSX.Element {
  const [beganClose, setBeganClose] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  // todo handle error case of getSchemaAndRecord
  const {
    isLoading, data, refetch,
  } = useQuery(
    ['GET_SCHEMA_AND_RECORD_FOR_DETAIL'],
    () => getSchemaAndRecord(store.appID, store.pageID, rowID),
  );

  const [details, systems] = useMemo(() => {
    if (!data) {
      return [[], []];
    }

    const { record, schema } = data;
    const _details: FormDataProp[] = [];
    const _systems: FormDataProp[] = [];

    if (!schema && store.appID && store.pageID) {
      refetch();
      return [[], []];
    }

    Object.entries(schema.properties || {}).forEach(([fieldKey, fieldSchema]) => {
      const hasValue = record && (
        record[fieldKey] !== undefined &&
        record[fieldKey] !== null &&
        record[fieldKey] !== ''
      );
      if ((fieldSchema as ISchema)['x-internal']?.isSystem) {
        _systems.push({
          label: fieldSchema.title as string,
          key: fieldKey,
          value: hasValue ? (
            <FormDataValueRenderer schema={fieldSchema as Schema} value={record?.[fieldKey]} />
          ) : <span className='text-gray-300'>——</span>,
          fieldSchema,
        });
        return;
      }

      _details.push({
        label: fieldSchema.title as string,
        key: fieldKey,
        value: hasValue ? (
          <FormDataValueRenderer schema={fieldSchema as Schema} value={record?.[fieldKey]} />
        ) : <span className='text-gray-300'>——</span>,
        fieldSchema,
      });
    });

    return [_details, _systems];
  }, [data]);

  const handleCancel = (): void => {
    setBeganClose(true);
    setTimeout(() => {
      setVisible(true);
      onCancel();
    }, 300);
  };

  const handelDelete = (): void => {
    delData([rowID]).then(() => {
      handleCancel();
    });
  };

  const cardRender = (list: FormDataProp[]): JSX.Element => {
    return (
      <div className='grid gap-20 grid-cols-2'>
        {list.map(({ label, value, key }) => (
          <div className='page-data-info-view' key={key}>
            <div className='text-body2-no-color text-gray-600'>{label}</div>
            {value}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={cs('page-data-drawer-modal-mask', {
        'page-data-drawer-began-close': beganClose,
        'page-data-drawer-close': visible,
      })}
    >
      <div className='page-data-drawer-container'>
        <div className='page-data-drawer-header'>
          <span className='text-h5'>{store.pageName}</span>
          <div className='flex items-center gap-x-12'>
            {getOperateButtonPer(3, store.authority) && (
              <span onClick={() => goEdit(data?.record?._id || '')} className='icon-text-btn'>
                <Icon size={20} name='edit' />
                修改
              </span>
            )}
            {getOperateButtonPer(4, store.authority) && (
              <PopConfirm content='确认删除该数据？' onOk={handelDelete} >
                <span className='icon-text-btn'><Icon size={20} name='delete' />删除</span>
              </PopConfirm>
            )}
            <Icon onClick={handleCancel} clickable changeable name='close' size={24} />
          </div>
        </div>
        {isLoading ? (
          <div className='relative h-280'><PageLoading /></div>
        ) : (
          <div className='page-data-drawer-main-content'>
            <Tab
              className='rounded-12'
              items={[
                {
                  id: 'details',
                  name: '详细信息',
                  content: cardRender(details),
                },
                {
                  id: 'system',
                  name: '系统信息',
                  content: cardRender(systems),
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default observer(DetailsDrawer);
