import { createGlobalState } from '@portal/states/create-global-state';
import { IRole } from '@lib/requests/auth';

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
    roles: IRole[];
  };
}

export const usePortalGlobalValue = createGlobalState<IUsePortalGlobalValue>(
  {
    authority: [],
    userInfo: {
      depIds: [],
      authority: [],
      roles: [],
    },
  },
  true,
);
