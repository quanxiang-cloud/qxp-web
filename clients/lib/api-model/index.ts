import { useObservable } from 'react-use';
import { BehaviorSubject } from 'rxjs';
import { mergeRight } from 'ramda';

import { Directory, PathType } from './types';
import { getApiListAndUpdateApiDataList, getInitialApiDataList, omitApiFromModelValue } from './utils';

export * from './types';

export interface APIData {
  pathType: PathType;
  directory: Directory;
}
export interface ModelState {
  apiDataList: APIData[];
}
export const initialState: ModelState = {
  apiDataList: [],
};

type ModelMode = 'directoryOnly' | 'directoryWithApi';

interface ModelProps {
  appID: string;
  pathTypes: PathType[];
  mode?: ModelMode;
}
export class Model extends BehaviorSubject<ModelState> {
  public mode: ModelMode;
  private appID: string;
  private pathTypes: PathType[] = [];

  constructor(value: ModelState, props: ModelProps) {
    const { appID, pathTypes, mode } = props;
    super(value);
    this.appID = appID;
    this.pathTypes = pathTypes;
    this.mode = mode || 'directoryOnly';
    this.fetch();
  }

  private update(value: Partial<ModelState>): void {
    this.next(mergeRight(this.value, value));
  }

  private fetch = async (): Promise<never | void> => {
    try {
      const apiDataList = await getInitialApiDataList(this.appID, this.pathTypes);
      this.update({ apiDataList });
    } catch (error) {
      console.error(error);
    }
  };

  public onGetApiList = async (directoryPath: string, pathType: PathType): Promise<void> => {
    try {
      const apiDataList = await getApiListAndUpdateApiDataList({
        apiDataList: this.getValue().apiDataList,
        directoryPath,
        pathType,
      });
      this.update({ apiDataList });
    } catch (error) {
      console.error(error);
    }
  };
}

export function createModel(props: ModelProps): Model {
  return new Model(initialState, props);
}

export function useModel(model: Model): ModelState {
  const modelValue = useObservable(model, initialState);
  if (model.mode === 'directoryOnly') {
    return omitApiFromModelValue(modelValue);
  }
  return modelValue;
}
