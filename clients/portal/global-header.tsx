/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';
import useToggle from 'react-use/lib/useToggle';
import useCss from 'react-use/lib/useCss';
import { Link, useHistory } from 'react-router-dom';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { Icon } from '@QCFE/lego-ui';
import { useLocation } from 'react-router-dom';

import { More } from '@portal/components/more';
import Hamburger from '@portal/components/hamburger2';
import { List } from '@portal/components/list2';
import { ItemWithTitleDesc } from '@portal/components/item-with-title-desc4';
import { uuid } from '@assets/lib/utils';
import SvgIcon from './components/icon';

const menus = [
  {
    iconClassName: 'bg-gradient-yellow-to-top-right',
    iconUrl: '/dist/images/app-plus.svg',
    title: '应用管理',
    desc: '对平台的企业空间、账号、以及角色权限进行统一管理。',
    address: '/dist/images/calendar.svg',
  },
  {
    iconClassName: 'bg-gradient-green-to-top-right',
    iconUrl: '/dist/images/aces-ctl.svg',
    title: '访问控制',
    desc: '对平台的企业空间、账号、以及角色权限进行统一管理。',
    address: '/accessControl',
  },
  {
    iconClassName: 'bg-gradient-blue-to-top-right',
    iconUrl: '/dist/images/clothes.svg',
    title: '平台设置',
    desc: '对平台的企业空间、账号、以及角色权限进行统一管理。',
    address: '/dist/images/add.svg',
  },
];

export default function GlobalHeader() {
  const [on, toggle] = useToggle(false);
  const history = useHistory();
  const maskRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const maskElement = maskRef.current;
    if (!maskElement) {
      return;
    }
    maskElement.onclick = (e: MouseEvent) => {
      if (e.target == maskElement) {
        toggle();
      }
    };
    return () => {
      maskElement.onclick = null;
    };
  }, []);

  useEffect(() => {
    if (!maskRef.current) {
      return;
    }
    let timeId = 0;
    const maskElement = (maskRef.current as unknown) as HTMLDivElement;
    if (on) {
      maskElement.classList.remove('hidden');
      maskElement.classList.remove('opacity-0');
      maskElement.classList.add('opacity-100');
    } else {
      maskElement.classList.remove('opacity-100');
      maskElement.classList.add('opacity-0');
      timeId = setTimeout(() => {
        maskElement.classList.add('hidden');
      }, 200);
    }
    return () => {
      clearTimeout(timeId);
    };
  }, [on]);

  const isHome = location.pathname === '/';
  const isAppManagement = location.pathname === '/app-management';
  const isAccess = location.pathname === '/access-control';
  const isSystemControl = location.pathname === '/system';

  function className(condition: boolean) {
    if (condition) {
      return {
        'bg-blue-100': condition,
      };
    }
  }

  function style(condition: boolean) {
    if (condition) {
      return {
        color: 'var(--blue-600)',
      };
    }
    return {};
  }

  return (
    <>
      <div className="flex justify-between py-8 px-24 bg-white">
        <div className="flex items-center flex-2">
          {/* <div
            className="mr-8 flex justify-between items-center cursor-pointer"
            onClick={toggle}
          >
            <Hamburger active={on} />
            <span className="ml-8 text-button">平台管理</span>
          </div> */}
          <Link
            to="/"
            className={twCascade(
              'header-nav-btn group mr-12',
              className(isHome)
            )}
          >
            <div className="header-nav-btn-icon-wrapper">
              <SvgIcon
                name="add_task"
                className="group-hover:text-blue-600"
                size={22}
                style={style(isHome)}
              />
            </div>
            <span
              className="header-nav-btn-text group-hover:text-blue-600"
              style={style(isHome)}
            >
              工作台
            </span>
          </Link>
          <Link
            to="/app-management"
            className={twCascade(
              'header-nav-btn group mr-20',
              className(isAppManagement)
            )}
          >
            <div className="header-nav-btn-icon-wrapper">
              <svg
                width="19"
                height="18"
                viewBox="0 0 19 18"
                className="header-nav-btn-icon group-hover:text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                style={style(isAppManagement)}
              >
                <path d="M17.3333 3.31663L7.825 12.8333L4.29166 9.29996L5.46666 8.12496L7.825 10.4833L16.1583 2.14996L17.3333 3.31663ZM9 15.6666C5.325 15.6666 2.33333 12.675 2.33333 8.99996C2.33333 5.32496 5.325 2.33329 9 2.33329C10.3083 2.33329 11.5333 2.71663 12.5667 3.37496L13.775 2.16663C12.4167 1.22496 10.775 0.666626 9 0.666626C4.4 0.666626 0.666664 4.39996 0.666664 8.99996C0.666664 13.6 4.4 17.3333 9 17.3333C10.4417 17.3333 11.8 16.9666 12.9833 16.3166L11.7333 15.0666C10.9 15.45 9.975 15.6666 9 15.6666ZM14.8333 11.5H12.3333V13.1666H14.8333V15.6666H16.5V13.1666H19V11.5H16.5V8.99996H14.8333V11.5Z" />
              </svg>
            </div>
            <span
              className="header-nav-btn-text group-hover:text-blue-600"
              style={style(isAppManagement)}
            >
              应用管理
            </span>
          </Link>
          <Link
            to="/access-control"
            className={twCascade(
              'header-nav-btn group mr-20',
              className(isAccess)
            )}
          >
            <div className="header-nav-btn-icon-wrapper">
              <svg
                width="19"
                height="18"
                viewBox="0 0 19 18"
                className="header-nav-btn-icon group-hover:text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                style={style(isAccess)}
              >
                <path d="M17.3333 3.31663L7.825 12.8333L4.29166 9.29996L5.46666 8.12496L7.825 10.4833L16.1583 2.14996L17.3333 3.31663ZM9 15.6666C5.325 15.6666 2.33333 12.675 2.33333 8.99996C2.33333 5.32496 5.325 2.33329 9 2.33329C10.3083 2.33329 11.5333 2.71663 12.5667 3.37496L13.775 2.16663C12.4167 1.22496 10.775 0.666626 9 0.666626C4.4 0.666626 0.666664 4.39996 0.666664 8.99996C0.666664 13.6 4.4 17.3333 9 17.3333C10.4417 17.3333 11.8 16.9666 12.9833 16.3166L11.7333 15.0666C10.9 15.45 9.975 15.6666 9 15.6666ZM14.8333 11.5H12.3333V13.1666H14.8333V15.6666H16.5V13.1666H19V11.5H16.5V8.99996H14.8333V11.5Z" />
              </svg>
            </div>
            <span
              className="header-nav-btn-text group-hover:text-blue-600"
              style={style(isAccess)}
            >
              访问控制
            </span>
          </Link>
          <Link
            to="/system"
            className={twCascade(
              'header-nav-btn group mr-20',
              className(isSystemControl)
            )}
          >
            <div className="header-nav-btn-icon-wrapper">
              <svg
                width="19"
                height="18"
                viewBox="0 0 19 18"
                className="header-nav-btn-icon group-hover:text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                style={style(isSystemControl)}
              >
                <path d="M17.3333 3.31663L7.825 12.8333L4.29166 9.29996L5.46666 8.12496L7.825 10.4833L16.1583 2.14996L17.3333 3.31663ZM9 15.6666C5.325 15.6666 2.33333 12.675 2.33333 8.99996C2.33333 5.32496 5.325 2.33329 9 2.33329C10.3083 2.33329 11.5333 2.71663 12.5667 3.37496L13.775 2.16663C12.4167 1.22496 10.775 0.666626 9 0.666626C4.4 0.666626 0.666664 4.39996 0.666664 8.99996C0.666664 13.6 4.4 17.3333 9 17.3333C10.4417 17.3333 11.8 16.9666 12.9833 16.3166L11.7333 15.0666C10.9 15.45 9.975 15.6666 9 15.6666ZM14.8333 11.5H12.3333V13.1666H14.8333V15.6666H16.5V13.1666H19V11.5H16.5V8.99996H14.8333V11.5Z" />
              </svg>
            </div>
            <span
              className="header-nav-btn-text group-hover:text-blue-600"
              style={style(isSystemControl)}
            >
              系统管理
            </span>
          </Link>
        </div>
        <img
          className="flex-1 h-46"
          src="/dist/images/quanxiangyun.svg"
          alt="quanxiangyun"
        />
        <div className="flex justify-end items-center flex-2">
          <div className="mr-56 header-nav-btn group">
            <div className="header-nav-btn-icon-wrapper">
              <SvgIcon
                name="book"
                className="group-hover:text-blue-600"
                size={22}
              />
            </div>
            <span className="header-nav-btn-text group-hover:text-blue-600">
              帮助文档
            </span>
          </div>
          <div className="header-nav-btn group">
            <SvgIcon
              name="settings"
              className="group-hover:text-blue-600"
              size={22}
            />
            <More
              items={[
                <Link
                  to="/login/password"
                  key={uuid()}
                  className="cursor-pointer flex items-center h-36
                  pl-16 hover:bg-blue-100 transition whitespace-nowrap text-button text-gray-900 hover:text-gray-600"
                >
                  重置密码
                </Link>,
                <form
                  key={uuid()}
                  action="/logout"
                  method="post"
                  className="w-full h-full"
                >
                  <button
                    type="submit"
                    className="cursor-pointer flex items-center h-36 px-16
                    hover:bg-blue-100 transition w-full whitespace-nowrap text-button text-gray-900 hover:text-gray-600"
                  >
                    登出
                  </button>
                </form>,
              ]}
              className="flex items-center justify-center"
              contentClassName="w-48"
            >
              <div
                className="cursor-pointer flex items-center h-36
                hover:blue-100 transition group-hover:text-blue-600"
              >
                个人中心
                <Icon name="caret-down" style={{ marginLeft: '8px' }} />
              </div>
            </More>
          </div>
        </div>
      </div>

      {/* <div
        className="w-screen h-screen z-20 top-64 bg-black-900 bg-opacity-50 fixed hidden
      transition duration-200"
        ref={maskRef}
      >
        <div
          className={classnames(
            '-left-full transform px-40 max-w-%90 w-588 absolute bottom-0 top-0 flex flex-col',
            useCss({
              background: 'var(--blue-100)',
              opacity: 0.9,
              'backdrop-filter': 'blur(72px)',
            }),
            {
              'slide-in': on,
              'slide-out': !on,
            },
          )}
        >
          <div className="relative">
            <img
              className="absolute top-40 right-40"
              src="/dist/images/menu-chatu.svg"
              alt="chatu"
            />
            <List
              className="flex-col mt-144"
              itemClassName={classnames(
                'pb-20 transform transition-all duration-200',
                useCss({
                  '&:hover .next': {
                    width: '3.2rem',
                    height: '3.2rem',
                  },
                  '.next': {
                    width: '2.4rem',
                    height: '2.4rem',
                  },
                  '&:hover > div': {
                    'box-shadow': '0px 8px 24px 4px rgba(148, 163, 184, 0.25)',
                  },
                }),
              )}
              items={menus.map(({ title, desc, iconClassName, iconUrl, address }) => (
                <div
                  key={uuid()}
                  onClick={() => {
                    toggle();
                    history.push(address);
                  }}
                  className={twCascade(
                    'flex flex-row justify-between items-center bg-white px-20 py-16',
                    'rounded-12 cursor-pointer transition-all duration-200',
                  )}
                >
                  <ItemWithTitleDesc
                    title={title}
                    desc={desc}
                    itemRender={
                      <div
                        className={classnames(
                          'p-8 icon-border-radius w-48',
                          'h-48 icon-border-radius flex items-center justify-center',
                          iconClassName,
                        )}
                      >
                        <img className="w-32 h-32" src={iconUrl} alt={title} />
                      </div>
                    }
                    titleClassName="text-h4"
                    descClassName="text-caption"
                  />
                  <Link to={address}>
                    <Icon className="next transition-all duration-200" name="next" type="dark" />
                  </Link>
                </div>
              ))}
            />
          </div>
          <div className='h-32 self-start mt-20 opacity-button'>
            <Icon className="mr-5" name="close" type="dark" size={20} />
            <span className="text-button" onClick={toggle}>离开当前页面</span>
          </div>
        </div>
      </div> */}
    </>
  );
}
