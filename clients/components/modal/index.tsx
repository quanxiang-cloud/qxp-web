import React from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';

import Icon from '@c/icon';
import Button from '@c/button';

interface Props {
  title?: string | React.ReactNode;
  fullscreen?: boolean;
  width?: number | string;
  height?: number | string;
  footer?: React.ReactNode | null;
  footerBtns?: Array<any>;
  okText?: string;
  cancelText?: string;
  className?: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

export default class Modal extends React.PureComponent<Props> {
  element = document.createElement('div');
  constructor(props: Props) {
    super(props);
    document.body.append(this.element);
  }

  componentWillUnmount() {
    if (this.element) {
      document.body.removeChild(this.element);
    }
  }

  render() {
    const { fullscreen, className, title, children, width = '632px',
      height = 'auto', footer, footerBtns, okText, cancelText, onClose,
      onConfirm } = this.props;

    return createPortal(
      <Wrap className={className}>
        <Mask />
        <Inner width={width} height={height} fullscreen={fullscreen}>
          <Header>
            <div className='md-header-left'>
              <div className='md-title'>{title}</div>
            </div>
            <div className='md-header-right' onClick={onClose}>
              <Icon name='close' size={24} clickable />
            </div>
          </Header>
          <Body className='md-body' fullscreen={fullscreen}>
            {children}
          </Body>
          {footer ? footer : (
            <Footer>
              <div className="flex items-center">
                <Button iconName="close" className="mr-20" onClick={onClose}>
                  {okText ? okText : '取消'}
                </Button>
                <Button modifier="primary" iconName="check" onClick={onConfirm}>
                  {cancelText ? cancelText : '确定'}
                </Button>
              </div>
            </Footer>
          )}
        </Inner>
      </Wrap>,
      this.element
    );
  }
}

const Mask = styled.div`
  background: #0F172A;
  opacity: 0.65;
  backdrop-filter: blur(72px);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  height: 56px;
  min-height: 56px;
  border-bottom: 1px solid #E2E8F0;
  position: relative;
  &::after {
    content: '';
    background-image: url(/dist/images/md-header-bg.png);
    background-position: top right;
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.1;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    z-index: -1;
  }
  
  .md-header-left {
    display: flex;
    flex: 1;
    align-items: center;
    > .md-title {
      font-size: 1.6rem;
      font-weight: 600;
      line-height: 24px;
      color: #0F172A;
      margin-right: 16px;
    }
  }
  .md-header-right {
    justify-content: flex-end;
  }
`;

const Body = styled.div<{ fullscreen?: boolean }>`
 ${(props) => props.fullscreen ?
    'height: calc(100vh - 56px)' : 'padding: 24px 40px;height: 100%; max-height:600px;'};
`;

const Footer = styled.div`
  padding: 16px 20px;
  background-color: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

const FooterInner = styled.div`
  display: inline-block;
`;

const scaleAnimation = keyframes`
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const Inner = styled.div<{ width: any, height: any, fullscreen?: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${(props) => typeof props.width === 'number' ? props.width + 'px' : props.width};
  height: ${(props) => typeof props.height === 'number' ? props.height + 'px' : props.height};
  ${(props) => props.fullscreen && 'width: 100vw; height: 100vh;position: relative; top: 56px'};
  //@media (min-width: 1440px) {
  //  width: 1440px;
  //}
  background: white;
  z-index: 110;
  border-radius: 12px;
  animation: ${scaleAnimation} 0.3s;
`;

const Wrap = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  transition: opacity .1s;
  justify-content: center;
  overflow: hidden;
  z-index: 100;
  box-shadow: inset 0px -1px 0px #E2E8F0;

  ${Mask} {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;
