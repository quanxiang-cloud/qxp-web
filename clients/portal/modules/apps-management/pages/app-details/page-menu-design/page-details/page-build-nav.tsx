import React, { MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import Icon from '@c/icon';

type Props = {
  pageId: string | undefined;
  pageName: string | undefined;
  appID: string | undefined;
  setOpenModal: (modalType: string) => void;
}

function PageBuildNav({ pageId = '', pageName, appID = '', setOpenModal }: Props): JSX.Element {
  const BUILD_NAV = [
    {
      title: '新建表单',
      desc: '表单页通常用来做数据的收集或是单据填制。',
      type: 'form',
      url: '/apps/formDesign/formBuild',
    },
    {
      title: '新建自定义页面',
      desc: '可以上传静态的页面代码，包含 html、javascript、css、图片等。',
      type: 'customize',
      url: '/apps/formDesign/formBuild',
      onClick: onShowAddCustomPage,
    },
    // { title: '新建流程表单', desc: '流程审批。', type: 'flow', url: '' },
    // { title: '新建仪表', desc: '仪表盘是数据可视化工具，可用于数据展示分析。', type: 'meter', url: '' },
  ];

  function onShowAddCustomPage(e: MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    setOpenModal('create');
  }

  return (
    <div className='app-page-build-nav'>
      {BUILD_NAV.map(({ title, desc, type, url, onClick }) => (
        <Link
          key={type}
          onClick={onClick}
          to={`${url}/${pageId}/${appID}?pageName=${pageName}`}
          className={`app-page-build-nav-bg-${type} app-page-build-nav-item`}
        >
          <Icon
            size={45}
            type="light"
            className='mr-8'
            name={type === 'form' ? 'schema-form' : 'custom-page'}
          />
          <div className='flex-1 text-white'>
            <p className='text-h5-blod'>{title}</p>
            <p className='text-caption-no-color'>{desc}</p>
          </div>
          <Icon name='arrow_right_alt' type='light' size={24} />
        </Link>
      ))}
    </div>
  );
}

export default PageBuildNav;
