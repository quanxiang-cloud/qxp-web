import React from 'react'
import useCss from 'react-use/lib/useCss'
import classnames from 'classnames'

import { Avatar } from '@portal/components/Avatar'
import { Card } from '@portal/components/Card'
import { List } from '@portal/components/List'
import { ItemWithTitleDesc } from '@portal/components/ItemWithTitleDesc'
import { HeaderWithMenu } from '@portal/components/HeaderWithMenu'

import './index.scss'

export default function Dashboard() {
  return (
    <>
      <HeaderWithMenu />
      <main className="pt-1-dot-6 pb-1-dot-6 pl-2-dot-6 pr-2-dot-6">
        <div>
          <Avatar
            username="Jackson"
            bio="万物皆有裂痕，那是光透过来的地方"
            avatar="/dist/images/avatar.jpg"
          />
        </div>
        <Card
          className="ml-0 mt-8 px-1-dot-6 py-4"
          title="我的应用"
          action={
            <a className="transition ease-linear text-dot-7 underline text-324558">前往应用市场</a>
          }
          content={
            <List
              itemClassName={classnames(
                'px-4 py-dot-8 p-8',
                useCss({
                  'margin-right': '1rem',
                  'background-color': '#fff',
                }),
                'rounded-md',
              )}
              items={[
                <ItemWithTitleDesc
                  title="会议室预订"
                  desc="已上线"
                  itemRender={() => (
                    <div className="p-dot-3-6 bg-gradient-green-to-top-right rounded-lg rounded-tr-none">
                      <img src="/dist/images/calendar.svg" alt="calendar" />
                    </div>
                  )}
                  titleClassName="text-dot-7 leading-4 font-bold"
                  descClassName="leading-4"
                />,
                <ItemWithTitleDesc
                  title="CRM"
                  desc="未上线"
                  itemRender={() => (
                    <div className="p-dot-3-6 bg-gradient-yellow-to-top-right rounded-lg rounded-tr-none">
                      <img src="/dist/images/accounts.svg" alt="accounts" />
                    </div>
                  )}
                  titleClassName="text-dot-7 leading-4 font-bold"
                  descClassName="leading-4"
                />,
                <ItemWithTitleDesc
                  title="新建应用"
                  itemRender={() => (
                    <div className="p-dot-3-6 bg-gradient-blue-to-top-right rounded-lg rounded-tr-none">
                      <img src="/dist/images/add.svg" alt="add" />
                    </div>
                  )}
                  titleClassName="text-dot-7 leading-4 font-bold"
                  descClassName="leading-4"
                />,
              ]}
            />
          }
        />
        <div className="flex justify-between items-center">
          <Card
            className="flex-1 ml-0 px-1-dot-6 py-4"
            title="我的待办"
            action={
              <a className="transition ease-linear text-dot-7 underline color-324558">查看全部</a>
            }
            content={
              <List
                className="flex-col"
                itemClassName={classnames(
                  useCss({
                    'margin-bottom': '1rem',
                    'background-color': '#fff',
                    padding: '.8rem',
                  }),
                  'rounded-md',
                )}
                items={[
                  <ItemWithTitleDesc
                    title="我发起的"
                    desc="12"
                    itemRender={() => (
                      <div className="w-dot-8 h-dot-8 bg-gradient-green-to-top-right rounded rounded-tr-none"></div>
                    )}
                    textDirection="row"
                    titleClassName="text-dot-7"
                    descClassName="text-dot-8 font-bold"
                  />,
                  <ItemWithTitleDesc
                    title="我处理的"
                    desc="3"
                    itemRender={() => (
                      <div className="w-dot-8 h-dot-8 bg-gradient-yellow-to-top-right rounded rounded-tr-none"></div>
                    )}
                    textDirection="row"
                    titleClassName="text-dot-7"
                    descClassName="text-dot-8 font-bold"
                  />,
                  <ItemWithTitleDesc
                    title="抄送我的"
                    desc="3"
                    itemRender={() => (
                      <div className="w-dot-8 h-dot-8 bg-gradient-blue-to-top-right rounded rounded-tr-none"></div>
                    )}
                    textDirection="row"
                    titleClassName="text-dot-7"
                    descClassName="text-dot-8 font-bold"
                  />,
                ]}
              />
            }
          />
          <Card
            className="flex-2 self-stretch flex flex-col px-1-dot-6 py-4"
            title="未读消息"
            action={
              <a className="text-dot-7 underline color-324558 transition ease-linear">查看全部</a>
            }
            content={
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <img
                    className="w-2-dot-4 h-2-dot-4 mb-dot-6"
                    src="/dist/images/alert.svg"
                    alt="alert"
                  />
                  <span className="text-dot-6">无未读消息</span>
                </div>
              </div>
            }
          />
        </div>
      </main>
    </>
  )
}
