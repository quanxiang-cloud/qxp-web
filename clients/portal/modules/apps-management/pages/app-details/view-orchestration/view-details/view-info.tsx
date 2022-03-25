import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Tab from '@c/tab';
import Icon from '@c/icon';
import Button from '@c/button';

import ViewRelated from './view-related';
import { View, ViewType } from '../types.d';

type Props = {
  view: View;
}

function ViewInfo({ view }: Props): JSX.Element {
  const { type } = view;
  const history = useHistory();
  const { appID } = useParams<{ appID: string }>();

  function goPageDesign(): void {
    history.push(`/apps/page-design/${view.id}/${appID}?pageName=${view.name}`);
  }

  function goFormBuild(): void {
    history.push(`/apps/formDesign/formBuild/${view.id}/${appID}?pageName=${view.name}`);
  }

  if (type === ViewType.SchemaView) {
    return (
      <div className='relative flex-1 overflow-hidden p-16'>
        <div className='px-16 py-8 rounded-8 border-1 flex items-center'>
          <div className="page-details-icon">
            <Icon
              size={24}
              type="dark"
              name='view'
            />
          </div>
          <div className='flex-1 grid grid-cols-6 mr-48'>
            {[{ title: '页面类型', value: '自定义页面' }].map(({ title, value }) => {
              return (
                <div key={title}>
                  <p className={!value ? 'text-gray-400' : ''}>{value ? value : '-'}</p>
                  <p className='page-details-text'>{title}</p>
                </div>
              );
            })}
          </div>
          <Button
            iconName="edit"
            modifier="primary"
            textClassName='app-content--op_btn'
            onClick={goPageDesign}
          >
          设计页面
          </Button>
        </div>
        <Tab
          items={[
            // {
            //   id: 'page-preview',
            //   name: '视图预览',
            //   content: (
            //     <PageSchemaRender
            //       schemaKeys={getSchemaKey(appID, pageID, false)}
            //       version={getVersionKey()}
            //       repository={getRenderRepository()}
            //       maxHeight="calc(100vh - 250px)"
            //     />
            //   ),
            // },
            {
              id: 'relate-info',
              name: '关联信息',
              content: (<ViewRelated />),
            },
          ]}
        />
      </div>
    );
  }

  return (
    <div className='relative flex-1 overflow-hidden p-16'>
      <div className='px-16 py-8 rounded-8 border-1 flex items-center'>
        <div className="page-details-icon">
          <Icon
            size={24}
            type="dark"
            name={view.type === ViewType.TableSchemaView ? 'schema-form' : 'custom-page'}
          />
        </div>
        <div className='flex-1 grid grid-cols-6 mr-48'>
          {/* {pageDescriptions.map(({ title, value }) => {
            return (
              <div key={title}>
                <p className={!value ? 'text-gray-400' : ''}>{value ? value : '-'}</p>
                <p className='page-details-text'>{title}</p>
              </div>
            );
          })} */}
        </div>
        {view.type === ViewType.StaticView ? (
          <>
            <Button
              iconName='edit'
              className="mr-18"
              modifier='primary'
              textClassName='app-content--op_btn'
              onClick={() => console.log('todo edit page')}
            >
            修改页面
            </Button>
            <Button
              iconName="preview"
              textClassName='app-content--op_btn'
              onClick={() => {
                history.push(`/apps/preview/customPage/${appID}/${view.id}`);
              }}
            >
            预览
            </Button>
          </>
        ) : (
          <Button
            iconName="edit"
            modifier="primary"
            textClassName='app-content--op_btn'
            onClick={goFormBuild}
          >
            设计表单
          </Button>
        )}
      </div>
      <ViewRelated />
    </div>
  );
}

export default ViewInfo;
