import React, { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  pageId: string | undefined;
  pageName: string | undefined;
  appID: string | undefined;
  setOpenModal: (modalType: string) => void;
}

function PageBuildNav({ pageId = '', pageName, appID = '', setOpenModal }: Props): JSX.Element {
  const [show, setShow] = useState('');
  const BUILD_NAV = [
    {
      title: '新建表单',
      desc: '表单页通常用来做数据的收集或是单据填制。',
      type: 'form',
      url: '/apps/formDesign/formBuild',
    },
    {
      title: '新建自定义页面',
      desc: '自定义页通常用做信息展示、门户管理或业务深度定制。',
      type: 'page',
      url: '/apps/page-design',
    },
    {
      title: '上传静态页面',
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
          className={`app-page-build-nav-${type}`}
        >
          <div className='app-page-build-nav-bg' />
          <div className='px-16 pt-16 pb-20 white'>
            <div className='text-gray-900 text-12 font-semibold'>{title}</div>
            <div className='text-gray-600 text-12'>{desc}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default PageBuildNav;
