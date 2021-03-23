import React from 'react';
import useCss from 'react-use/lib/useCss';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { Avatar } from '@portal/components/avatar2';
import { Card } from '@portal/components/card2';
import { List } from '@portal/components/list2';
import { ItemWithTitleDesc } from '@portal/components/item-with-title-desc4';
import { uuid } from '@assets/lib/utils';
import { usePortalGlobalValue } from '@clients/common/state/portal';

import './index.scss';

export default function Dashboard() {
  const [value] = usePortalGlobalValue();

  return (
    <>
      <main className="pt-3-dot-2 pb-3-dot-2 pl-5-dot-2 pr-5-dot-2 relative">
        <div className="absolute right-5-dot-8 top-8 -z-1">
          <img src="/dist/images/work-figure.svg" alt=""/>
        </div>
        <div>
          <Avatar
            username={value.userInfo.userName}
            bio="万物皆有裂痕，那是光透过来的地方"
            avatar={value.userInfo.userIconURL}
          />
        </div>
        <div className="px-dot-6">
          <Card
            className="ml-0 mt-8 px-16 py-8 text-1-dot-6"
            title="我的应用"
            action={
              <a className="transition ease-linear text-1-dot-4 underline text-gray-600">前往应用市场</a>
            }
            content={
              <List
                className="flex-row"
                itemClassName={twCascade(
                  'px-8 py-1-dot-6 p-8',
                  useCss({
                    'margin-right': '2rem',
                    'background-color': '#fff',
                  }),
                  'rounded-md',
                )}
                items={[
                  <ItemWithTitleDesc
                    key={uuid()}
                    title="会议室预订"
                    desc="已上线"
                    itemRender={
                      <div
                        className={twCascade(
                          'w-4-dot-4 h-4-dot-4 p-dot-3-6 flex items-center justify-center',
                          'bg-gradient-green-to-top-right rounded-lg rounded-tr-none',
                        )}
                      >
                        <img src="/dist/images/calendar.svg" alt="calendar" />
                      </div>
                    }
                    titleClassName="text-1-dot-4 leading-4 font-bold mb-4"
                    descClassName="leading-4"
                  />,
                  <ItemWithTitleDesc
                    key={uuid()}
                    title="CRM"
                    desc="未上线"
                    itemRender={
                      <div
                        className={twCascade(
                          'w-4-dot-4 h-4-dot-4 p-dot-3-6 flex items-center justify-center',
                          'bg-gradient-yellow-to-top-right rounded-lg rounded-tr-none',
                        )}
                      >
                        <img src="/dist/images/accounts.svg" alt="accounts" />
                      </div>
                    }
                    titleClassName="text-1-dot-4 leading-4 font-bold mb-4"
                    descClassName="leading-4"
                  />,
                  <ItemWithTitleDesc
                    key={uuid()}
                    title="新建应用"
                    itemRender={
                      <div
                        className={twCascade(
                          'w-4-dot-4 h-4-dot-4 p-dot-3-6 flex items-center justify-center',
                          'bg-gradient-blue-to-top-right rounded-lg rounded-tr-none',
                        )}
                      >
                        <img src="/dist/images/add.svg" alt="add" />
                      </div>
                    }
                    titleClassName="text-1-dot-4 leading-4 font-bold"
                    descClassName="leading-4"
                  />,
                ]}
              />
            }
          />
          <div className="flex justify-between items-center">
            <Card
              className="flex-1 ml-0 px-16 py-8 text-1-dot-6 mr-8"
              title="我的待办"
              action={
                <a className="transition ease-linear text-1-dot-4 underline color-324558">查看全部</a>
              }
              content={
                <List
                  className="flex-col"
                  itemClassName={twCascade(
                    useCss({
                      'margin-bottom': '2rem',
                      'background-color': '#fff',
                      padding: '0 20px',
                    }),
                    'rounded-md',
                  )}
                  items={[
                    <ItemWithTitleDesc
                      key={uuid()}
                      title="我发起的"
                      desc="12"
                      itemRender={
                        <div
                          className={twCascade(
                            'w-1-dot-6 h-1-dot-6 bg-gradient-green-to-top-right',
                            'rounded rounded-tr-none',
                          )}
                        />
                      }
                      textDirection="row"
                      className="h-5-dot-6"
                      textClassName="h-auto"
                      titleClassName="text-1-dot-4"
                      descClassName="text-1-dot-6 font-bold"
                    />,
                    <ItemWithTitleDesc
                      key={uuid()}
                      title="我处理的"
                      desc="3"
                      itemRender={
                        <div
                          className={twCascade(
                            'w-1-dot-6 h-1-dot-6 bg-gradient-yellow-to-top-right',
                            'rounded rounded-tr-none',
                          )}
                        />
                      }
                      textDirection="row"
                      className="h-5-dot-6"
                      textClassName="h-auto"
                      titleClassName="text-1-dot-4"
                      descClassName="text-1-dot-6 font-bold"
                    />,
                    <ItemWithTitleDesc
                      key={uuid()}
                      title="抄送我的"
                      desc="3"
                      itemRender={
                        <div
                          className={twCascade(
                            'w-1-dot-6 h-1-dot-6 bg-gradient-blue-to-top-right',
                            'rounded rounded-tr-none',
                          )}
                        />
                      }
                      textDirection="row"
                      className="h-5-dot-6"
                      textClassName="h-auto"
                      titleClassName="text-1-dot-4"
                      descClassName="text-1-dot-6 font-bold"
                    />,
                  ]}
                />
              }
            />
            <div className="w-8 h-full"></div>
            <Card
              className="flex-2 self-stretch flex flex-col px-16 py-8 text-1-dot-6"
              title="未读消息"
              action={
                <a className="text-1-dot-4 underline color-324558 transition ease-linear">查看全部</a>
              }
              content={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <img
                      className="w-4-dot-8 h-4-dot-8 mb-dot-6"
                      src="/dist/images/alert.svg"
                      alt="alert"
                    />
                    <span className="text-1-dot-2 text-blue-400">无未读消息</span>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </main>
    </>
  );
}
