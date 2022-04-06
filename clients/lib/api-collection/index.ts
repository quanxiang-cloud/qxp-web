import { BehaviorSubject } from 'rxjs';
import { mergeRight } from 'ramda';

import useObservable from '@lib/hooks/use-observable';

import { Directory, PathType, API } from './types';
import {
  isApi,
  getApiList,
  getDirectory,
  omitApiFromDirectory,
  addApiListToDirectory,
  findDirectoryFromDirectory,
  getDirectoryPathWithPathTypeArray,
  setPathTypeAndCategoryToDirectory,
} from './utils';

export * from './types';

export interface APIData {
  pathType: PathType;
  directory: Directory;
}
export interface CollectionState {
  apiDataList: APIData[];
}
export const initialState: CollectionState = {
  apiDataList: [],
};

interface GetApiDataMapperParams {
  pathType: PathType;
  apiList: API[];
  directoryPath: string;
}

interface GetApiListAndUpdateApiDataListParams {
  apiDataList: APIData[];
  directoryPath: string;
  pathType: PathType;
}

interface GetInitialApiDataParams {
  pathType: PathType;
  directoryPath: string;
}

type CollectionMode = 'directoryOnly' | 'directoryWithApi';

interface CollectionProps {
  appID: string;
  pathTypes: PathType[];
  mode?: CollectionMode;
}
export class Collection extends BehaviorSubject<CollectionState> {
  public mode: CollectionMode;
  private appID: string;
  private pathTypes: PathType[] = [];

  constructor(value: CollectionState, props: CollectionProps) {
    const { appID, pathTypes, mode } = props;
    super(value);
    this.appID = appID;
    this.pathTypes = pathTypes;
    this.mode = mode || 'directoryOnly';
    this.fetch();
  }

  static getUpdateApiDataDirectoryByApiListMapper = (
    params: GetApiDataMapperParams,
  ): (apiData: APIData) => APIData => {
    const { pathType, apiList, directoryPath } = params;
    return (apiData: APIData) => {
      if (apiData.pathType !== pathType) {
        return apiData;
      }
      const { directory } = apiData;
      return {
        directory: addApiListToDirectory({ directory, apiList, directoryPath }),
        pathType,
      };
    };
  };

  static getInitialApiData = async (params: GetInitialApiDataParams): Promise<APIData> => {
    const { pathType, directoryPath } = params;
    const directory = await getDirectory(directoryPath);
    return {
      pathType,
      directory: setPathTypeAndCategoryToDirectory(pathType, directory),
    };
  };

  static getInitialApiDataList = async (appID: string, pathTypes: PathType[]): Promise<APIData[]> => {
    const directoryPathWithPathTypeArray = await getDirectoryPathWithPathTypeArray(appID, pathTypes);
    const apiDataListPromises = directoryPathWithPathTypeArray.map(Collection.getInitialApiData);
    return await Promise.all(apiDataListPromises);
  };

  static getApiListAndUpdateApiDataList = async (
    params: GetApiListAndUpdateApiDataListParams,
  ): Promise<APIData[]> => {
    const { pathType, directoryPath, apiDataList } = params;
    const listType = pathType === PathType.POLY ? 'poly' : 'raw';
    const apiList = await getApiList(directoryPath, listType);
    return apiDataList.map(Collection.getUpdateApiDataDirectoryByApiListMapper({
      pathType, apiList, directoryPath,
    }));
  };

  private update = (value: Partial<CollectionState>): void => {
    this.next(mergeRight(this.value, value));
  };

  private fetch = async (): Promise<never | void> => {
    try {
      const apiDataList = await Collection.getInitialApiDataList(this.appID, this.pathTypes);
      this.update({ apiDataList });
    } catch (error) {
      console.error(error);
    }
  };

  public onGetApiList = async (directoryPath: string, pathType: PathType): Promise<void> => {
    try {
      const apiDataList = await Collection.getApiListAndUpdateApiDataList({
        apiDataList: this.getValue().apiDataList,
        directoryPath,
        pathType,
      });
      this.update({ apiDataList });
    } catch (error) {
      console.error(error);
    }
  };

  public selectApiList = (directoryPath: string, pathType: PathType): API[] => {
    const { apiDataList } = this.getValue();
    const apiData = apiDataList.find((apiData) => apiData.pathType === pathType);
    if (!apiData) {
      return [];
    }
    const directoryMatched = findDirectoryFromDirectory(apiData.directory, directoryPath);
    return directoryMatched?.children?.filter(isApi) ?? [];
  };
}

function omitApiFromCollectionValue({ apiDataList }: CollectionState): CollectionState {
  return {
    apiDataList: apiDataList.map(({ pathType, directory }) => ({
      pathType,
      directory: omitApiFromDirectory(directory),
    })),
  };
}

export function createCollection(props: CollectionProps): Collection {
  return new Collection(initialState, props);
}

export function useCollection(collection: Collection): CollectionState {
  const collectionValue = useObservable(collection, initialState);
  if (collection.mode === 'directoryOnly') {
    return omitApiFromCollectionValue(collectionValue);
  }
  return collectionValue;
}
