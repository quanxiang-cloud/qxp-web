import httpClient from '@lib/http-client';
import { getDepDetail } from '@portal/modules/apps-management/pages/app-details/roles-and-permissions/api';
import { getUserAdminInfo } from '../departments-employees/api';
import { buildGraphQLQuery } from '../departments-employees/utils';

export type Group = {
  id: string;
  name: string;
};

export type MemberParams = {
  groupID?: string,
  userName?: string,
  page?: number,
  limit?: number
}

export type AddMemberType = {
  groupID?: string;
  addUsers?: Array<string>;
  delUsers?: Array<string>;
};

export async function getGroupList(page: number, limit: number): Promise<{ data: Array<Group> }> {
  return await httpClient.get('/api/v1/org/m/dep/group/list', { page, limit });
}

export async function delGroup(id: string): Promise<void> {
  return await httpClient.delete(`/api/v1/org/m/dep/group/${id}`);
}

export async function addMember(params: AddMemberType): Promise<void> {
  return await httpClient.put('/api/v1/org/m/user/group/set', params);
}

const userGraphQL = '{users{id,phone,email,name,departments{id,name},leaders{id,name}},total}';

export function getGroupMembers({
  groupID, userName, page, limit,
}: MemberParams): Promise<{users: any;total: number}> {
  const queryGraphQL = buildGraphQLQuery({
    departmentID: groupID,
    name: userName || '',
    page: page || 1,
    size: limit || 10,
  });

  return getUserAdminInfo({
    query: `{${queryGraphQL}${userGraphQL}}`,
  });
}

export function getGroups(name: string): Promise<{ departments: Group[] }> {
  // `{query(ids:${JSON.stringify(ids)}){departments{id,name}}}`
  return getDepDetail(
    { query: `{query(attr:[3],name:"${name}"){departments{id,name}}}` },
  );
}
