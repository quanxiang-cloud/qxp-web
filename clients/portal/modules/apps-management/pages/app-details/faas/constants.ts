export const faasState = {
  NOT_INITIAL: 0,
  NOT_DEVELOP_HAS_GROUP: 1,
  DEVELOP: 2,
  GROUP: 3,
  INGROUP: 4,
  DONE_INITIAL: 5,
};

export const PROJECT_STATE = {
  Unknown: 0,
  True: 3,
  False: 2,
};

export const FUNC_STATUS = {
  StatusNull: 0,
  StatusBuilding: 1,
  StatusFailed: 2,
  StatusOK: 3,
  StatusCancelled: 4,
  StatusOnline: 5,
  StatusOffline: 6,
  OnlineBuilding: 7,
  OnlineFailed: 8,
};

export const API_DOC_STATE = {
  NULL: 0,
  REGISTERING: 1,
  SUCCESS: 2,
  FAILED: 3,
};
