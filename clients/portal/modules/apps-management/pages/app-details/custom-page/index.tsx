import React, { useEffect, useRef, useState } from 'react';
import cs from 'classnames';
import moment from 'moment';
import { useCss } from 'react-use';
import { UnionColumns } from 'react-table';
import { useParams } from 'react-router-dom';
import { Input, Radio } from '@formily/antd-components';
import { SchemaForm, FormButtonGroup } from '@formily/antd';

import Card from '@c/card';
import Icon from '@c/icon';
import Table from '@c/table';
import Modal from '@c/modal';
import toast from '@lib/toast';
import Button from '@c/button';
import Search from '@c/search';
import Pagination from '@c/pagination';
import MoreMenu from '@c/more-menu';

import SCHEMA from './modal-schema';
import FileUpload from './file-upload';
import { CustomPageInfo, Status } from '../type';
import { removeCustomPage, editeCustomPage, fetchCustomPageList } from '../api';

import './index.scss';

type ModalType = 'create' | 'edit' | 'preview';

const COMPONENTS = {
  Input,
  TextArea: Input.TextArea,
  RadioGroup: Radio.Group,
  FileUpload,
};

const DefaultCustomPage: CustomPageInfo = {
  id: '',
  fileSize: '',
  name: '',
  type: 1,
  description: '',
  fileUrl: '',
  createdBy: '',
  status: 0,
  updatedAt: '',
};

function CustomPage(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<ModalType | string>('');
  const [customPageList, setCustomPageList] = useState([]);
  const [customPageCount, setCustomPageCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const selectedRowRef = useRef<CustomPageInfo>(DefaultCustomPage);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const { appID } = useParams<{ appID: string }>();
  const [params, setParams] = useState({ currentPage: 1, pageSize: 10, name: '' });
  const contentHeight = useCss({
    height: 'calc(100% - 56px)',
  });

  const deletePage = (rowInfo: CustomPageInfo): void => {
    if (rowInfo.status === Status.inuse) {
      toast.error(`${rowInfo.name} 页面已被应用，不可删除`);
      return;
    }

    const deleteConfirmModal = Modal.open({
      title: (
        <div className="text-yellow-600 flex items-center">
          <Icon name="info" className="text-current mr-8" size={21}/>
          <span>{`确定要删除${rowInfo.name}页面吗？`}</span>
        </div>
      ),
      content: '删除后，将无法找回该页面。',
      onConfirm: () => {
        removeCustomPage(appID, rowInfo.id).then(fetchPages).then(() => {
          selectedRowRef.current = DefaultCustomPage;
          deleteConfirmModal.close();
          toast.success('删除成功');
        }).catch((err) => {
          return toast.error(err.message);
        });
      },
    });
  };

  const handleChange = (val: string): void => {
    setInputValue(val);
    if (val === '') {
      searchPageName(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      searchPageName(inputValue);
    }
  };

  const searchPageName = (pageName: string): void => {
    setParams({ ...params, name: pageName });
  };

  const onClose = (): void => setModalType('');

  const handleSubmit = async (values: CustomPageInfo): Promise<void> => {
    const params = {
      name: values.name,
      description: values.description,
      fileUrl: values.fileUrl,
      type: values.type,
    };

    // validate
    if (!params.fileUrl) {
      toast.error('请上传ZIP文件');
      return;
    }

    if (modalType === 'create') {
      // await createCustomPage(appID, params).catch((err) => {
      //   return toast.error(err.message);
      // });
      // await fetchPages();
      // onClose();
      // return;
    }

    await editeCustomPage(appID, { id: selectedRowRef.current.id, ...params }).catch((err) => {
      return toast.error(err.message);
    });
    await fetchPages();
    onClose();
  };

  const handleMenuClick = (key: string, rowInfo: CustomPageInfo): void => {
    selectedRowRef.current = rowInfo;

    if (key === 'edit') {
      setModalType('edit');
      return;
    }

    if (key === 'preview') {
      setModalType('preview');
      return;
    }

    if (key === 'delete') {
      deletePage(selectedRowRef.current);
      return;
    }
  };

  function renderOperators(rowInfo: CustomPageInfo) {
    return (
      <MoreMenu
        menus={[
          {
            key: 'preview',
            label: (<span><Icon name="preview" className="mr-10"/>预览</span>),
          },
          {
            key: 'edit',
            label: (<span><Icon name="edit" className="mr-10"/>修改信息</span>),
          },
          {
            key: 'delete',
            label: (<span><Icon name="restore_from_trash" className="mr-10"/>删除页面</span>),
            disabled: rowInfo.status === Status.inuse,
          },
        ]}
        onMenuClick={(key) => handleMenuClick(key, rowInfo)}
      >
        <Icon changeable clickable name="more_horiz" />
      </MoreMenu>
    );
  }

  const columns: UnionColumns<CustomPageInfo>[] = [
    {
      id: 'name',
      Header: '页面名称',
      accessor: 'name',
    },
    {
      id: 'status',
      Header: () => {
        return (
          <div className="flex items-center">
            <span className="mr-4">应用状态</span>
            <Icon name="filter_alt" size={17} />
          </div>
        );
      },
      accessor: (rowInfo) => {
        return (
          <span
            className={cs('h-24 p-8 rounded-tl-4 rounded-br-4 bg-gray-100', {
              'page-applying': rowInfo.status === Status.inuse,
            })}
          >
            {rowInfo.status === Status.inuse ? '应用中' : '未应用'}
          </span>
        );
      },
    },
    {
      id: 'type',
      Header: '页面类型',
      accessor: (rowInfo) => {
        return rowInfo.type === 1 ? 'HTML自定义页面' : rowInfo.type;
      },
    },
    {
      id: 'description',
      Header: '描述',
      accessor: (rowInfo) => {
        return rowInfo.description === '' ? '—' : rowInfo.description;
      },
    },
    {
      id: 'createdBy',
      Header: '创建人',
      accessor: 'createdBy',
    },
    {
      id: 'updatedAt',
      Header: '更新时间',
      accessor: (rowInfo) => moment(rowInfo.updatedAt, 'X').format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      id: 'operators',
      Header: '操作',
      accessor: renderOperators,
    },
  ];

  const fetchPages = async (): Promise<void> => {
    setLoading(true);
    fetchCustomPageList(appID, params).then((res: any) => {
      setLoading(false);
      setCustomPageList(res.list);
      setCustomPageCount(res.count);
    }).catch((err) => {
      return toast.error(err.message);
    });
  };

  useEffect(() => {
    fetchPages();
  }, [params, appID]);

  function renderModals() {
    if (['create', 'edit'].includes(modalType)) {
      return (
        <Modal
          title={modalType === 'create' ? '新建自定义页面' : '编辑自定义页面'}
          onClose={onClose}
        >
          <SchemaForm
            className="p-20"
            schema={SCHEMA}
            onSubmit={handleSubmit}
            components={COMPONENTS}
            defaultValue={selectedRowRef.current}
          >
            <FormButtonGroup offset={8}>
              <Button type="submit" onClick={onClose}>取消</Button>
              <Button type="submit" modifier="primary">确定</Button>
            </FormButtonGroup>
          </SchemaForm>
        </Modal>
      );
    }
    if (modalType === 'preview') {
      return (
        <Modal
          title={`预览页面 ${selectedRowRef.current.name}`}
          onClose={onClose}
          fullscreen
        >
          <iframe
            className="w-full h-full"
            src={selectedRowRef.current.fileUrl}
            style={{ border: 'none' }}
          />
        </Modal>
      );
    }
    return <></>;
  }

  return (
    <>
      <div className="h-full flex-grow bg-white rounded-12">
        <Card
          title="自定义页面"
          className="h-full transition-opacity flex flex-col flex-1 mt-0"
          headerClassName="bg-gray-1000 p-16 header-background-image h-56 shadow-header"
          itemTitleClassName="text-h5"
          desc="可以上传静态的页面代码，包含 html、javascript、css、图片等，通过编码的形式实现自定义的页面设计。"
          action={<a className="ease-linear text-underline">📌  自定义页面可以用来做什么？</a>}
          contentClassName={cs('p-16', contentHeight)}
        >
          <div className="flex flex-col w-full">
            <div className="flex items-center">
              <Search
                onChange={handleChange}
                placeholder='请输入页面名称'
                className="custom-page-search"
                onKeyDown={handleKeyDown}
              />
              <Button onClick={() => searchPageName(inputValue)}>查询</Button>
              <Button
                modifier='primary'
                className="ml-16"
                onClick={() => {
                  selectedRowRef.current = DefaultCustomPage;
                  setModalType('create');
                }}
              >
                <Icon name="add" size={21} className="text-current mr-8"/>
                添加页面
              </Button>
            </div>
            <Table
              rowKey="id"
              className="mt-8"
              columns={columns}
              data={customPageList || []}
              loading={loading}
              style={{ maxHeight: 'calc(100vh - 320px)' }}
              emptyTips={(
                <div className="mt-72 mb-16 flex flex-col items-center">
                  <Icon name="workflow-list-empty" size={120} />
                  <p className="text-caption">
                    无数据。点击
                    <span
                      onClick={() => {
                        selectedRowRef.current = DefaultCustomPage;
                        setModalType('createPage');
                      }}
                      className="text-btn mx-4 cursor-pointer"
                    >
                      添加页面
                    </span>，开始导入页面数据
                  </p>
                </div>
              )}
            />
            <Pagination
              {...pagination}
              total={customPageCount}
              renderTotalTip={() => `共 ${customPageCount || 0} 条数据`}
              onChange={(current, pageSize) => {
                setPagination({ current, pageSize });
                setParams({ name: inputValue, currentPage: current, pageSize: pageSize });
              }}
            />
          </div>
        </Card>
        {renderModals()}
      </div>
    </>
  );
}

export default CustomPage;
