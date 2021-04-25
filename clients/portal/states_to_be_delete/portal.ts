import { createGlobalState } from '@portal/states_to_be_delete/create-global-state';

export interface IUsePortalGlobalValue {
  authority: string[];
  userInfo: {
    id?: string;
    userName?: string;
    phone?: string;
    email?: string;
    userIconURL?: string;
    dep?: Department;
    depIds: string[];
    authority: string[];
    roles: Role[];
    status?: number;
  };
}

export const usePortalGlobalValue = createGlobalState<IUsePortalGlobalValue>(
  {
    authority: [],
    userInfo: {
      depIds: [],
      authority: [],
      roles: [],
      status: -1,
    },
  },
  true,
);
