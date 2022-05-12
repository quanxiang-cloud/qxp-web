import { action, observable } from 'mobx';

import toast from '@lib/toast';

import { getColumn, addColumn, updateColumn, deleColumn } from './api';
import { BaseParams, FromParams, FromTypes, SubmitParams, TableParams, TableTypes } from './type';

export const FIELD_TYPE = {
  string: { label: '文字', value: 'words' },
  text: { label: '文字', value: 'words' },
  longtext: { label: '文字', value: 'words' },
  int: { label: '数字', value: 'number' },
  float: { label: '数字', value: 'number' },
  boolen: { label: '布尔', value: 'boolen' },
  time: { label: '时间日期', value: 'time' },
};
const initParams: FromParams = { name: '', columnName: '', types: 'words', len: 0, pointLen: 0, format: '' };
const initCurCol: SubmitParams = {
  name: '', columnName: '', types: 'string', len: 0, pointLen: 0, format: '',
};

function getType({ types, len, pointLen }: FromParams): TableTypes {
  let type: TableTypes = 'string';
  switch (types) {
  case 'words':
    if (Number(len) <= 65) {
      type = 'string';
    } else if (Number(len) > 65 && Number(len) <= 65535) {
      type = 'text';
    } else {
      type = 'longtext';
    }
    break;
  case 'number':
    if (Number(pointLen) === 0) {
      type = 'int';
    } else {
      type = 'float';
    }
    break;
  case 'boolen':
    type = 'boolen';
    break;
  case 'time':
    type = 'time';
    break;

  default:
    break;
  }

  return type;
}

class ExtendPropertiesStore {
  @observable isVisible = false;
  @observable loading = false;
  @observable data: Array<TableParams> = [];
  @observable tableData: Array<TableParams> = [];
  @observable filterType: 'all' | FromTypes = 'all';
  @observable params: FromParams = initParams;
  @observable isEdit = false;
  @observable curId = '';
  @observable curColDetail: SubmitParams = initCurCol;

  @action
  setIsVisible = (isVisible: boolean): void => {
    this.isVisible = isVisible;
  };

  @action
  setIsEdit = (isEdit: boolean): void => {
    this.isEdit = isEdit;
  };

  @action
  setFilterType = (type: 'all' | FromTypes): void => {
    this.filterType = type;
  };

  @action
  getFilterData = (type: 'all' | FromTypes): void => {
    if (type === 'all') {
      this.tableData = this.data;
      return;
    }

    this.tableData = this.data.filter((v) => FIELD_TYPE[v.types].value === type);
  };

  @action
  onSubmit = (data: BaseParams): void => {
    const params: SubmitParams = {
      name: data.name,
      columnName: data.columnName,
      types: getType(this.params),
      len: Number(data.len),
      pointLen: Number(data.pointLen),
      format: this.params.format,
    };
    if (this.isEdit) {
      updateColumn(this.curId, params).then(() => {
        this.isVisible = false;
        this.fetchCloum(0);
        toast.success('修改成功');
      }).catch((err) => toast.error(err));

      return;
    }

    addColumn(params).then(() => {
      this.isVisible = false;
      this.fetchCloum(0);
      toast.success('添加成功');
    }).catch((err) => toast.error(err));
  };

  @action
  handleAdd = (): void => {
    this.isEdit = false;
    this.isVisible = true;
    this.curColDetail = initCurCol;
    this.params = initParams;
  };

  @action
  handleEdit = (colDetail: TableParams): void => {
    this.curId = colDetail.id || '';
    this.curColDetail = colDetail;
    this.params = {
      ...colDetail,
      types: FIELD_TYPE[colDetail.types].value as FromTypes,
      format: colDetail?.format,
    },
    this.isEdit = true;
    this.isVisible = true;
  };

  @action
  handleDel = (id: string): void => {
    deleColumn(id).then(() => {
      toast.success('删除成功');
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  fetchCloum = (status: 0 | 1): void => {
    getColumn(status).then((res) => {
      this.loading = false;
      this.data = res.all;
      this.getFilterData(this.filterType);
    }).catch((err) => {
      toast.error(err);
    });
  };
}

export default new ExtendPropertiesStore();
