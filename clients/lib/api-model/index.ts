import { useObservable } from 'react-use';
import { BehaviorSubject } from 'rxjs';

import { APIDirectory, APIItem } from './types';
import {
  ApiRootDirectoryPathWithApiType,
  getApiDoc,
  getApiList,
  getApiRootDirectory,
  getApiRootDirectoryPathWithTypeArray,
  getDirectoryPath,
} from './utils';

export * from './types';

export interface APIDataList {
  type: string;
  rootDirectory: APIDirectory;
  apiListMap: Record<string, APIItem[]>;
  apiDocMap: Record<string, Record<string, any>>;
}
export interface ModelState {
  apiDataList: APIDataList[];
}
export const initialState: ModelState = {
  apiDataList: [],
};

export class Model extends BehaviorSubject<ModelState> {
  private appID: string;
  private apiTypes: string[] = [];

  constructor(value: ModelState, appID: string, apiTypes: string[]) {
    super(value);
    this.appID = appID;
    this.apiTypes = apiTypes;
    this.fetch();
  }

  private update(value: Partial<ModelState>): void {
    this.next({ ...this.value, ...value });
  }

  private getApiListMap = async (
    apiType: string, apiRootDirectory: APIDirectory,
  ): Promise<Record<string, APIItem[]>> => {
    const apiRootDirectoryPath = getDirectoryPath(apiRootDirectory);
    const apiListOfRootDirectory = await getApiList(
      apiRootDirectoryPath, apiType === 'poly' ? 'poly' : 'raw',
    );
    this.assignApiTypeToApiItems(apiType, apiListOfRootDirectory);
    return {
      [apiRootDirectoryPath]: apiListOfRootDirectory,
    };
  };

  private assignApiTypeToDirectoryTree(type: string, rootDirectory: APIDirectory): void {
    rootDirectory.type = type;
    if (rootDirectory.children) {
      rootDirectory.children.forEach((child) => this.assignApiTypeToDirectoryTree(type, child));
    }
  }

  private assignApiTypeToApiItems(type: string, apiItems: APIItem[]): void {
    apiItems.forEach((apiItem) => apiItem.type = type);
  }

  private getApiDatas = async (
    rootDirectoryPathWithTypeArray: ApiRootDirectoryPathWithApiType[],
  ): Promise<APIDataList[]> => {
    const promises = rootDirectoryPathWithTypeArray.map(async ({ type, apiRootDirectoryPath }) => {
      const rootDirectory = await getApiRootDirectory(apiRootDirectoryPath);
      this.assignApiTypeToDirectoryTree(type, rootDirectory);
      return {
        type,
        rootDirectory,
        apiListMap: await this.getApiListMap(type, rootDirectory),
        apiDocMap: {},
      };
    });
    return await Promise.all(promises);
  };

  private fetch = async (): Promise<never | void> => {
    if (!this.appID) {
      throw new Error('appID is not set');
    }
    try {
      const rootDirectoryPathWithTypeArray = await getApiRootDirectoryPathWithTypeArray(
        this.appID, this.apiTypes,
      );
      const apiDataList = await this.getApiDatas(rootDirectoryPathWithTypeArray);
      this.update({ apiDataList });
    } catch (error) {
      console.error(error);
    }
  };

  public getApiList = async (directory: APIDirectory): Promise<void> => {
    const directoryPath = getDirectoryPath(directory);
    const apiList = await getApiList(directoryPath, directory.type === 'poly' ? 'poly' : 'raw');
    const { apiDataList } = this.getValue();
    this.update({
      apiDataList: apiDataList.map((data) => {
        if (data.type === directory.type) {
          this.assignApiTypeToApiItems(data.type, apiList);
          data.apiListMap[directoryPath] = apiList;
        }
        return data;
      }),
    });
  };

  public getApiDoc = async (apiItem: APIItem, docType: string): Promise<void> => {
    const { fullPath } = apiItem;
    const docData = await getApiDoc(fullPath, docType);
    const { apiDataList } = this.getValue();
    this.update({
      apiDataList: apiDataList.map((data) => {
        if (data.type === apiItem.type) {
          data.apiDocMap[fullPath] = docData;
        }
        return data;
      }),
    });
  };
}

export function createModel(appID: string, apiTypes: string[]): Model {
  return new Model(initialState, appID, apiTypes);
}

export function useModel(model: Model): ModelState {
  return useObservable(model, initialState);
}
