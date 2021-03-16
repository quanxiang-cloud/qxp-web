import { createGlobalState } from '@clients/assets/lib/createGlobalState';

export interface IDepartment {
  id: string;
  departmentName: string;
  departmentLeaderId: string;
  useStatus: number;
  superId: string;
  pid: string;
  superID: string;
  grade: number;
  child: IDepartment | null;
}

export interface IUsePortalGlobalValue {
  authority: string[];
  userInfo: {
    id?: string;
    userName?: string;
    phone?: string;
    email?: string;
    userIconURL?: string;
    dep?: IDepartment;
    depIds: string[];
    authority: string[];
  };
}

export const usePortalGlobalValue = createGlobalState<IUsePortalGlobalValue>(
  {
    authority: [],
    userInfo: {
      depIds: [],
      authority: [],
    },
  },
  true,
);
