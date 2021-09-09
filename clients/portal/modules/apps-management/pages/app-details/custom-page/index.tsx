import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { UnionColumns } from 'react-table';
import { useParams } from 'react-router-dom';
import { Input, Radio } from '@formily/antd-components';
import { SchemaForm, FormButtonGroup } from '@formily/antd';

import toast from '@lib/toast';
import Button from '@c/button';
import Table from '@c/table';
import Search from '@c/search';
import Modal from '@c/modal';
import EmptyTips from '@c/empty-tips';
import PopConfirm from '@c/pop-confirm';
import TextHeader from '@c/text-header';
import Pagination from '@c/pagination';

import SCHEMA from './modal-schema';
import FileUpload from './file-upload';
import { CustomPageInfo } from '../type';
import { removeCustomPage, editeCustomPage, fetchCustomPageList } from '../api';

import './index.scss';
import moment from 'moment';

type ModalType = 'create' | 'edit' | 'preview';

const COMPONENTS = {
  Input,
  TextArea: Input.TextArea,
  RadioGroup: Radio.Group,
  FileUpload,
};

const DefaultCustomPage: CustomPageInfo = {
  id: '',
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
  const [selectedRowInfo, setSelectedRowInfo] = useState<CustomPageInfo>(DefaultCustomPage);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const { appID } = useParams<{ appID: string }>();
  const [params, setParams] = useState({ currentPage: 1, pageSize: 10, name: '' });

  const deletePage = async (rowInfo: CustomPageInfo): Promise<void> => {
    if (rowInfo.status !== 1) {
      await removeCustomPage(appID, rowInfo.id).catch((err) => {
        return toast.error(err.message);
      });
      fetchPages();
    }
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
      toast.error('请上传文件');
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

    await editeCustomPage(appID, { id: selectedRowInfo.id, ...params }).catch((err) => {
      return toast.error(err.message);
    });
    await fetchPages();
    onClose();
  };

  const renderOperators = (rowInfo: CustomPageInfo): JSX.Element => {
    const deleteContent = rowInfo.status === 1 ? '该页面正在使用，不能进行删除' : '确认删除该自定义页面?';

    return (
      <div className="text-blue-600">
        <span
          onClick={() => {
            setSelectedRowInfo(rowInfo);
            setModalType('edit');
          }}
          className={cs('text-btn', { 'text-red-500': rowInfo.status === 1 })}
        >
          编辑
        </span>
        <span className="text-gray-500 text-btn px-10" onClick={() => {
          setSelectedRowInfo(rowInfo);
          setModalType('preview');
        }}>预览</span>
        <PopConfirm
          content={deleteContent}
          onOk={() => deletePage(rowInfo)}
        >
          <span className='text-btn'>删除</span>
        </PopConfirm>
      </div>
    );
  };

  const columns: UnionColumns<CustomPageInfo>[] = [
    {
      id: 'name',
      Header: '页面名称',
      accessor: 'name',
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
      Header: '页面描述',
      accessor: 'description',
    },
    {
      id: 'createdBy',
      Header: '创建人',
      accessor: 'createdBy',
    },
    {
      id: 'status',
      Header: '应用状态',
      accessor: (rowInfo) => {
        return rowInfo.status === 1 ? '应用中' : '未应用';
      },
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

  const fetchPages = (): void => {
    setLoading(true);
    fetchCustomPageList(appID, params).then((res: any) => {
      setLoading(false);
      setCustomPageList(res.list);
      setCustomPageCount(res.count);
    });
  };

  useEffect(() => {
    fetchPages();
  }, [params, appID]);

  const renderModals = () => {
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
            defaultValue={selectedRowInfo}
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
          title={`预览页面 ${selectedRowInfo.name}`}
          onClose={onClose}
          fullscreen
        >
          <iframe
            className="w-full h-full"
            src={selectedRowInfo.fileUrl}
            style={{ border: 'none' }}
          />
        </Modal>
      );
    }
    return null;
  };

  return (
    <div className="flex-1">
      <TextHeader
        title="自定义页面"
        className="app-list-header header-background-image mb-24"
      />
      <div className="m-20 p-20 rounded-12 bg-white">
        <div className="flex items-center text-h6">
          <Search
            onChange={handleChange}
            placeholder='请输入页面名称'
            className="mr-20 w-236 custom-page-search"
            onKeyDown={handleKeyDown}
          />
          <Button onClick={() => searchPageName(inputValue)}>查询</Button>
          <Button
            modifier='primary'
            className="mx-20"
            onClick={() => {
              setSelectedRowInfo(DefaultCustomPage);
              setModalType('create');
            }}
          >
            新增
          </Button>
        </div>
        <div>
          <Table
            rowKey="id"
            className="mt-20"
            columns={columns}
            data={customPageList || []}
            emptyTips={(
              <EmptyTips
                className="py-32"
                text={inputValue ? '未查询到匹配的自定义页面数据' : '无自定义页面数据'}
              />
            )}
            loading={loading}
            style={{ maxHeight: 'calc(100vh - 320px)' }}
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
      </div>
      {renderModals()}
    </div>
  );
}

export default CustomPage;
