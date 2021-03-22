import { httpPost, httpFile } from '../../../../assets/lib/utils';
import { IResponse } from '../../../../@types/interface/api';
import { ITreeNode } from '@portal/pages/access-control/company-maillist/department-tree';
import { FormValues, EditFormValues } from './staff-modal';
import { UserStatus } from './person-info';

// ------------------ 部门 ---------------
// 获取部门树
export const getERPTree = () => {
  return httpPost<IResponse<IDepartment>>('/api/org/v1/DEPTree', null, {
    'Content-Type': 'application/x-www-form-urlencoded',
  }).then(({ data }) => data);
};

// 获取部门树
export const queryERPName = ({
  depID,
  depName,
}: {
  depID: string;
  depName: string;
}) => {
  return httpPost<IResponse<{ isExist: 1 | -1 }>>(
    '/api/org/v1/checkDEPIsExist',
    JSON.stringify({ depID, depName }),
    {
      'Content-Type': 'application/json',
    }
  );
};

/**
 * @returns 新增
 * @param departmentName true(true：必须 false：非必须)
 * @param departmentLeaderID false
 * @param pid true
 */
export const addDEP = () => {
  return httpPost<IResponse<ITreeNode[]>>('/api/org/v1/addDEP', null, {
    'Content-Type': 'application/json',
  }).then(({ data }) => data);
};

/**
 * @returns 管理员查询详情
 * @param id true
 */
export const getAdminDEPInfo = () => {
  return httpPost<IResponse<ITreeNode[]>>('/api/org/v1/adminDEPInfo', null, {
    'Content-Type': 'application/json',
  }).then(({ data }) => data);
};

/**
 * @returns 管理员分页查询
 * @param departmentName true
 * @param superPID false
 * @param pid false
 * @param page true
 * @param limit true
 */
export const getAdminDEPList = (id: string) => {
  return httpPost<IResponse<ITreeNode[]>>(
    '/api/org/v1/adminDEPList',
    JSON.stringify({ id }),
    {
      'Content-Type': 'application/json',
    }
  ).then(({ data }) => data);
};

/**
 * @returns 管理员顶层查询部门列表
 * @param superPID true
 * @param page true
 * @param limit true
 */
export const getAdminDEPSuperPID = () => {
  return httpPost<IResponse<ITreeNode[]>>(
    '/api/org/v1/adminDEPSuperPID',
    null,
    {
      'Content-Type': 'application/json',
    }
  ).then(({ data }) => data);
};

/**
 * @returns 管理员查询当前层级部门列表
 * @param useStatus false
 * @param pid true
 * @param page true
 * @param limit true
 */
export const getAdminDEPPID = () => {
  return httpPost<IResponse<ITreeNode[]>>('/api/org/v1/adminDEPList', null, {
    'Content-Type': 'application/json',
  }).then(({ data }) => data);
};

/**
 * @returns 修改
 * @param id false
 * @param departmentName false
 * @param departmentLeaderID false
 * @param useStatus false
 * @param pid false
 */
export const updateDEP = () => {
  return httpPost<IResponse<ITreeNode[]>>('/api/org/v1/updateDEP', null, {
    'Content-Type': 'application/json',
  }).then(({ data }) => data);
};

/**
 * @returns 删除
 * @param id true
 */
export const deleteDEP = (id: string) => {
  return httpPost<IResponse<null>>(
    '/api/org/v1/delDEP',
    JSON.stringify({ id }),
    {
      'Content-Type': 'application/json',
    }
  );
};

/**
 * @returns 用户查询部门详情
 * @param id true
 */
export const getUserDEPInfo = () => {
  return httpPost<IResponse<ITreeNode[]>>('/api/org/v1/userDEPInfo', null, {
    'Content-Type': 'application/json',
  }).then(({ data }) => data);
};

type Persons = {
  [name: string]: any;
};

/**
 * @returns 管理员分页（根据部门id获取人员列表）
 * @param id true
 */
export const getUserAdminInfo = (depID: string, params: any) => {
  // eslint-disable-next-line camelcase
  return httpPost<IResponse<{ total_count: number; data: Persons[] }>>(
    '/api/org/v1/adminUserList',
    JSON.stringify({ depID, ...params }),
    {
      'Content-Type': 'application/json',
    }
  ).then(({ data }) => ({
    total: data?.total_count || 0,
    data: data?.data || [],
  }));
};

/**
 * @returns 获取所有角色列表
 */
export const getUserTemplate = () => {
  return httpPost<IResponse<{ fileURL: string }>>(
    '/api/org/v1/getUserTemplate',
    null
  ).then(({ data }) => data?.fileURL);
};

type Roles = {
  id: string;
  name: string;
  tag: string;
  roleID: string;
};

/**
 * @returns 获取所有角色列表
 */
export const getListRole = () => {
  return httpPost<IResponse<{ roles: Roles[] }>>('/api/goalie/listRole', null, {
    'Content-Type': 'application/x-www-form-urlencoded',
  }).then(({ data }) => data?.roles);
};

/**
 * @returns 新增部门人员
 */
export const addDepUser = (values: FormValues | EditFormValues) => {
  return httpPost<IResponse<{ roles: Roles[] }>>(
    '/api/nurturing/v1/addUser',
    JSON.stringify(values),
    {
      'Content-Type': 'application/json',
    }
  );
};

/**
 * @returns 修改用户信息
 */
export const updateUser = (values: FormValues | EditFormValues) => {
  return httpPost<IResponse<{ roles: Roles[] }>>(
    '/api/nurturing/v1/updateUser',
    JSON.stringify(values),
    {
      'Content-Type': 'application/json',
    }
  );
};

/**
 * @returns 设为主管
 */
export const setDEPLeader = ({
  depID,
  userID,
}: {
  depID: string;
  userID: string;
}) => {
  return httpPost<IResponse<{ code: number }>>(
    '/api/org/v1/setDEPLeader',
    JSON.stringify({ depID, userID }),
    {
      'Content-Type': 'application/json',
    }
  ).then(({ data }) => data);
};

/**
 * @returns 取消主管
 */
export const cancelDEPLeader = ({
  depID,
}: {
  depID: string;
}) => {
  return httpPost<IResponse<{ code: number }>>(
    '/api/org/v1/cancelDEPLeader',
    JSON.stringify({ depID }),
    {
      'Content-Type': 'application/json',
    }
  );
};

/**
 * @returns 修改用户状态
 */
export const updateUserStatus = ({
  id,
  status,
}: {
  id: string;
  status: UserStatus;
}) => {
  return httpPost<IResponse<{ code: number }>>(
    '/api/nurturing/v1/updateUserStatus',
    JSON.stringify({ id, useStatus: status }),
    {
      'Content-Type': 'application/json',
    }
  ).then(({ data }) => data);
};

/**
 * @returns 获取拥有者角色列表
 */
export const getUserRole = ({
  ownerID,
  type,
}: {
  ownerID: string;
  type: 1 | 2;
}) => {
  return httpPost<IResponse<{ roles: Roles[] }>>(
    '/api/goalie/listOwnerRole',
    JSON.stringify({ ownerID, type }),
    {
      'Content-Type': 'application/json',
    }
  ).then(({ data }) => data?.roles);
};

/**
 * @returns
 */
export const batchAdjustDep = ({
  usersID,
  oldDepID,
  newDepID,
}: {
  usersID: string[];
  oldDepID: string;
  newDepID: string;
}) => {
  return httpPost<IResponse<{ code: number }>>(
    '/api/org/v1/adminChangeUsersDEP',
    JSON.stringify({ usersID, oldDepID, newDepID }),
    {
      'Content-Type': 'application/json',
    }
  ).then(({ data }) => data);
};

/**
 * @returns 发送随机密码
 */
export const resetUserPWD = ({
  userIDs,
  sendEmail,
  sendPhone,
}: {
  userIDs: string[];
  sendEmail: -1 | 1;
  sendPhone: -1 | 1;
}) => {
  return httpPost<IResponse<{ code: number }>>(
    '/api/nurturing/v1/adminResetPWD',
    JSON.stringify({ userIDs, sendEmail, sendPhone }),
    {
      'Content-Type': 'application/json',
    }
  );
};

export type FileParams = {
  depID: string;
  file: File;
};

/**
 * @returns 导入
 */
export const importTempFile = ({ depID, file }: FileParams) => {
  return httpFile('/api/org/v1/importFile', { depID, file });
};

export function createDepartment(params: {
  pid: string;
  departmentName: string;
}) {
  return httpPost('/api/org/v1/addDEP', JSON.stringify(params));
}

export function editDepartment(params: {
  pid: string;
  departmentName?: string;
  departmentLeaderID?: string;
}) {
  return httpPost('/api/org/v1/updateDEP', JSON.stringify(params));
}
