import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import Icon from '@c/icon';
import Button from '@c/button';
import Card from '@c/card';
import PageLoading from '@c/page-loading';
import PageBuildNav from './page-build-nav';
import appPagesStore from '../../store';
import './index.scss';

const pageInfoList: Array<LabelValue> = [
  { label: '创建人', value: '喵喵喵' },
  { label: '最后更新人', value: '喵喵喵' },
  { label: '创建方式', value: '基于空白创建' },
  { label: '创建时间', value: '2018-06-20 12:41:50' },
  { label: '最后更新时间', value: '2018-06-20 12:41:50' },
];

function PageDetails(): JSX.Element {
  const {
    curPage, appID, fetchSchemeLoading, setModalType,
  } = appPagesStore;
  const history = useHistory();
  const goFormBuild = (): void => {
    if (appPagesStore.hasSchema) {
      history.push(`/apps/formDesign/formBuild/${curPage.id}/${appID}?pageName=${curPage.name}`);
      return;
    }
  };
  const editPage = (): void => {
    setModalType('editPage');
  };
  const delPage = (): void => {
    setModalType('delPage');
  };

  const linkList = [
    {
      title: '关联工作流',
      action: () => console.log('创建工作流'),
      list: [
        { context: '请假申请工作流', handleClick: () => console.log('跳转请假申请工作流') },
        { context: '申请请假天数自动更新逻辑', handleClick: () => console.log('跳转申请请假天数自动更新逻辑') },
      ],
    },
    {
      title: '已授权角色',
      action: () => console.log('创建角色'),
      list: [
        { context: '超级管理员', handleClick: () => console.log('跳转超级管理员') },
        { context: '公司在职员工通用权限', handleClick: ()=> console.log('跳转公司在职员工通用权限') },
      ],
    },
    {
      title: '关联数据模型',
      list: [
        { context: 'XXXXXXXXX数据模型', handleClick: () => console.log('跳转关联数据模型') },
      ],
    },
    {
      title: '页面设计',
      list: [
        { context: '页面设计', handleClick: goFormBuild },
      ],
    },
  ];

  if (!curPage.id) {
    return <></>;
  }

  return (
    <div className='relative flex-1 overflow-hidden'>
      <div className='page-details-nav bg-white'>
        <div className='px-16 py-20'>
          <span className='text-h6-bold text-gray-400 mr-auto'>页面详情</span>
        </div>
      </div>
      {fetchSchemeLoading && <PageLoading />}
      {!fetchSchemeLoading && (appPagesStore.hasSchema ? (
        <>
          <div className='m-20 p-40 bg-white rounded-12'>
            <div className="flex items-center">
              <Icon className='mr-16' name='menu_book' size={24}/>
              <span className='mr-20 text-h5'>{curPage.name}</span>
              <Button className='mr-16' modifier='primary' onClick={goFormBuild}>设计页面</Button>
              <Button className='mr-16' onClick={editPage}>编辑名称和图标</Button>
              <Button onClick={delPage}>删除</Button>
            </div>
            <p className='pt-20 text-gray-500'>描述列表用于定义术语和相应的描述，使用元件可以快速创建规范的描述列表。</p>
            <div className='pt-20 grid grid-cols-2 gap-16'>
              {pageInfoList.map(({ label, value }) => {
                return (
                  <div key={label}>
                    {label} :
                    <span className='ml-8 text-gray-500'>{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='m-20 rounded-12 grid grid-cols-4 gap-16'>
            {linkList.map(({ title, action, list }) => {
              return (
                <Card
                  key={title}
                  className="px-20"
                  title={title}
                  action={action ? (
                    <div
                      onClick={action}
                      className="transition ease-linear text-black-50 text-underline-no-color"
                    >
                      去创建》
                    </div>) : <></>
                  }
                  itemTitleClassName="text-h5"
                  contentClassName="pb-20 flex-col"
                  content={(
                    <>
                      {list.map(({ context, handleClick }) => {
                        return (
                          <div
                            key={context}
                            className="p-10 flex items-center link-focus"
                            onClick={handleClick}
                          >
                            <Icon name="add_task" size={20} className="mr-6 text-green-600" />
                            <span className="truncate">{context}</span>
                          </div>
                        );
                      })}
                    </>
                  )}
                />
              );
            })}
          </div>
        </>
      ) : (
        <PageBuildNav appID={appID} pageId={curPage.id} pageName={curPage.name} />
      ))}
    </div>
  );
}

export default observer(PageDetails);
