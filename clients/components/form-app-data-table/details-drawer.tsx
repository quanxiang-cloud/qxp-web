import React, { useState, useMemo, useContext } from 'react';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Tab from '@c/tab2';
import Icon from '@c/icon';
import PopConfirm from '@c/pop-confirm';
import PageLoading from '@c/page-loading';

import { getTableCellData, operateButton } from './utils';
import { StoreContext } from './context';
import { getSchemaAndRecord } from './api';
import SubTable from './sub-table';

type Props = {
  onCancel: () => void;
  rowID: string;
}

type FormDataProp = {
  label: string;
  key: string;
  value: any;
  fieldSchema: ISchema;
}

function DetailsDrawer({ onCancel, rowID }: Props) {
  const store = useContext(StoreContext);
  const [beganClose, setBeganClose] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  // todo handle error case of getSchemaAndRecord
  const { isLoading, data } = useQuery([], () => getSchemaAndRecord(store.appID, store.pageID, rowID));

  const [details, systems] = useMemo(() => {
    if (!data) {
      return [[], []];
    }

    const { record, schema } = data;
    const _details: FormDataProp[] = [];
    const _systems: FormDataProp[] = [];

    Object.entries(schema.properties || {}).forEach(([fieldKey, fieldSchema]) => {
      // ts bug?
      if ((fieldSchema as ISchema)['x-internal']?.isSystem) {
        _systems.push({
          label: fieldSchema.title as string,
          key: fieldKey,
          value: getTableCellData(record[fieldKey], fieldSchema),
          fieldSchema,
        });
        return;
      }

      _details.push({
        label: fieldSchema.title as string,
        key: fieldKey,
        value: getTableCellData(record[fieldKey], fieldSchema),
        fieldSchema,
      });
    });

    return [_details, _systems];
  }, [data]);

  const handleCancel = () => {
    setBeganClose(true);
    setTimeout(() => {
      setVisible(true);
      onCancel();
    }, 300);
  };

  const delData = () => {
    store.delFormData([rowID]).then(() => {
      handleCancel();
    });
  };

  const cardRender = (list: FormDataProp[]) => {
    return (
      <div className='grid gap-20 grid-cols-2'>
        {list.map(({ label, value, key, fieldSchema }) => (
          <div className='page-data-info-view' key={key}>
            <div className='text-body2-no-color text-gray-600'>{label}</div>
            {fieldSchema?.['x-component']?.toLowerCase() === 'subtable' && (
              <SubTable value={value as Record<string, unknown>[]} fieldKey={key} />
            )}
            {!Array.isArray(value) && (
              <div className='text-body2 truncate'>{value}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const title = store.tableColumns.length && data?.record ?
    (store.tableColumns[0] as any).accessor(data?.record) : '';

  return (
    <div
      className={cs('page-data-drawer-modal-mask', {
        'page-data-drawer-began-close': beganClose,
        'page-data-drawer-close': visible,
      })}
    >
      <div className='page-data-drawer-container'>
        <div className='page-data-drawer-header'>
          <span className='text-h5'>{store.pageName}：{title}</span>
          <div className='flex items-center gap-x-12'>
            {operateButton(3, store.authority, (
              <span onClick={() => store.goEdit(data?.record?._id || '')} className='icon-text-btn'>
                <Icon size={20} name='edit' />
                修改
              </span>
            ))}
            {operateButton(4, store.authority, (
              <PopConfirm content='确认删除该数据？' onOk={delData} >
                <span className='icon-text-btn'><Icon size={20} name='delete' />删除</span>
              </PopConfirm>
            ))}
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
