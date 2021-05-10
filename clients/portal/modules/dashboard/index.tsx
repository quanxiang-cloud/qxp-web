import React, { useEffect } from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import Avatar from '@c/avatar';
import Card from '@c/card';
import List from '@c/list';
import ItemWithTitleDesc from '@c/item-with-title-desc';
import AppIcon from '@c/app-icon';
import { uuid } from '@lib/utils';
import { usePortalGlobalValue } from '@portal/states_to_be_delete/portal';

import './index.scss';

export default function Dashboard() {
  const [value] = usePortalGlobalValue();
  useEffect(() => {
    document.title = '工作台';
  }, []);
  return (
    <>
      <main className="py-40 px-58 relative"
        style={{ height: 'calc(100vh - 62px)', overflow: 'scroll' }}>
        <div className="absolute top-42 right-64 -z-z-1 w-214 h-160">
          <img src="/dist/images/work-figure.svg" alt="dashboard"/>
        </div>
        <Avatar
          username={value.userInfo.userName}
          title={true}
          cornerClassName="corner-12-2-12-12"
          bio="万物皆有裂痕，那是光透过来的地方"
          avatar={value.userInfo.userIconURL}
        />
        <div className="px-6 mt-40">
          <Card
            className="px-32 py-20"
            headerClassName="ml-8"
            title="我的应用"
            itemTitleClassName="text-h5"
            action={
              <a className="transition ease-linear text-underline">前往应用市场</a>
            }
            content={
              (<List
                className="flex-row"
                itemClassName="px-20 py-16 mr-20 bg-white rounded-12"
                items={[
                  <ItemWithTitleDesc
                    key={uuid()}
                    title="会议室预订"
                    desc="已上线"
                    itemRender={
                      (<div
                        className={twCascade(
                          'w-44 h-44 p-8 flex items-center justify-center corner-12-2-12-12',
                          'bg-gradient-green-to-top-right rounded-lg rounded-tr-none',
                        )}
                      >
                        <AppIcon themeColor="teal" size={44} iconName="event_available"/>
                      </div>)
                    }
                    titleClassName="text-h6"
                    descClassName="text-caption"
                  />,
                  <ItemWithTitleDesc
                    key={uuid()}
                    title="CRM"
                    titleClassName="text-h6"
                    desc="未上线"
                    itemRender={
                      (<div
                        className={twCascade(
                          'w-44 h-44 p-8 flex items-center justify-center corner-12-2-12-12',
                          'bg-gradient-yellow-to-top-right rounded-lg rounded-tr-none',
                        )}
                      >
                        <AppIcon themeColor="amber" size={44} iconName="supervisor_account"/>
                      </div>)
                    }
                    descClassName="text-caption"
                  />,
                  <ItemWithTitleDesc
                    key={uuid()}
                    title="新建应用"
                    titleClassName="text-button"
                    itemRender={
                      (<div
                        className={twCascade(
                          'w-44 h-44 p-8 flex items-center justify-center corner-12-2-12-12',
                          'bg-gradient-blue-to-top-right rounded-lg rounded-tr-none',
                        )}
                      >
                        <img src="/dist/images/add.svg" alt="add" />
                      </div>)
                    }
                  />,
                ]}
              />)
            }
          />
          <div className="flex justify-between items-center">
            <Card
              className="flex-1 ml-0 px-40 pt-20 text-16"
              title="我的待办"
              itemTitleClassName="text-h5"
              action={
                <a className="transition ease-linear text-black-50 text-underline-no-color">查看全部</a>
              }
              content={
                (<List
                  className="flex-col flex-1"
                  itemClassName="px-20 rounded-12 mb-20 bg-white"
                  items={[
                    <ItemWithTitleDesc
                      key={uuid()}
                      title="我发起的"
                      desc="12"
                      itemRender={
                        (<div
                          className="w-16 h-16 bg-gradient-green-to-top-right corner-12-2-12-12"
                        />)
                      }
                      textDirection="row"
                      className="h-56"
                      textClassName="h-auto"
                      titleClassName="text-body2"
                      descClassName="text-h5 text-blue-1100"
                    />,
                    <ItemWithTitleDesc
                      key={uuid()}
                      title="我处理的"
                      desc="3"
                      itemRender={
                        (<div
                          className={twCascade(
                            'w-16 h-16 bg-gradient-yellow-to-top-right corner-12-2-12-12',
                            'rounded rounded-tr-none',
                          )}
                        />)
                      }
                      textDirection="row"
                      className="h-56"
                      textClassName="h-auto"
                      titleClassName="text-body2"
                      descClassName="text-16 font-bold"
                    />,
                    <ItemWithTitleDesc
                      key={uuid()}
                      title="抄送我的"
                      desc="3"
                      itemRender={
                        (<div
                          className={twCascade(
                            'w-16 h-16 bg-gradient-blue-to-top-right corner-12-2-12-12',
                            'rounded rounded-tr-none',
                          )}
                        />)
                      }
                      textDirection="row"
                      className="h-56"
                      textClassName="h-auto"
                      titleClassName="text-14"
                      descClassName="text-16 font-bold"
                    />,
                  ]}
                />)
              }
            />
            <div className="w-20 "></div>
            <Card
              className="flex-2 self-stretch flex flex-col px-40 py-20 text-16"
              title="未读消息"
              itemTitleClassName="text-h5"
              action={
                <a className="text-underline-no-color text-black-50 transition ease-linear">查看全部</a>
              }
              content={
                (<div className="w-full flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <img
                      className="w-48 h-48 mb-8"
                      src="/dist/images/alert.svg"
                      alt="alert"
                    />
                    <span className="text-blue-400 text-caption-no-color">无未读消息</span>
                  </div>
                </div>)
              }
            />
          </div>
        </div>
      </main>
    </>
  );
}
