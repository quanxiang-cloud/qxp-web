import React from 'react';
import useCss from 'react-use/lib/useCss';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { Avatar } from '@portal/components/avatar2';
import Card from '@portal/components/card2';
import { List } from '@portal/components/list2';
import { ItemWithTitleDesc } from '@portal/components/item-with-title-desc4';
import { uuid } from '@assets/lib/utils';
import { usePortalGlobalValue } from '@clients/common/state/portal';

import './index.scss';

export default function Dashboard() {
  const [value] = usePortalGlobalValue();

  return (
    <>
      <main className="py-40 px-5-dot-2 relative">
        <div className="absolute right-5-dot-8 top-40 -z-1">
          <img src="/dist/images/work-figure.svg" alt=""/>
        </div>
        <div>
          <Avatar
            username={value.userInfo.userName}
            bio="万物皆有裂痕，那是光透过来的地方"
            avatar={value.userInfo.userIconURL}
          />
        </div>
        <div className="px-dot-6 mt-40">
          <Card
            className="ml-0 px-32 py-20 text-16"
            title="我的应用"
            action={
              <a className="transition ease-linear text-14 underline text-gray-600">前往应用市场</a>
            }
            content={
              <List
                className="flex-row"
                itemClassName={twCascade(
                  'px-20 py-16 rounded-12',
                  'mr-20 bg-white',
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
                          'w-44 h-44 p-8 flex items-center justify-center icon-border-radius',
                          'bg-gradient-green-to-top-right rounded-lg rounded-tr-none',
                        )}
                      >
                        <img src="/dist/images/calendar.svg" alt="calendar" />
                      </div>
                    }
                    titleClassName="text-14 leading-4 font-bold"
                    descClassName="leading-4"
                  />,
                  <ItemWithTitleDesc
                    key={uuid()}
                    title="CRM"
                    desc="未上线"
                    itemRender={
                      <div
                        className={twCascade(
                          'w-44 h-44 p-8 flex items-center justify-center icon-border-radius',
                          'bg-gradient-yellow-to-top-right rounded-lg rounded-tr-none',
                        )}
                      >
                        <img src="/dist/images/accounts.svg" alt="accounts" />
                      </div>
                    }
                    titleClassName="text-14 leading-4 font-bold"
                    descClassName="leading-4"
                  />,
                  <ItemWithTitleDesc
                    key={uuid()}
                    title="新建应用"
                    itemRender={
                      <div
                        className={twCascade(
                          'w-44 h-44 p-8 flex items-center justify-center icon-border-radius',
                          'bg-gradient-blue-to-top-right rounded-lg rounded-tr-none',
                        )}
                      >
                        <img src="/dist/images/add.svg" alt="add" />
                      </div>
                    }
                    titleClassName="text-14 leading-4 font-bold"
                    descClassName="leading-4"
                  />,
                ]}
              />
            }
          />
          <div className="flex justify-between items-center">
            <Card
              className="flex-1 ml-0 px-40 pt-20 text-16"
              title="我的待办"
              action={
                <a className="transition ease-linear text-14 underline color-324558">查看全部</a>
              }
              content={
                <List
                  className="flex-col"
                  itemClassName={twCascade(
                    // 'bg-white, mt-20, px-20',
                    useCss({
                      'margin-bottom': '2rem',
                      'background-color': '#fff',
                      padding: '0 20px',
                    }),
                    'rounded-12',
                  )}
                  items={[
                    <ItemWithTitleDesc
                      key={uuid()}
                      title="我发起的"
                      desc="12"
                      itemRender={
                        <div
                          className={twCascade(
                            'w-16 h-16 bg-gradient-green-to-top-right icon-border-radius',
                            'rounded-12 rounded-tr-none',
                          )}
                        />
                      }
                      textDirection="row"
                      className="h-5-dot-6"
                      textClassName="h-auto"
                      titleClassName="text-14"
                      descClassName="text-16 font-bold"
                    />,
                    <ItemWithTitleDesc
                      key={uuid()}
                      title="我处理的"
                      desc="3"
                      itemRender={
                        <div
                          className={twCascade(
                            'w-16 h-16 bg-gradient-yellow-to-top-right icon-border-radius',
                            'rounded rounded-tr-none',
                          )}
                        />
                      }
                      textDirection="row"
                      className="h-5-dot-6"
                      textClassName="h-auto"
                      titleClassName="text-14"
                      descClassName="text-16 font-bold"
                    />,
                    <ItemWithTitleDesc
                      key={uuid()}
                      title="抄送我的"
                      desc="3"
                      itemRender={
                        <div
                          className={twCascade(
                            'w-16 h-16 bg-gradient-blue-to-top-right icon-border-radius',
                            'rounded rounded-tr-none',
                          )}
                        />
                      }
                      textDirection="row"
                      className="h-5-dot-6"
                      textClassName="h-auto"
                      titleClassName="text-14"
                      descClassName="text-16 font-bold"
                    />,
                  ]}
                />
              }
            />
            <div className="w-20 h-full"></div>
            <Card
              className="flex-2 self-stretch flex flex-col px-40 py-20 text-16"
              title="未读消息"
              action={
                <a className="text-14 underline color-324558 transition ease-linear">查看全部</a>
              }
              content={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <img
                      className="w-48 h-48 mb-8"
                      src="/dist/images/alert.svg"
                      alt="alert"
                    />
                    <span className="text-12 text-blue-400">无未读消息</span>
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
