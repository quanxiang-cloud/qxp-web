import { QueryFunctionContext } from 'react-query'

import { httpPost } from '../../../../assets/lib/f'
import { IResponse } from '../../../../@types/interface/api'
import Role from './role'

// 获取角色列表
export const getRolesList = () =>
  httpPost<IResponse<{ roles: Role[] }>>('/api/goalie/listRole', null, {
    'Content-Type': 'application/x-www-form-urlencoded',
  }).then(({ data }) => data.roles)

// 获取角色功能集
export interface IRoleFuncItem {
  name: string
  funcTag: string
  has: boolean
  child: IRoleFunc
}
export interface IRoleFunc {
  [key: string]: IRoleFuncItem
}
export const getRoleFunctions = ({ queryKey }: QueryFunctionContext) =>
  httpPost<
    IResponse<{
      func: IRoleFunc
      lastSaveTime: number
    }>
  >(
    '/api/goalie/listRoleFunc',
    JSON.stringify({
      roleID: queryKey[1],
    }),
  ).then(({ data }) => ({ func: data.func, lastSaveTime: data.lastSaveTime }))

// 设置用户功能集
export const setRoleFunctions = ({ queryKey }: QueryFunctionContext) =>
  httpPost<
    IResponse<{
      code: number
    }>
  >(
    '/api/goalie/updateRoleFunc',
    JSON.stringify({
      roleID: queryKey[1],
      add: queryKey[2],
      ...(queryKey[3] ? { delete: queryKey[3] } : {}),
    }),
  ).then(({ data }) => ({ code: data.code }))

export interface IOwner {
  type: number
  ownerID: string
  ownerName: string
  createdAt: number
}
// 获取角色关联
export const getRoleAssociations = ({ queryKey }: QueryFunctionContext) =>
  httpPost<
    IResponse<{
      owners: IOwner[]
    }>
  >(
    '/api/goalie/listRoleOwner',
    JSON.stringify({
      roleID: queryKey[1],
    }),
  ).then(({ data }) => ({
    owners: data.owners,
  }))
