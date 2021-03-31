import { createGlobalState } from '@lib/create-global-state';
import { IRole } from '@portal/api/auth';

export interface Department {
  id: string;
  departmentName: string;
  departmentLeaderId: string;
  useStatus: number;
  superId: string;
  pid: string;
  superID: string;
  grade: number;
  child: Department | null;
}

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
