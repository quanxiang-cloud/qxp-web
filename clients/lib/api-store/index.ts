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

interface APIData {
  type: string;
  rootDirectory: APIDirectory;
  apiListMap: Record<string, APIItem[]>;
  apiDocMap: Record<string, Record<string, any>>;
}
interface State {
  apiDatas: APIData[];
}
const initalState: State = {
  apiDatas: [],
};

class Store extends BehaviorSubject<State> {
  private appID?: string;
  private apiTypes: string[] = [];

  private update(value: Partial<State>): void {
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
  ): Promise<APIData[]> => {
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
      const apiDatas = await this.getApiDatas(rootDirectoryPathWithTypeArray);
      this.update({ apiDatas });
    } catch (error) {
      console.error(error);
    }
  };

  public setAppID = (appID: string): void => {
    this.appID = appID;
  };

  public setApiTypes = async (apiTypes: string[]): Promise<void> => {
    this.apiTypes = apiTypes;
    if (apiTypes.length) {
      await this.fetch();
    }
  };

  public reset = (): void => {
    this.appID = undefined;
    this.apiTypes = [];
    this.update({ apiDatas: [] });
  };

  public getApiList = async (directory: APIDirectory): Promise<void> => {
    const directoryPath = getDirectoryPath(directory);
    const apiList = await getApiList(directoryPath, directory.type === 'poly' ? 'poly' : 'raw');
    const { apiDatas } = this.getValue();
    this.update({
      apiDatas: apiDatas.map((data) => {
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
    const { apiDatas } = this.getValue();
    this.update({
      apiDatas: apiDatas.map((data) => {
        if (data.type === apiItem.type) {
          data.apiDocMap[fullPath] = docData;
        }
        return data;
      }),
    });
  };
}

export const store = new Store(initalState);
