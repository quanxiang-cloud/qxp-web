/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';
import useToggle from 'react-use/lib/useToggle';
import { Link, useHistory } from 'react-router-dom';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { Icon } from '@QCFE/lego-ui';
import { useLocation } from 'react-router-dom';

import { More } from '@c/more';
import { uuid } from '@assets/lib/utils';
import Authorized from '@clients/common/component/authorized';
import SvgIcon from './components/icon';

export default function GlobalHeader() {
  const [on, toggle] = useToggle(false);
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
  const isAccess = [
    '/access-control',
    '/access-control/corporate-directory',
    '/access-control/role-management',
  ].includes(location.pathname);
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
      <div className="flex justify-between items-center py-8 px-24 bg-white">
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
                className="group-hover:text-blue-600 header-nav-btn-icon"
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
              <SvgIcon
                name="application_management"
                className="group-hover:text-blue-600 header-nav-btn-icon"
                style={style(isAppManagement)}
              />
            </div>
            <span
              className="header-nav-btn-text group-hover:text-blue-600"
              style={style(isAppManagement)}
            >
              应用管理
            </span>
          </Link>
          <Authorized authority={['accessControl']}>
            <Link
              to="/access-control"
              className={twCascade(
                'header-nav-btn group mr-20',
                className(isAccess)
              )}
            >
              <div className="header-nav-btn-icon-wrapper">
                <SvgIcon
                  name="access_control"
                  className="group-hover:text-blue-600 header-nav-btn-icon"
                  style={style(isAccess)}
                />
              </div>
              <span
                className="header-nav-btn-text group-hover:text-blue-600"
                style={style(isAccess)}
              >
                访问控制
              </span>
            </Link>
          </Authorized>
          <Link
            to="/system"
            className={twCascade(
              'header-nav-btn group mr-20',
              className(isSystemControl)
            )}
          >
            <div className="header-nav-btn-icon-wrapper">
              <SvgIcon
                name="system_management"
                className="group-hover:text-blue-600 header-nav-btn-icon"
                size={22}
                style={style(isSystemControl)}
              />
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
                className="group-hover:text-blue-600 header-nav-btn-icon"
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
              className="group-hover:text-blue-600 header-nav-btn-icon"
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
    </>
  );
}
