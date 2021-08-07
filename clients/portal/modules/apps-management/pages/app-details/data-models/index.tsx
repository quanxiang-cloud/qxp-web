import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Input, FormMegaLayout, FormSlot } from '@formily/antd-components';
import { SchemaForm, SchemaMarkupField as Field, FormButtonGroup } from '@formily/antd';

import Button from '@c/button';

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
    <div className='p-20 flex flex-col'>
      <div className={`${CONTAINER_CLASS} mb-16 data-models-filter`}>
        <SchemaForm onSubmit={(params) => store.setParams(params)} components={{ Input }}>
          <FormMegaLayout grid full autoRow>
            <Field x-component='Input' type="string" title="模型名称" name="title" />
            <FormSlot>
              <FormButtonGroup align="right">
                <Button type='submit'>提交</Button>
              </FormButtonGroup>
            </FormSlot>
          </FormMegaLayout>
        </SchemaForm>
      </div>
      <div className={CONTAINER_CLASS}>
        <DataModelsTable />
      </div>
    </div>
  );
}

export default observer(DataModels);
