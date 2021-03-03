import React, { useState } from 'react';
import useCss from 'react-use/lib/useCss';
import classnames from 'classnames';
import { Select, Control, Icon, Input } from '@QCFE/lego-ui';

import { ContentHeader } from '@portal/components/ContentHeader';

const style = {
  width: 120,
  marginRight: 30,
  justifyContent: 'space-between',
};

export const MailList = () => {
  const [ selectedValue, changeSelectedValue ] = useState("CentOS");
  return (
    <>
      <ContentHeader
        title="企业通讯录"
        desc="管理账号，如添加、编辑、删除账号等，同时还能关联每个账号的角色；用户可用账号名称或邮件登录全象云平台。"
        rightText="📌 如何管理通讯录？"
      />
      <div className="p-4">
        <div className="w-416 bg-F1F5F9 rounded-r-dot-6 rounded-tl-dot-2 rounded-bl-dot-6 flex items-center">
          <Select
            name="os"
            className={useCss({
              '&': {
                'width': '100px'
              },
              '.select-control': {
                'background': 'none',
                'border': 'none',
              },
              '.select-value-label': {
                'font-size': '14px',
              }
            })}
            value={selectedValue}
            options={[
              { value: 'CentOS', label: '按员工' },
              { value: 'Debian', label: '按部门' },
              { value: 'Ubuntu', label: '按邮箱' },
            ]}
          />
          <Control className={classnames('has-icons-left', useCss({
            '> input': {
              'background': 'none',
              'border': 'none',
              'outline': 'none',
            }
          }))}>
            <Icon className="is-left" name="magnifier" />
            <Input
              type="text"
              placeholder="搜索员工名称、手机号、邮箱..."
              // onChange={this.handleChange}
              name="search"
              value={""}
            />
          </Control>
        </div>
      </div>
    </>
  )
}