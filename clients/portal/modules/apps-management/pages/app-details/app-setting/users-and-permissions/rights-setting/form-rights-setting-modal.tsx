import React, { useEffect, useState, useRef } from 'react';
import cs from 'classnames';

import Modal from '@c/modal';
import Tab from '@c/no-content-tab';
import PageLoading from '@c/page-loading';
import AbsoluteCentered from '@c/absolute-centered';
import toast from '@lib/toast';
import { getTableSchema } from '@lib/http-client';
import schemaToFields from '@lib/schema-convert';

import Authorized from './authorized';
import DataPermission from './data-permission';
import FieldPermissions from './field-permissions';
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

function RightsSettingModal({ onCancel, rightsGroupID, pageForm }: Props): JSX.Element {
  const [submitLoading, setSubLoading] = useState(false);
  const [fields, setFields] = useState<SchemaFieldItem[]>([]);
  const [activeTab, setActiveTab] = useState('authorized');
  const [perData, setPerData] = useState<PerData>({
    conditions: {},
    schema: null,
    authority: 0,
  });
  const [loading, setLoading] = useState(true);
  const fieldRef = useRef<{ getFieldPer:() => any }>(null);
  const authorizedRef = useRef<{ getAuthorizedPer:() => number }>(null);
  const dataPerRef = useRef<{ getDataPer:() => Promise<Condition[]> }>(null);

  const handleSave = () => {
    setSubLoading(true);
    dataPerRef.current?.getDataPer().then((conditions) => {
      const authority = authorizedRef.current?.getAuthorizedPer() || 0;
      if (authority === 0) {
        store.deleteFormPer(pageForm.id, rightsGroupID).then(() => {
          store.updatePerFormList({ ...pageForm, authority: 0 }, rightsGroupID);
          onCancel();
        });
        return;
      }

      if (conditions) {
        savePer(store.appID, {
          formID: pageForm.id,
          perGroupID: rightsGroupID,
          schema: fieldRef.current?.getFieldPer(),
          conditions,
          authority,
        }).then(() => {
          toast.success('保存成功!');
          store.updatePerFormList({ ...pageForm, authority }, rightsGroupID);
          onCancel();
        }).catch(() => {
          setSubLoading(false);
        });
      } else {
        setSubLoading(false);
        toast.error('数据权限填写不完整');
      }
    });
  };

  useEffect(() => {
    Promise.all([
      getTableSchema(store.appID, pageForm.id),
      fetchPerData(store.appID, { formID: pageForm.id, perGroupID: rightsGroupID }),
    ]).then(([schemaRes, perDataRes]: any) => {
      const { schema } = schemaRes || {};
      if (schema) {
        const fields = schemaToFields(schema);
        setFields(fields.sort((a, b) => (a as any)['x-index'] - (b as any)['x-index']));
        const { dataAccess, filter, opt } = perDataRes as any;
        setPerData({
          conditions: dataAccess ? dataAccess.conditions : {},
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
          iconName: 'close',
          onClick: onCancel,
        },
        {
          key: 'ok',
          text: '保存',
          iconName: 'check',
          modifier: 'primary',
          loading: submitLoading,
          onClick: handleSave,
        },
      ]}
    >
      {loading && (
        <div className='h-56 p-20'>
          <PageLoading />
        </div>
      )}
      {!loading && fields.length !== 0 && (
        <div className="p-20">
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
      {!loading && fields.length === 0 && (
        <div className='h-56 p-20'>
          <AbsoluteCentered>
            未配置表单
          </AbsoluteCentered>
        </div>
      )}
    </Modal>
  );
}

export default RightsSettingModal;
