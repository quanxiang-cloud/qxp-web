import { httpPost } from '../../../../assets/lib/f'
import { IResponse } from '../../../../@types/interface/api'
import Role from './role'

// 获取角色列表
export const getRolesList = () =>
  httpPost<IResponse<{ roles: Role[] }>>('/api/goalie/listRole', null, {
    'Content-Type': 'application/x-www-form-urlencoded',
  }).then(({ data }) => {
    return data.roles
  })
