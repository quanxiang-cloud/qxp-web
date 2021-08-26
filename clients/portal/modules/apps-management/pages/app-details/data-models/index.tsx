import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Input, FormMegaLayout, FormSlot } from '@formily/antd-components';
import { SchemaForm, SchemaMarkupField as Field, FormButtonGroup } from '@formily/antd';

import Button from '@c/button';
import TextHeader from '@c/text-header';

import DataModelsTable from './data-models-table';
import store from './store';

import './index.scss';

const CONTAINER_CLASS = 'p-20 bg-white rounded-12';

function DataModels(): JSX.Element {
  const { appID } = useParams<AppParams>();

  useEffect(() => {
    store.appID = appID;
  }, [appID]);

  useEffect(() => {
    store.fetchDataModels();
  }, []);

  return (
    <div className='flex-1 overflow-hidden'>
      <TextHeader
        title='数据模型管理'
        desc=''
        className="app-list-header header-background-image"
        itemClassName='items-center'
      />
      <div style={{ height: 'calc(100vh - 126px)' }} className='p-20 flex flex-col'>
        <div className={`${CONTAINER_CLASS} mb-16 data-models-filter`}>
          <SchemaForm onSubmit={(params) => store.setParams(params)} components={{ Input }}>
            <FormMegaLayout grid full autoRow>
              <Field x-component='Input' type="string" title="模型名称" name="title" />
              <FormSlot>
                <FormButtonGroup align="right">
                  <Button type='submit'>查询</Button>
                </FormButtonGroup>
              </FormSlot>
            </FormMegaLayout>
          </SchemaForm>
        </div>
        <div style={{ height: 'calc(100% - 92px)' }} className={`${CONTAINER_CLASS}`}>
          <DataModelsTable />
        </div>
      </div>
    </div>
  );
}

export default observer(DataModels);
