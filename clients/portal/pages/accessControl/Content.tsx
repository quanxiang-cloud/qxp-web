import React from 'react'

import { RoleManagement } from './RoleManagement'
import { MailList } from './CompanyMailList'

export interface IContent {
  menuType: string
}

export const Content = ({ menuType }: IContent) => {
  return (
    <>
      {menuType === 'corporateDirectory' && <MailList />}
      {menuType === 'RoleManagement' && <RoleManagement />}
    </>
  )
}
