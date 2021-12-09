import { Props } from '@m/qxp-ui-mobile';
import NavBar from '@m/qxp-ui-mobile/nav-bar';
import React from 'react';
import { useHistory } from 'react-router-dom';
import cs from 'classnames';

export interface NavPageProps extends Props {
  title: string;
  rightText?: React.ReactNode;
  onClickRight?: (e: React.MouseEvent) => void;
}

export default function NavPage(props: NavPageProps): JSX.Element {
  const history = useHistory();

  return (
    <div className='flex flex-col bg-white' style={{ height: '100vh' }}>
      <NavBar leftArrow safeAreaInsetTop
        rightText={props.rightText}
        title={props.title}
        onClickRight={props.onClickRight}
        onClickLeft={() => history.goBack()}/>
      <div className={cs('flex-1 overflow-scroll', props.className)}>
        {props.children}
      </div>
    </div>
  );
}
