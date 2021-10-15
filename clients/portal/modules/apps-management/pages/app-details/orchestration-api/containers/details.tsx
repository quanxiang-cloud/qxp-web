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
import useModal from '@orchestrationAPI/effects/hooks/use-modal';
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

const initialPage = { page: 1, pageSize: 10 };

function APINamespaceDetails(): JSX.Element {
  const history = useHistory();
  const {
    appID, currentNamespacePath, currentNamespaceName, isApiNameSpaceDetailsLoading,
  } = useOrchestrationAPIStore() || {};
  const [modalType, setModalType] = useState<ModalType>();
  const [names, setNames] = useState<string[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const nameSpacePath = currentNamespacePath || '';
  const [pagination, setPagination] = useState(initialPage);
  const { appPath } = useQueryNameSpaceRootPath(appID || '', { enabled: !!appID }).data || {};

  const [copyState, copyToClipboard] = useCopyToClipboard();
  useEffect(() => {
    copyState.error ? toast.error('复制失败') : copyState.value && toast.success(`访问路径: ${copyState.value}复制成功`);
  }, [copyState]);

  const CreatePolyModal = useModal<CreatePolyInput, CreatePolyResponse, CreatePolyParams>(
    modalType,
    ModalType.CREATE_POLY,
    useCreatePoly,
    {
      message: '新建API成功',
      onClose: handleModalClose,
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
    ModalType.REMOVE_POLY,
    useRemovePoly,
    {
      message: 'API删除成功',
      content: <span>确认要删除吗?</span>,
      onClose: handleModalClose,
      formToApiInputConvertor: () => {
        return {
          path: `delete${nameSpacePath}`,
          body: { names: names },
        };
      },
      onSuccess: () => setNames([]),
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
      toast.success(`${response.active ? '开启' : '关闭'}成功`);
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
    setModalType(ModalType.REMOVE_POLY);
    setNames([data.original.name]);
  }

  function handleEditPoly(polyID: string): void {
    history.push(`/poly/${appID}/${polyID}`);
  }

  const columns: UnionColumns<PolyListItem>[] = [{
    Header: 'API名称',
    accessor: 'title',
  }, {
    Header: '方法',
    accessor: 'method',
  }, {
    Header: '访问路径',
    accessor: 'fullPath',
    Cell: (model: CellProps<PolyListItem>) => (
      <div className="flex flex-nowrap items-center">
        <div className="w-72 truncate" title={model.value}>{model.value}</div>
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
    Header: '状态',
    accessor: 'active',
    Cell: (model: CellProps<PolyListItem>) => (
      <Toggle
        defaultChecked={!!model.value}
        onText="开启"
        offText="关闭"
        onChange={(checked) => handleActiveChange(checked, model.cell.row)}
      />
    ),
  }, {
    Header: '操作',
    Cell: (model: CellProps<PolyListItem>) => (
      <div>
        <span
          onClick={() => handleEditPoly(model.cell.row.id)}
          className="mr-16 text-blue-600 text-h6-no-color-weight cursor-pointer"
        >
          编辑
        </span>
        {
          <span
            className={cs(
              'text-red text-red-600 text-h6-no-color-weight',
              {
                'opacity-0': model.cell.row.original.active,
                'cursor-pointer': !model.cell.row.original.active,
              },
            )}
            onClick={() => !model.cell.row.original.active && handleRemovePoly(model.cell.row)}
          >
          删除
          </span>
        }
      </div>
    ),
  }];

  if (isApiNameSpaceDetailsLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="p-20">{currentNamespaceName} API列表</div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex justify-between items-center px-20 my-20">
          <Button onClick={handleCreatePolyApi} modifier="primary" iconName="add">新建API</Button>
          <SearchInput
            name="apiName"
            placeholder="输入API名称"
            onChange={handleApiTitleChange}
            appendix="close"
          />
        </div>
        <div className="flex-1 overflow-auto">
          <Table
            rowKey="id"
            columns={columns}
            data={data?.list || []}
            loading={isFetchListLoading || isSearchLoading}
            emptyTips={'暂无数据'}
          />
          <Pagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={data?.total}
            onChange={handlePageChange}
          />
        </div>
      </div>
      {CreatePolyModal}
      {RemovePolyModal}
    </>
  );
}

export default observer(APINamespaceDetails);
