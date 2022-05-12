import { action, observable, reaction } from 'mobx';
import _ from 'lodash';

import toast from '@lib/toast';
import { PathType } from '@portal/modules/poly-api/effects/api/namespace';

import {
  createAPIAuth,
  deleteAPIAuth,
  fetchAPIAuthDetails,
  fetchAPIListAuth,
  fetchAPIListAuthParams,
  fetchAPISwagDocDetails,
  fetchGroupAPIList,
  updateAPIAuth,
} from '../api';
import { DATA_RANGE, Role } from '../constants';
import FieldsStore from './auth-details/store';
import { fieldsTreeToParams, findSchema } from '../utils';
class APIAuthStore {
  @observable appID = '';
  @observable currentRoleID = '';
  @observable rootPath = '';
  @observable curAPI: APIDetailAuth | undefined = undefined;
  @observable curAuth: APIAuth | undefined = undefined;
  @observable modelType: PathType = 'inner.form';
  @observable curRoleType = Role.CUSTOMIZE;
  @observable isLoadingAuth = false;
  @observable apiList: APIDetailAuth[] = [];
  @observable apiAndAuthList: APIDetailAuth[] = [];
  @observable apiCount = 0;
  @observable curNamespace: PolyAPI.Namespace | null = null;
  @observable showRoleDetailsModal = false;
  @observable isLoadingAuthDetails = false;
  @observable outPutFields: SwagField = {};
  @observable inPutFields: SwagField = {};
  @observable inputTreeStore: FieldsStore | null = null;
  @observable outputTreeStore: FieldsStore | null = null;
  @observable curAuthDetailTabKey = 'viewableData';
  @observable conditionValue = 'ALL';

  constructor() {
    reaction(() => this.curAuth?.condition, this.findConditionValue);
  }

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

  @action
  setCurAuth = (curAuth: APIAuth): void => {
    this.curAuth = curAuth.condition ? curAuth : { ...curAuth, condition: {} };
  };

  @action
  setOutPutFields = (outPutFields: SwagField): void => {
    this.outPutFields = outPutFields;
  };

  @action
  setConditionValue = (conditionValue: string): void => {
    this.conditionValue = conditionValue;
  };

  @action
  setCurAuthDetailTabKey = (key: string): void => {
    this.curAuthDetailTabKey = key;
  };

  @action
  setInputTreeStore = (_inputTree: FieldsStore | null): void => {
    this.inputTreeStore = _inputTree;
  };

  @action
  setOutputTreeStore = (_outputTree: FieldsStore | null): void => {
    this.outputTreeStore = _outputTree;
  };

  @action
  setRole = (role: RoleRight): void => {
    this.currentRoleID = role.id;
    this.curRoleType = role?.type || Role.CUSTOMIZE;
  };

  @action
  setModelType = (modelType: PathType): void => {
    this.modelType = modelType;
  };

  @action
  setCurAPI = (api: APIDetailAuth): void => {
    this.curAPI = api;
  };

  @action
  setCurNamespace = (curNamespace: PolyAPI.Namespace | null): void => {
    this.curNamespace = curNamespace;
  };

  @action
  setAPIList = (_apiList: APIDetailAuth[]): void => {
    this.apiList = _apiList;
  };

  @action
  setAPIAndAuthList = (apiAndAuthList: APIDetailAuth[]): void => {
    this.apiAndAuthList = apiAndAuthList;
  };

  @action
  setRootPath = (_rootPath: string): void => {
    this.rootPath = _rootPath;
  };

  @action
  setCurrentRoleID = (currentRoleID: string): void => {
    this.currentRoleID = currentRoleID;
  };

  @action
  onChangeCondition = (label: string): void => {
    this.setConditionValue(label as string);
    this.setCurAuth({ ...this.curAuth, condition: DATA_RANGE[label] });
  };

  @action
  findConditionValue = (): void => {
    this.curAuth?.condition && Object.keys(DATA_RANGE).forEach((label) => {
      if (_.isEqual(this.curAuth?.condition, DATA_RANGE[label])) {
        this.setConditionValue(label);
      }
    });
  };

  @action
  fetchAPIFormList = (path: string, pagination: { page: number, pageSize: number }): void => {
    this.isLoadingAuth = true;
    fetchGroupAPIList(path, { ...pagination, active: 1 })
      .then(async ({ list, total }) => {
        await this.setAPIList(list || []);
        this.apiCount = total;
        if (list.length) {
          const paths = await list.map(({ accessPath, uri, method }) => {
            return { accessPath, uri, method };
          });
          await this.fetchAPIListAuth(paths);
        } else {
          this.setAPIAndAuthList([]);
        }
      })
      .catch((err) => toast.error(err))
      .finally(() => this.isLoadingAuth = false);
  };

  @action
  fetchAPIListAuth = (paths: fetchAPIListAuthParams[]): Promise<void> => {
    return fetchAPIListAuth(this.appID, { roleID: this.currentRoleID, paths })
      .then((authList: Record<string, APIAuth>) => {
        const _apiAuthList = this.apiList.map((api) => {
          const auth = authList[`${api.accessPath}-${api.method}`] || null;
          return { ...api, auth, isLoading: false };
        });
        this.setAPIAndAuthList(_apiAuthList);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  @action
  createAPIAuth = (auth: APIAuth): void => {
    this.apiAndAuthList = this.apiAndAuthList.map((_api) => {
      if (auth.path === _api.accessPath) {
        return { ..._api, isChanging: true };
      }
      return _api;
    });
    createAPIAuth(this.appID, auth)
      .then(() => {
        this.apiAndAuthList = this.apiAndAuthList.map((_api) => {
          if (auth.path === _api.accessPath) {
            return { ..._api, auth, isChanging: false };
          }
          return _api;
        });
        toast.success('添加成功');
      })
      .catch((err) => toast.error(err));
  };

  @action
  getAPIDocWithAuth = (): void => {
    this.isLoadingAuthDetails = true;
    Promise.all([
      this.fetchAPISwagDocDetails(),
      this.fetchAPIAuthDetails(),
    ]).then(([docRes, apiAuthRes]) => {
      const { inputSchema, outputSchema } = docRes;
      this.setOutputTreeStore(new FieldsStore(outputSchema || {}, apiAuthRes?.response || {}));
      this.setInputTreeStore(new FieldsStore(inputSchema || {}, apiAuthRes?.params || {}));
      this.setCurAuth(apiAuthRes);
    }).catch((err) => {
      toast.error(err);
    }).finally(() => this.isLoadingAuthDetails = false);
    return;
  };

  @action
  fetchAPIAuthDetails = (): Promise<APIAuth> => {
    return fetchAPIAuthDetails(this.appID || '', {
      roleID: this.currentRoleID,
      path: this.curAPI?.accessPath || '',
      uri: this.curAPI?.uri || '',
      method: this.curAPI?.method || '',
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        toast.error(err);
        return {};
      });
  };

  @action
  fetchAPISwagDocDetails = (): Promise<{
    inputSchema: SwagSchema | undefined,
    outputSchema: SwagSchema | undefined
  }> => {
    return fetchAPISwagDocDetails(this.curAPI?.fullPath || '').then((res) => {
      return findSchema(res);
    }).catch((err) => {
      toast.error(err);
      return { inputSchema: undefined, outputSchema: undefined };
    });
  };

  @action
  onSubmitSaveAuthDetail = (): void => {
    const output = fieldsTreeToParams(this.outputTreeStore?.rootNode);
    const input = fieldsTreeToParams(this.inputTreeStore?.rootNode);
    const apiInfo = _.pick(this.curAPI, ['accessPath', 'uri', 'method']);
    const _curAuth = { ...this?.curAuth, response: output, params: input, ...apiInfo };
    this.updateAPIAuth(_curAuth);
  };

  @action
  updateAPIAuth = (auth: APIAuth): void => {
    updateAPIAuth(auth?.id || '', this.appID, auth)
      .then(() => toast.success('修改成功'))
      .catch((err) => toast.error(err))
      .finally(() => {
        this.showRoleDetailsModal = false;
        this.curAuth = undefined;
      });
  };

  @action
  deleteAPIAuth = (path: string, uri: string, method: string): void => {
    this.apiAndAuthList = this.apiAndAuthList.map((_api) => {
      if (path === _api.accessPath) {
        return { ..._api, isChanging: true };
      }
      return _api;
    });
    deleteAPIAuth(this.appID, { roleID: this.currentRoleID, path, uri, method })
      .then(() => {
        this.apiAndAuthList = this.apiAndAuthList.map((_api) => {
          if (path === _api.accessPath) {
            return { ..._api, auth: null, isChanging: false };
          }
          return _api;
        });
        toast.success('删除成功');
      }).catch((err) => toast.error(err));
  };

  @action
  clear = (): void => {
    this.appID = '';
    this.currentRoleID = '';
    this.curRoleType = Role.CUSTOMIZE;
    this.apiList = [];
    this.apiAndAuthList = [];
    this.apiCount = 0;
    this.curNamespace = null;
    this.rootPath = '';
    this.modelType = 'inner.form';
  };
}

export default new APIAuthStore();
