import React, { useState, useEffect } from 'react';
import { UnionColumns, CellProps, Row } from 'react-table';
import { observer } from 'mobx-react';
import { useCopyToClipboard, usePrevious } from 'react-use';
import cs from 'classnames';
import { useHistory } from 'react-router-dom';

import Icon from '@c/icon';
import Table from '@c/table';
import toast from '@lib/toast';
import Pagination from '@c/pagination';
import Button from '@c/button';
import SearchInput from '@c/form/input/search-input';
import Loading from '@c/loading';
import Toggle from '@c/toggle';
import {
  useOrchestrationAPIStore,
} from '@portal/modules/apps-management/pages/app-details/orchestration-api/context';
import { useQueryNameSpaceRootPath } from '@orchestrationAPI/effects/api/api-namespace';
import useModal, { actions } from '@orchestrationAPI/effects/hooks/use-modal';
import { ModalType } from '@orchestrationAPI/constants';
import {
  useCreatePoly,
  CreatePolyInput,
  CreatePolyResponse,
  CreatePolyParams,
  useQueryPolyList,
  useSearchPoly,
  useActivePoly,
  PolyListItem,
  useRemovePoly,
  RemovePolyInput,
  RemovePolyResponse,
  RemovePolyParams,
} from '@orchestrationAPI/effects/api/poly';

import ModalRemoveTips from '../components/modal-remove-tips';

const initialPage = { page: 1, pageSize: 10 };

function APINamespaceDetails(): JSX.Element {
  const history = useHistory();
  const {
    appID, currentNamespacePath, currentNamespaceName, isApiNameSpaceDetailsLoading,
  } = useOrchestrationAPIStore() || {};
  const [modalType, setModalType] = useState<ModalType>();
  const [names, setNames] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [searchTitle, setSearchTitle] = useState('');
  const nameSpacePath = currentNamespacePath || '';
  const [pagination, setPagination] = useState(initialPage);
  const { appPath } = useQueryNameSpaceRootPath(appID || '', { enabled: !!appID }).data || {};

  const [copyState, copyToClipboard] = useCopyToClipboard();
  useEffect(() => {
    copyState.error ? toast.error('复制失败') : copyState.value && toast.success(`访问路径: ${copyState.value} 复制成功`);
  }, [copyState]);

  const CreatePolyModal = useModal<CreatePolyInput, CreatePolyResponse, CreatePolyParams>(
    modalType,
    ModalType.CREATE_POLY,
    useCreatePoly,
    {
      message: '新建API成功',
      submitText: '新建并设计API',
      onClose: handleModalClose,
      onSuccess: (data) => handleEditPoly(data.apiPath),
      formToApiInputConvertor: (body) => {
        return {
          path: `create${nameSpacePath}`,
          body,
        };
      },
    },
  );

  const RemovePolyModal = useModal<RemovePolyInput, RemovePolyResponse, RemovePolyParams>(
    modalType,
    [ModalType.REMOVE_POLY, ModalType.REMOVE_POLY_ALL],
    useRemovePoly,
    {
      message: '删除API成功',
      submitText: '确认删除',
      content: (
        <ModalRemoveTips
          title={`确定要删除${modalType === ModalType.REMOVE_POLY_ALL ? '选中的' : '该'}API吗?`}
          desc="删除API后，数据将无法找回。"
        />
      ),
      onClose: handleModalClose,
      formToApiInputConvertor: () => {
        return {
          path: `delete${nameSpacePath}`,
          body: { names: currentName ? [currentName] : names },
        };
      },
      onSuccess: () => currentName ? setCurrentName(null) : setNames([]),
    },
  );

  useEffect(() => {
    setPagination(initialPage);
    setSearchTitle('');
  }, [nameSpacePath]);

  const isBaseEnabled = !!nameSpacePath.slice(1) && appPath !== nameSpacePath;
  const isQueryEnabled = isBaseEnabled && !searchTitle;
  const { data: queryData, refetch: refetchList, isLoading: isFetchListLoading } = useQueryPolyList(
    { path: nameSpacePath.slice(1), body: { ...pagination, active: -1 } },
    { enabled: isQueryEnabled },
  );

  const isSearchEnabled = isBaseEnabled && !!searchTitle;
  const { data: searchData, refetch: refetchSearch, isLoading: isSearchLoading } = useSearchPoly(
    { path: nameSpacePath.slice(1), body: { ...pagination, active: -1, withSub: false, title: searchTitle } },
    { enabled: isSearchEnabled },
  );

  useEffect(() => {
    refetchList();
    refetchSearch();
  }, [pagination]);

  const prevSearchTitle = usePrevious(searchTitle);
  useEffect(() => {
    if ((!searchTitle && prevSearchTitle) || (!prevSearchTitle && searchTitle)) {
      return setPagination(initialPage);
    }
    searchTitle && setPagination((pagination) => ({ ...pagination }));
  }, [searchTitle]);

  const activePolyMutation = useActivePoly({
    onSuccess: (response) => {
      toast.success(`${response.active ? '启用' : '停用'}成功`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const data = isSearchEnabled ? searchData : queryData;

  function handleModalClose(): void {
    setModalType(undefined);
  }

  function handlePageChange(page: number, pageSize: number): void {
    setPagination({ page, pageSize });
  }

  function handleApiTitleChange(value: string): void {
    setSearchTitle(value);
  }

  function handleCreatePolyApi(): void {
    setModalType(ModalType.CREATE_POLY);
  }

  function handleActiveChange(checked: boolean, data: Row<PolyListItem>): void {
    activePolyMutation.mutate({ path: `active${data.original.fullPath}`, body: { active: checked ? 1 : 0 } });
  }

  function handleRemovePoly(data: Row<PolyListItem>): void {
    setCurrentName(data.original.name);
    setModalType(ModalType.REMOVE_POLY);
  }

  function handleRemoveAll(): void {
    !!names.length && setModalType(ModalType.REMOVE_POLY_ALL);
  }

  function handleEditPoly(polyFullPath: string): void {
    history.push(`/poly/${appID}${polyFullPath}`);
  }

  function handleCopyPoly(polyFullPath: string): void {
    handleCreatePolyApi();
    actions.setFieldValue('templateAPIPath', polyFullPath);
  }

  const columns: UnionColumns<PolyListItem>[] = [{
    Header: 'API名称',
    accessor: 'title',
  }, {
    Header: '请求方法',
    accessor: 'method',
    Cell: (model: CellProps<PolyListItem>) => (
      <span
        className={model.value.toLowerCase() === 'delete' ? 'text-red-600' : 'text-green-600'}
      >
        {model.value}
      </span>
    ),
  }, {
    Header: '访问路径',
    accessor: 'fullPath',
    Cell: (model: CellProps<PolyListItem>) => (
      <div className="flex flex-nowrap items-center">
        <div
          className="truncate"
          style={{ maxWidth: 'calc(100% - 16px)' }}
          title={model.value}>
          {model.value}
        </div>
        <Icon
          clickable
          name="content_copy"
          type="dark"
          size={16}
          className="mt-3 hover:text-blue-600"
          onClick={() => copyToClipboard(model.value)}
        />
      </div>
    ),
  }, {
    Header: '描述',
    accessor: 'desc',
    Cell: (model: CellProps<PolyListItem>) => (
      <div
        className="truncate"
        title={model.value}>
        {model.value || '-'}
      </div>
    ),
  }, {
    Header: '状态',
    accessor: 'active',
    Cell: (model: CellProps<PolyListItem>) => (
      <Toggle
        defaultChecked={!!model.value}
        onText="启用"
        offText="停用"
        onChange={(checked) => handleActiveChange(checked, model.cell.row)}
      />
    ),
  }, {
    Header: '操作',
    Cell: (model: CellProps<PolyListItem>) => (
      <div>
        <span
          onClick={() => handleEditPoly(model.cell.row.original.fullPath)}
          className="mr-16 text-blue-600 text-h6-no-color-weight cursor-pointer"
        >
          设计API
        </span>
        <span
          onClick={() => handleCopyPoly(model.cell.row.original.fullPath)}
          className="mr-16 text-blue-600 text-h6-no-color-weight cursor-pointer"
        >
          复制
        </span>
        <span
          className={cs(
            'text-red text-red-600 text-h6-no-color-weight',
            {
              'opacity-0': model.cell.row.original.active,
              'cursor-pointer': !model.cell.row.original.active,
            },
          )}
          onClick={(e) => {
            e.stopPropagation();
            !model.cell.row.original.active && handleRemovePoly(model.cell.row);
          }}
        >
          删除
        </span>
      </div>
    ),
  }];

  if (isApiNameSpaceDetailsLoading) {
    return <Loading desc="加载中..." />;
  }

  if (!currentNamespaceName) {
    return (
      <div className="container flex items-center justify-center h-full font-semibold">
        暂无分组, 请创建分组
      </div>
    );
  }

  const name2idMap = data?.list.reduce((acc: Record<string, string>, cur: PolyListItem) => {
    acc[cur.name] = cur.id;
    return acc;
  }, {}) || {};

  return (
    <>
      <div
        className="py-12 px-16 h-44 text-caption-no-color-weight text-gray-900 font-semibold bg-no-repeat
        bg-right border-b"
        style={{
          backgroundImage: 'url(\'/dist/images/maskHeaderBackgroundImage.png\')',
        }}
      >
        {currentNamespaceName}
      </div>
      <div className="flex flex-col flex-1 overflow-hidden bg-white p-16 h-32">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button onClick={handleCreatePolyApi} modifier="primary" iconName="add">新建API</Button>
            <Button
              onClick={handleRemoveAll}
              className={cs(
                'ml-24 bg-white transition-opacity', names.length ? 'opacity-100' : 'opacity-0',
                { 'cursor-default pointer-events-none': !names.length },
              )}
              style={{ color: 'var(--rose-500)', border: '1px solid var(--rose-500)' }}
              iconName="remove_backup">
              删除
            </Button>
          </div>
          <SearchInput
            className="polynamespacedetail-header-searchinput"
            name="apiName"
            placeholder="搜索 API名称..."
            onChange={handleApiTitleChange}
            appendix="close"
          />
        </div>
        <div className="flex-1 polynamespacedetail-table overflow-hidden">
          <Table
            showCheckbox
            rowKey="id"
            columns={columns}
            data={data?.list || []}
            loading={isFetchListLoading || isSearchLoading}
            initialSelectedRowKeys={names.map((name) => name2idMap[name]).filter(Boolean)}
            onSelectChange={(_, rows) => setNames(rows.map(({ name }) => name))}
            emptyTips={(
              <div className="flex flex-col items-center justify-center">
                <img src="/dist/images/table-empty.svg" alt="empty" className="w-96 h-72 mb-8" />
                <span className="text-caption-no-color-weight text-gray-400">暂无数据</span>
              </div>
            )}
          />
          <div className="pt-10">
            <Pagination
              current={pagination.page}
              pageSize={pagination.pageSize}
              total={data?.total}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      {CreatePolyModal}
      {RemovePolyModal}
    </>
  );
}

export default observer(APINamespaceDetails);
