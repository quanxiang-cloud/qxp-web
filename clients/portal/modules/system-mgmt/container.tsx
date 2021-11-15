import React from 'react';
import cs from 'classnames';
import { NavLink, useHistory } from 'react-router-dom';

import Icon from '@c/icon';

import InfoCard from './info-card';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  children: React.ReactNode;
  hideInfoCard?: boolean;
  asModalPage?: boolean; // 类似modal的页面
  pageName?: string;
  style?: React.CSSProperties;
}

const Container = ({
  className,
  children,
  hideInfoCard,
  asModalPage,
  pageName,
  style,
}: Props): JSX.Element => {
  const history = useHistory();
  const goBack = ()=> {
    history.goBack();
  };

  const renderBreadcrumb = ()=> {
    // todo
    return (
      <div className={cs('flex items-center', styles.breadcrumb)}>
        <Icon name='reply' size={20} onClick={goBack}/>
        <NavLink to='/system'>系统管理</NavLink>
        <span className={styles.divider}>/</span>
        <NavLink to='/system/message'>消息管理</NavLink>
        <span className={styles.divider}>/</span>
        <span className={styles.current}>{pageName}</span>
      </div>
    );
  };

  return (
    <div
      className={cs('app-entry-container main-content', className)}
      style={style}
    >
      {!hideInfoCard && <InfoCard/>}
      {
        asModalPage ? (
          <>
            {renderBreadcrumb()}
            {children}
          </>
        ) : (
          <div className="app-right-box">
            {children}
          </div>
        )
      }
    </div>
  );
};

export default Container;
