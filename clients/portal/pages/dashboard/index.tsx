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
      <main className="pt-1-dot-6 pb-1-dot-6 pl-2-dot-6 pr-2-dot-6">
        <div>
          <Avatar
            username={value.userInfo.userName}
            bio="万物皆有裂痕，那是光透过来的地方"
            avatar={value.userInfo.userIconURL}
          />
        </div>
        <Card
          className="ml-0 mt-8 px-1-dot-6 py-4"
          title="我的应用"
          action={
            <a className="transition ease-linear text-1-dot-4 underline text-gray-600">前往应用市场</a>
          }
          content={
            <List
              className="flex-row"
              itemClassName={twCascade(
                'px-4 py-dot-8 p-4',
                useCss({
                  'margin-right': '1rem',
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
            className="flex-1 ml-0 px-1-dot-6 py-8"
            title="我的待办"
            action={
              <a className="transition ease-linear text-1-dot-4 underline color-324558">查看全部</a>
            }
            content={
              <List
                className="flex-col"
                itemClassName={twCascade(
                  useCss({
                    'margin-bottom': '1rem',
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
                          'w-1-dot-6 h-1-dot-6 bg-gradient-blue-to-top-right rounded rounded-tr-none',
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
          <Card
            className="flex-2 self-stretch flex flex-col px-1-dot-6 py-4"
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
                  <span className="text-1-dot-2">无未读消息</span>
                </div>
              </div>
            }
          />
        </div>
      </main>
    </>
  );
}
