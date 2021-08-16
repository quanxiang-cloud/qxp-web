import React, { MouseEvent, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Icon from '@c/icon';
import Modal from '@c/modal';
import toast from '@lib/toast';
import Select from '@c/select';

import { fetchCustomPageList } from '../../api';
import { CustomPageInfo } from '../../type';

type Props = {
  pageId: string | undefined;
  pageName: string | undefined;
  appID: string | undefined;
}

function PageBuildNav({ pageId, pageName, appID }: Props): JSX.Element {
  const [openModal, setOpenModal] = useState(false);
  const [customPageList, setCustomPageList] = useState<LabelValue[]>([]);
  const history = useHistory();
  const BUILD_NAV = [
    {
      title: '创建表单页面',
      desc: '表单页通常用来做数据的收集或是单据填制。',
      type: 'form',
      url: '/apps/formDesign/formBuild',
    },
    {
      title: '自定义页面',
      desc: '自定义页面通常用来做...',
      type: 'customize',
      url: '/apps/formDesign/formBuild',
      onClick: onShowAddCustomPage,
    },
    // { title: '新建流程表单', desc: '流程审批。', type: 'flow', url: '' },
    // { title: '新建仪表', desc: '仪表盘是数据可视化工具，可用于数据展示分析。', type: 'meter', url: '' },
  ];

  function onShowAddCustomPage(e: MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    setOpenModal(true);
  }

  function onSubmit(): void {
    onClose();
  }

  function onClose(): void {
    setOpenModal(false);
  }

  useEffect(() => {
    if (!openModal) {
      return;
    }
    fetchCustomPageList(appID as string, {})
      .then(({ list = [] }) => {
        setCustomPageList(list.map(({ name, id }: CustomPageInfo) => {
          return { label: name, value: id };
        }));
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [openModal]);

  return (
    <>
      <div className='app-page-build-nav rounded-tl-12 rounded-tr-12'>
        {BUILD_NAV.map(({ title, desc, type, url, onClick }) => (
          <Link
            key={type}
            onClick={onClick}
            to={`${url}/${pageId}/${appID}?pageName=${pageName}`}
            className={`app-page-build-nav-bg-${type} app-page-build-nav-item`}
          >
            <Icon className='mr-8' name='list_alt' type='light' size={44} />
            <div className='flex-1 text-white'>
              <p className='text-h5-blod'>{title}</p>
              <p className='text-caption-no-color'>{desc}</p>
            </div>
            <Icon name='arrow_right_alt' type='light' size={24} />
          </Link>
        ))}
      </div>
      {openModal && (
        <Modal
          title='新建自定义表单'
          onClose={onClose}
          className="text-center"
          footerBtns={[
            {
              key: 'close',
              text: '取消',
              onClick: onClose,
            },
            {
              key: 'sure',
              text: '确定',
              modifier: 'primary',
              onClick: onSubmit,
            },
          ]}
        >
          <div className="flex items-center p-36">
            <span className="text-red-500 mr-4">*</span>
            选择自定义页面:
            <Select
              defaultValue="one"
              placeholder="请选择"
              className="flex-1 ml-10"
              options={customPageList}
              optionClassName="max-h-200 overflow-auto"
            />
          </div>
          <div className="mb-28">
            没找到?
            <span
              className='text-btn ml-8'
              onClick={() => history.push(`/apps/details/${appID}/custom_page`)}
            >
              去创建
            </span>
          </div>
        </Modal>
      )}
    </>
  );
}

export default PageBuildNav;
