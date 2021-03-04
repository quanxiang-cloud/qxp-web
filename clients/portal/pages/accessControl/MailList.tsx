import React, { useState } from 'react'
import useCss from 'react-use/lib/useCss'
import classnames from 'classnames'
import { Select, Control, Icon, Input } from '@QCFE/lego-ui'

import { TextHeader } from '@portal/components/TextHeader'
import { DepartmentStaff } from '@portal/components/DepartmentStaff'
import { DepartmentTree } from './DepartmentTree'

export const MailList = () => {
  const [selectedValue, changeSelectedValue] = useState('CentOS')
  const [inputValue, changeInputValue] = useState('')
  return (
    <>
      <TextHeader
        title="企业通讯录"
        desc="管理账号，如添加、编辑、删除账号等，同时还能关联每个账号的角色；用户可用账号名称或邮件登录全象云平台。"
        action="📌 如何管理通讯录？"
        className="bg-F1F5F9-dot-5 px-4 py-dot-8 header-background-image"
      />
      <div>
        <div className="w-416 m-4 bg-F1F5F9 rounded-r-dot-6 rounded-tl-dot-2 rounded-bl-dot-6 flex items-center">
          <Select
            name="os"
            className={useCss({
              '&:hover': {
                border: 'none',
                background: 'none',
              },
              '.select-control': {
                background: 'none',
                border: 'none',
              },
              '&': {
                width: '5.3rem',
                border: 'none',
                background: 'none !important',
              },
              '.select-value-label': {
                'font-size': '14px',
              },
            })}
            value={selectedValue}
            options={[
              { value: 'CentOS', label: '按员工' },
              { value: 'Debian', label: '按部门' },
              { value: 'Ubuntu', label: '按邮箱' },
            ]}
          />
          <Control
            className={classnames(
              'has-icons-left flex-1',
              useCss({
                '> input': {
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                },
              }),
            )}
          >
            <Icon className="is-left" name="magnifier" />
            <Input
              type="text"
              placeholder="搜索员工名称、手机号、邮箱..."
              name="search"
              // onChange={changeInputValue}
              value={inputValue}
            />
          </Control>
        </div>
        <div className="mt-4 flex items-center">
          <div className="w-12-dot-95 border-r border-E2E8F0">
            <DepartmentStaff department="部门人员" count={0} unit="部门" />
            <DepartmentTree />
          </div>
          <div className="flex-1">
            <DepartmentStaff department="全象应用平台" count={1} unit="人" />
          </div>
        </div>
      </div>
    </>
  )
}
