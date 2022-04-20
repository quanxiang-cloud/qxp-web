import { action, observable } from 'mobx';

import toast from '@lib/toast';
import { PathType } from '@portal/modules/poly-api/effects/api/namespace';
import { Schema } from '@lib/api-adapter/swagger-schema-official';

import {
  createAPIAuth,
  deleteAPIAuth,
  fetchApiAuthDetails,
  fetchAPIListAuth,
  fetchApiSwagDocDetails,
  fetchGroupApiList,
  updateAPIAuth,
} from '../api';
import { Role } from '../constants';

import FieldsStore, { apiFieldsToTreeNode } from './role-details/store';

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
  @observable outPutFields: Fields = {};
  @observable inPutFields: Fields = {};
  @observable inputTreeStore: FieldsStore | null = null;
  @observable outputTreeStore: FieldsStore | null = null;

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

  @action
  setCurAuth = (curAuth: APIAuth): void => {
    this.curAuth = curAuth;
  };

  @action
  setOutPutFields = (outPutFields: Fields): void => {
    this.outPutFields = outPutFields;
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
  setApiList = (_apiList: APIDetailAuth[]): void => {
    this.apiList = _apiList;
  };

  @action
  setApiAndAuthList = (apiAndAuthList: APIDetailAuth[]): void => {
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
  fetchAPIFormList = (path: string, pagination: { page: number, pageSize: number }): void => {
    this.isLoadingAuth = true;
    fetchGroupApiList(path, { ...pagination, active: 1 })
      .then(async ({ list, total }) => {
        await this.setApiList(list || []);
        this.apiCount = total;
        const path: string[] = [];
        const uri: string[] = [];
        if (list.length) {
          await list.forEach((api) => {
            path.push(api.accessPath);
            uri.push(api.uri);
          });
          await this.fetchAPIListAuth(path, uri);
        } else {
          this.setApiAndAuthList([]);
        }
      })
      .catch((err) => toast.error(err))
      .finally(() => this.isLoadingAuth = false);
  };

  @action
  fetchAPIListAuth = (paths: string[], uris: string[]): Promise<void> => {
    return fetchAPIListAuth(this.appID, { roleID: this.currentRoleID, paths, uris })
      .then((authList: Record<string, APIAuth>) => {
        const _apiAuthList = this.apiList.map((api) => {
          const auth = authList[api.accessPath] || null;
          return { ...api, auth, isLoading: false };
        });
        this.setApiAndAuthList(_apiAuthList);
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
  getAPIDocWithAuth = (): void=> {
    this.isLoadingAuthDetails = true;
    Promise.all([
      this.fetchApiSwagDocDetails(),
      this.fetchApiAuthDetails(),
    ]).then(([docRes, apiAuthRes]) => {
      const { inputSchema, outputSchema } = docRes;
      this.setOutputTreeStore(new FieldsStore(outputSchema || {}, apiAuthRes?.response || {}));

      // console.log(inputSchema);
      // console.log(outputSchema);
      // console.log(apiAuthRes?.response);
      const bbb = apiFieldsToTreeNode(
        apiAuthRes?.response || {},
        outputSchema || {},
        outputSchema?.properties || {},
      );

      console.log(bbb);

      // const _outputField = turnFieldsWithState( apiAuthRes?.response || {}, outputSchema?.properties || {});
      // this.setOutPutFields(_outputField);
      // console.log(bbb);
      // console.log(_outputField);

      this.setCurAuth(apiAuthRes);
    }).catch((err) => {
      toast.error(err);
    }).finally(() => this.isLoadingAuthDetails = false);
    return;
  };

  @action
  fetchApiAuthDetails = (): Promise<APIAuth> => {
    return fetchApiAuthDetails(this.appID || '', {
      roleID: this.currentRoleID,
      path: this.curAPI?.accessPath || '',
      uri: this.curAPI?.uri || '',
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
  fetchApiSwagDocDetails = (): Promise<{
    inputSchema: Schema|undefined,
    outputSchema: Schema | undefined
  }> => {
    return fetchApiSwagDocDetails(this.curAPI?.fullPath || '').then((res) => {
      const path = Object.values(res.doc.paths)[0];
      const inputSchema = Object.values(path)[0].parameters;
      const outputSchema = Object.values(path)[0].responses?.[200]?.schema;
      return {
        inputSchema,
        outputSchema,
      };
    }).catch((err) => {
      toast.error(err);
      return { inputSchema: undefined, outputSchema: undefined };
    });
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
  deleteAPIAuth = (path: string, uri: string): void => {
    this.apiAndAuthList = this.apiAndAuthList.map((_api) => {
      if (path === _api.accessPath) {
        return { ..._api, isChanging: true };
      }
      return _api;
    });
    deleteAPIAuth(this.appID, { roleID: this.currentRoleID, path, uri })
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
