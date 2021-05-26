import React, { useEffect, useState, useRef } from 'react';
import cs from 'classnames';

import Modal from '@c/modal';
import Tab from '@portal/modules/apps-management/components/tab';
import PageLoading from '@c/page-loading';
import toast from '@lib/toast';

import Authorized from './authorized';
import DataPermission from './data-permission';
import FieldPermissions from './field-permissions';
import { fetchFormScheme } from '../../../api';
import { fetchPerData, savePer } from '../api';
import store from '../store';

type Props = {
  onCancel: () => void;
  rightsGroupID: string;
  pageForm: PageInfo;
}

type PerData = {
  conditions: any,
  schema: any,
  authority: number,
}

function RightsSettingModal({ onCancel, rightsGroupID, pageForm }: Props) {
  const [fields, setFields] = useState<Fields[]>([]);
  const [activeTab, setActiveTab] = useState('authorized');
  const [perData, setPerData] = useState<PerData>({
    conditions: null,
    schema: null,
    authority: 0,
  });
  const [loading, setLoading] = useState(true);
  const fieldRef = useRef<{ getFieldPer:() => any }>(null);
  const authorizedRef = useRef<{ getAuthorizedPer:() => number }>(null);
  const dataPerRef = useRef<{ getDataPer:() => Promise<Condition[]> }>(null);

  const handleSave = () => {
    dataPerRef.current?.getDataPer().then((conditions)=>{
      console.log('conditions: ', conditions);
      if (conditions) {
        savePer(store.appID, {
          formID: pageForm.id,
          perGroupID: rightsGroupID,
          authority: authorizedRef.current?.getAuthorizedPer() || 0,
          schema: fieldRef.current?.getFieldPer(),
          conditions,
        }).then(() => {
          toast.success('保存成功!');
          onCancel();
        });
      } else {
        toast.error('数据权限填写不完整');
      }
    });
  };

  useEffect(() => {
    Promise.all([
      fetchFormScheme(store.appID, pageForm.id),
      fetchPerData(store.appID, { formID: pageForm.id, perGroupID: rightsGroupID }),
    ]).then(([schemeRes, perDataRes]) => {
      if (schemeRes.data) {
        const fieldsMap = schemeRes.data.schema.properties;
        const fieldsTmp: Fields[] = [];
        Object.keys(fieldsMap).forEach((key) => {
          if (key !== '_id') {
            fieldsTmp.push({ ...fieldsMap[key], id: key });
          }
        });
        setFields(fieldsTmp.sort((a, b) => (a as any)['x-index'] - (b as any)['x-index']));
        const { dataAccess, filter, opt } = perDataRes as any;
        setPerData({
          conditions: dataAccess ? dataAccess.conditions : null,
          schema: filter ? filter.schema : null,
          authority: opt ? opt.authority : 0,
        });
      }
      setLoading(false);
    });
  }, []);

  return (
    <Modal
      title='设置表单权限'
      onClose={onCancel}
      footerBtns={[
        {
          key: 'close',
          text: '取消',
          onClick: onCancel,
        },
        {
          key: 'ok',
          text: '保存',
          modifier: 'primary',
          onClick: handleSave,
        },
      ]}
    >
      {loading ? (
        <div className='h-56'>
          <PageLoading />
        </div>
      ) : (
        <div>
          <Tab
            className='mb-16'
            activeTab={activeTab}
            size='small'
            onChange={(key: string) => setActiveTab(key)}
            tabs={[
              {
                label: '操作权限',
                key: 'authorized',
              },
              {
                label: '字段权限',
                key: 'fieldPermissions',
              },
              {
                label: '数据权限',
                key: 'dataPermission',
              },
            ]}
          />
          <Authorized
            authorized={perData.authority}
            ref={authorizedRef}
            className={cs({ ['rights-hidden']: activeTab !== 'authorized' })}
          />
          <FieldPermissions
            fieldPer={perData.schema}
            ref={fieldRef}
            className={cs({ ['rights-hidden']: activeTab !== 'fieldPermissions' })}
            fields={fields}
          />
          <DataPermission
            dataPer={perData.conditions}
            ref={dataPerRef}
            className={cs({ ['rights-hidden']: activeTab !== 'dataPermission' })}
            fields={fields}
          />
        </div>
      )}
    </Modal>
  );
}

export default RightsSettingModal;
