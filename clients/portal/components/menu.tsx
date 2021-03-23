import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import { Link, useHistory } from 'react-router-dom';
import { Icon } from '@QCFE/lego-ui';
import useCss from 'react-use/lib/useCss';

import { List } from '@portal/components/list2';
import { ItemWithTitleDesc } from '@portal/components/item-with-title-desc4';
import { isBool, isNull, uuid } from '@assets/lib/utils';
import { twCascade } from '@mariusmarais/tailwind-cascade';

interface IMenu {
  iconClassName: string;
  iconUrl: string;
  title: string;
  desc: string;
  address: string;
}

export interface IMenus {
  menus: IMenu[];
  visible: boolean | null;
  toggle: (show: boolean) => void;
}

export const Menu = ({ menus, visible, toggle }: IMenus) => {
  const maskRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const maskElement = (maskRef.current as unknown) as HTMLDivElement;
    maskElement.onclick = (e: MouseEvent) => {
      if (e.target == maskElement) {
        toggle(false);
      }
    };
    return () => {
      maskElement.onclick = null;
    };
  }, []);

  useEffect(() => {
    if (isNull(visible)) {
      return;
    }
    let timeId = 0;
    if (!isBool(visible) || !maskRef.current) {
      return;
    }
    const maskElement = (maskRef.current as unknown) as HTMLDivElement;
    if (visible) {
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
  }, [visible]);

  return (
    <div
      className="w-screen h-screen z-20 top-24 bg-black bg-opacity-50 fixed hidden
      transition duration-200"
      ref={maskRef}
    >
      <div
        className={classnames(
          '-left-full transform p-16 max-w-full w-58-dot-8 absolute bottom-0 top-0 flex flex-col',
          useCss({
            background: '#F0F6FF',
            opacity: 0.9,
            'backdrop-filter': 'blur(72px)',
          }),
          {
            'slide-in': visible && isBool(visible),
            'slide-out': !visible && isBool(visible),
          },
        )}
      >
        <div className="right-16">
          <img className="absolute top-16 right-16" src="/dist/images/menu-chatu.svg" alt="chatu" />
          <List
            className="flex-col mt-10-dot-4"
            itemClassName={classnames(
              'pb-8 transform transition-all duration-200',
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
                  toggle(false);
                  history.push(address);
                }}
                className={twCascade(
                  'h-32 flex flex-row justify-between items-center bg-white px-4 py-dot-8',
                  'rounded-2xl cursor-pointer transition-all duration-200',
                )}
              >
                <ItemWithTitleDesc
                  title={title}
                  desc={desc}
                  itemRender={
                    <div
                      className={classnames(
                        'p-dot-3-6 rounded-lg rounded-tr-none leading-4 w-4-dot-8',
                        'h-4-dot-8 flex-initial',
                        iconClassName,
                      )}
                    >
                      <img className="w-full h-full" src={iconUrl} alt={title} />
                    </div>
                  }
                  titleClassName="text-2 font-semibold"
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
            'self-start cursor-pointer mt-8 flex flex-between',
            'items-center rounded-lg rounded-tr-none px-1-dot-6 py-1',
            useCss({
              border: '1.5px solid #475569',
            }),
          )}
        >
          <Icon className="mr-dot-4" name="close" type="dark" size={20} />
          <span className="text-1-dot-4" onClick={() => toggle(false)}>离开当前页面</span>
        </div>
      </div>
    </div>
  );
};
