import { Props } from '@m/qxp-ui-mobile';
import NavBar from '@m/qxp-ui-mobile/nav-bar';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import cs from 'classnames';

export interface NavPageProps extends Props {
  title: string;
  rightText?: React.ReactNode;
  onClickRight?: (e: React.MouseEvent) => void;
  absolute?: boolean;
}

export default function NavPage(props: NavPageProps): JSX.Element {
  const history = useHistory();

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return (
    <div className={
      `w-full flex flex-col bg-white ${props.absolute ? 'absolute top-0 left-0' : ''}`
    }
    style={{ height: '100vh', zIndex: 1 }}>
      <NavBar leftArrow safeAreaInsetTop
        rightText={props.rightText}
        title={props.title}
        onClickRight={props.onClickRight}
        onClickLeft={() => history.goBack()}/>
      <div style={props.style}
        className={cs('flex-1 overflow-scroll safe-area-bottom', props.className)}>
        {props.children}
      </div>
    </div>
  );
}
