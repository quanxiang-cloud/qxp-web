import React, { useState, useMemo, useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Tab from '@c/tab2';
import Icon from '@c/icon';
import PopConfirm from '@c/pop-confirm';
import PageLoading from '@c/page-loading';

import { getTableCellData, operateButton } from './utils';
import { StoreContext } from './context';

type Props = {
  onCancel: () => void;
  rowID: string;
}

type InfoData = {
  label: string;
  key: string;
  value: string | React.ReactNode;
}

function DetailsDrawer({ onCancel, rowID }: Props) {
  const store = useContext(StoreContext);
  const [beganClose, setBeganClose] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [formDataItem, setInfoData] = useState(null);

  useEffect(() => {
    store.fetchFormDataDetails(rowID).then((res: any) => {
      setInfoData(res);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const [details, systems] = useMemo(() => {
    if (formDataItem === null) {
      return [[], []];
    }
    const _details: InfoData[] = [];
    const _systems: InfoData[] = [];
    store.fields.forEach((field: any) => {
      if (field['x-internal'].isSystem) {
        _systems.push({
          label: field.title,
          key: field.id,
          value: getTableCellData((formDataItem as any)[field.id], field),
        });
      } else {
        _details.push({
          label: field.title,
          key: field.id,
          value: getTableCellData((formDataItem as any)[field.id], field),
        });
      }
    });
    return [_details, _systems];
  }, [formDataItem]);

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

  const cardRender = (list: InfoData[]) => {
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

  const title = store.tableColumns.length && formDataItem ?
    (store.tableColumns[0] as any).accessor(formDataItem) : '';

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
              <span
                onClick={() => store.goEdit(formDataItem)}
                className='icon-text-btn'
              >
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
        {loading ? (
          <div className='relative h-280'>
            <PageLoading />
          </div>
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
                }]}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default observer(DetailsDrawer);
