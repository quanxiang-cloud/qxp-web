import React from 'react';
import { createPortal } from 'react-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

import Icon from '@c/icon';
import Button from '@c/button';

interface Props {
  title?: string | React.ReactNode;
  closable?: boolean;
  fullscreen?: boolean;
  width?: number | string;
  height?: number | string;
  toolbar?: React.ReactNode | null;
  footer?: React.ReactNode | null;
  hideFooter?: boolean;
  visible?: boolean;
  okText?: string;
  cancelText?: string;
  className?: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

interface State {
  visible?: boolean;
}

const GlobalStyle = createGlobalStyle<{ visible?: boolean }>`
  body {
    overflow-y: ${(props) => props.visible ? 'hidden' : 'auto'};
  }
`;

export default class Modal extends React.PureComponent<Props, State> {
  element = window.document.createElement('div');
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
    window.document.body.append(this.element);
  }

  static getDerivedStateFromError(props: Partial<Props>) {
    return { visible: props.visible };
  }

  componentWillUnmount() {
    if (this.element) {
      window.document.body.removeChild(this.element);
    }
  }

  handleClose = (ev: unknown): void => {
    this.setState({ visible: false });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    const { visible, fullscreen, className, title, children, width = '632px',
      height = 'auto', toolbar, footer, hideFooter, okText, cancelText, onClose,
      onConfirm, closable = true } = this.props;

    return createPortal(
      <Wrap className={className} visible={visible}>
        <GlobalStyle visible={visible} />
        <Mask />
        <Inner width={width} height={height} fullscreen={fullscreen}>
          <Header>
            <div className='md-header-left'>
              <div className='md-title'>{title}</div>
              <div className='md-toolbar'>{toolbar}</div>
            </div>
            <div className='md-header-right' onClick={this.handleClose}>
              {closable && <Icon name='close' size={24} clickable />}
            </div>
          </Header>
          <Body className='md-body' fullscreen={fullscreen}>
            {children}
          </Body>
          {/* eslint-disable-next-line no-nested-ternary */}
          {hideFooter ? null : footer ? footer : (
            <Footer>
              <FooterInner>
                <div className="flex items-center">
                  <Button iconName="close" className="mr-20" onClick={onClose}>
                    {okText ? okText : '取消'}
                  </Button>
                  <Button modifier="primary" iconName="check" onClick={onConfirm}>
                    {cancelText ? cancelText : '确定'}
                  </Button>
                </div>
              </FooterInner>
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
  // 0% {
  //   transform: translate3d(0, -20px, 0);
  //   opacity: 0;
  // }
  // 100% {
  //   transform: translate3d(0, 0, 0);
  //   opacity: 1;
  // }
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

const Wrap = styled.div<{ visible?: boolean }>`
  position: fixed;
  width: 100vw;
  height: 100vh;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  align-items: center;
  display: ${(props) => props.visible ? 'flex' : 'none'};
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
