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
export interface IRoleFunc {
  [key: string]: {
    name: string
    funcTag: string
    has: boolean
    child: IRoleFunc
  }
}
export const getRoleFunctions = ({ queryKey }: QueryFunctionContext) =>
  httpPost<
    IResponse<{
      func: IRoleFunc
      lastSaveTime: string
    }>
  >(
    '/api/goalie/listRoleFunc',
    JSON.stringify({
      roleID: queryKey[1],
    }),
  ).then(({ data }) => ({ func: data.func, lastSaveTime: data.lastSaveTime }))
