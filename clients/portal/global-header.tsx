/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import useToggle from 'react-use/lib/useToggle';
import useCss from 'react-use/lib/useCss';
import { Link, useHistory } from 'react-router-dom';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { Icon } from '@QCFE/lego-ui';


import { More } from '@portal/components/more';
import Hamburger from '@portal/components/hamburger2';
import { List } from '@portal/components/list2';
import { ItemWithTitleDesc } from '@portal/components/item-with-title-desc4';
import { uuid } from '@assets/lib/utils';

const menus = [
  {
    iconClassName: 'bg-gradient-yellow-to-top-right',
    iconUrl: '/dist/images/calendar.svg',
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
    iconUrl: '/dist/images/add.svg',
    title: '平台设置',
    desc: '对平台的企业空间、账号、以及角色权限进行统一管理。',
    address: '/dist/images/add.svg',
  },
];

export default function GlobalHeader() {
  const [on, toggle] = useToggle(false);
  const history = useHistory();
  const maskRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <div className="flex justify-between py-8 px-24 bg-white">
        <div className="flex items-center flex-2">
          <div
            className="mr-8 flex justify-between items-center cursor-pointer"
            onClick={toggle}
          >
            <Hamburger onChange={toggle} active={on} />
            <span className="ml-8 text-button">平台管理</span>
          </div>
          <Link
            to="/"
            className="header-nav-btn group"
          >
            <div className="header-nav-btn-icon-wrapper">
              <svg width="19" height="18" viewBox="0 0 19 18" className="header-nav-btn-icon group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.3333 3.31663L7.825 12.8333L4.29166 9.29996L5.46666 8.12496L7.825 10.4833L16.1583 2.14996L17.3333 3.31663ZM9 15.6666C5.325 15.6666 2.33333 12.675 2.33333 8.99996C2.33333 5.32496 5.325 2.33329 9 2.33329C10.3083 2.33329 11.5333 2.71663 12.5667 3.37496L13.775 2.16663C12.4167 1.22496 10.775 0.666626 9 0.666626C4.4 0.666626 0.666664 4.39996 0.666664 8.99996C0.666664 13.6 4.4 17.3333 9 17.3333C10.4417 17.3333 11.8 16.9666 12.9833 16.3166L11.7333 15.0666C10.9 15.45 9.975 15.6666 9 15.6666ZM14.8333 11.5H12.3333V13.1666H14.8333V15.6666H16.5V13.1666H19V11.5H16.5V8.99996H14.8333V11.5Z"/>
              </svg>
            </div>
            <span className="header-nav-btn-text group-hover:text-blue-600">工作台</span>
          </Link>
        </div>
        <img className="flex-1 h-46" src="/dist/images/quanxiangyun.svg" alt="quanxiangyun" />
        <div className="flex justify-end items-center flex-2">
          <div className="mr-56 header-nav-btn group">
            <div className="header-nav-btn-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 20 20" className="header-nav-btn-icon group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.9999 1.66663H4.99992C4.08325 1.66663 3.33325 2.41663 3.33325 3.33329V16.6666C3.33325 17.5833 4.08325 18.3333 4.99992 18.3333H14.9999C15.9166 18.3333 16.6666 17.5833 16.6666 16.6666V3.33329C16.6666 2.41663 15.9166 1.66663 14.9999 1.66663ZM7.49992 3.33329H9.16658V7.49996L8.33325 6.87496L7.49992 7.49996V3.33329ZM14.9999 16.6666H4.99992V3.33329H5.83325V10.8333L8.33325 8.95829L10.8333 10.8333V3.33329H14.9999V16.6666Z" />
              </svg>
            </div>
            <span className="header-nav-btn-text group-hover:text-blue-600">帮助文档</span>
          </div>
          <div className="header-nav-btn group">
            <svg width="20" height="20" viewBox="0 0 20 20" className="header-nav-btn-icon group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.1918 10.8166C16.2251 10.55 16.2501 10.2833 16.2501 9.99996C16.2501 9.71663 16.2251 9.44996 16.1918 9.18329L17.9501 7.80829C18.1084 7.68329 18.1501 7.45829 18.0501 7.27496L16.3834 4.39163C16.3084 4.25829 16.1668 4.18329 16.0168 4.18329C15.9668 4.18329 15.9168 4.19163 15.8751 4.20829L13.8001 5.04163C13.3668 4.70829 12.9001 4.43329 12.3918 4.22496L12.0751 2.01663C12.0501 1.81663 11.8751 1.66663 11.6668 1.66663H8.33344C8.12511 1.66663 7.95011 1.81663 7.92511 2.01663L7.60844 4.22496C7.10011 4.43329 6.63344 4.71663 6.20011 5.04163L4.12511 4.20829C4.07511 4.19163 4.02511 4.18329 3.97511 4.18329C3.83344 4.18329 3.69178 4.25829 3.61678 4.39163L1.95011 7.27496C1.84178 7.45829 1.89178 7.68329 2.05011 7.80829L3.80844 9.18329C3.77511 9.44996 3.75011 9.72496 3.75011 9.99996C3.75011 10.275 3.77511 10.55 3.80844 10.8166L2.05011 12.1916C1.89178 12.3166 1.85011 12.5416 1.95011 12.725L3.61678 15.6083C3.69178 15.7416 3.83344 15.8166 3.98344 15.8166C4.03344 15.8166 4.08344 15.8083 4.12511 15.7916L6.20011 14.9583C6.63344 15.2916 7.10011 15.5666 7.60844 15.775L7.92511 17.9833C7.95011 18.1833 8.12511 18.3333 8.33344 18.3333H11.6668C11.8751 18.3333 12.0501 18.1833 12.0751 17.9833L12.3918 15.775C12.9001 15.5666 13.3668 15.2833 13.8001 14.9583L15.8751 15.7916C15.9251 15.8083 15.9751 15.8166 16.0251 15.8166C16.1668 15.8166 16.3084 15.7416 16.3834 15.6083L18.0501 12.725C18.1501 12.5416 18.1084 12.3166 17.9501 12.1916L16.1918 10.8166ZM14.5418 9.39163C14.5751 9.64996 14.5834 9.82496 14.5834 9.99996C14.5834 10.175 14.5668 10.3583 14.5418 10.6083L14.4251 11.55L15.1668 12.1333L16.0668 12.8333L15.4834 13.8416L14.4251 13.4166L13.5584 13.0666L12.8084 13.6333C12.4501 13.9 12.1084 14.1 11.7668 14.2416L10.8834 14.6L10.7501 15.5416L10.5834 16.6666H9.41678L9.25844 15.5416L9.12511 14.6L8.24178 14.2416C7.88344 14.0916 7.55011 13.9 7.21678 13.65L6.45844 13.0666L5.57511 13.425L4.51678 13.85L3.93344 12.8416L4.83344 12.1416L5.57511 11.5583L5.45844 10.6166C5.43344 10.3583 5.41678 10.1666 5.41678 9.99996C5.41678 9.83329 5.43344 9.64163 5.45844 9.39163L5.57511 8.44996L4.83344 7.86663L3.93344 7.16663L4.51678 6.15829L5.57511 6.58329L6.44178 6.93329L7.19178 6.36663C7.55011 6.09996 7.89178 5.89996 8.23344 5.75829L9.11678 5.39996L9.25011 4.45829L9.41678 3.33329H10.5751L10.7334 4.45829L10.8668 5.39996L11.7501 5.75829C12.1084 5.90829 12.4418 6.09996 12.7751 6.34996L13.5334 6.93329L14.4168 6.57496L15.4751 6.14996L16.0584 7.15829L15.1668 7.86663L14.4251 8.44996L14.5418 9.39163ZM10.0001 6.66663C8.15844 6.66663 6.66678 8.15829 6.66678 9.99996C6.66678 11.8416 8.15844 13.3333 10.0001 13.3333C11.8418 13.3333 13.3334 11.8416 13.3334 9.99996C13.3334 8.15829 11.8418 6.66663 10.0001 6.66663ZM10.0001 11.6666C9.08344 11.6666 8.33344 10.9166 8.33344 9.99996C8.33344 9.08329 9.08344 8.33329 10.0001 8.33329C10.9168 8.33329 11.6668 9.08329 11.6668 9.99996C11.6668 10.9166 10.9168 11.6666 10.0001 11.6666Z" />
            </svg>
            <More
              items={[
                <Link
                  to="/login/password"
                  key={uuid()}
                  className="cursor-pointer flex items-center h-36
                  pl-1-dot-6 hover:bg-blue-100 transition whitespace-nowrap text-button text-gray-900 hover:text-gray-600"
                >
                  重置密码
                </Link>,
                <form key={uuid()} action="/logout" method="post" className="w-full h-full">
                  <button
                    type="submit"
                    className="cursor-pointer flex items-center h-36 px-1-dot-6
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

      <div
        className="w-screen h-screen z-20 top-64 bg-black bg-opacity-50 fixed hidden
      transition duration-200"
        ref={maskRef}
      >
        <div
          className={classnames(
            '-left-full transform px-40 max-w-full w-58-dot-8 absolute bottom-0 top-0 flex flex-col',
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
              className="flex-col mt-14-dot-4"
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
                          'p-dot-3-6 rounded-lg rounded-tr-none w-48',
                          'h-48 icon-border-radius flex items-center justify-center',
                          iconClassName,
                        )}
                      >
                        <img className="w-32 h-32" src={iconUrl} alt={title} />
                      </div>
                    }
                    titleClassName="text-20 font-semibold"
                    descClassName="text-697886"
                  />
                  <Link to={address}>
                    <Icon className="next transition-all duration-200" name="next" type="dark" />
                  </Link>
                </div>
              ))}
            />
          </div>
          <div
            className={classnames(
              'h-32 self-start cursor-pointer mt-20 flex flex-between',
              'items-center button-border-radius rounded-tr-none px-1-dot-6 py-1',
              useCss({
                border: '1.5px solid #475569',
              }),
            )}
          >
            <Icon className="mr-4" name="close" type="dark" size={20} />
            <span className="text-1-dot-4" onClick={toggle}>离开当前页面</span>
          </div>
        </div>
      </div>
    </>
  );
}

