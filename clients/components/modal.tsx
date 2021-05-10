import React from 'react';
import { createPortal } from 'react-dom';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';

import Icon from '@c/icon';
import Button from '@c/button';

interface Props {
  title?: string | React.ReactNode;
  fullscreen?: boolean;
  width?: number | string;
  height?: number | string;
  footer?: React.ReactNode | null;
  okText?: string;
  cancelText?: string;
  className?: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

const GlobalStyle = createGlobalStyle`
  body {
    overflow-y: hidden;
  }
`;

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

  renderFooter() {
    const { footer, onClose, onConfirm, okText = '确定', cancelText = '取消' } = this.props;
    if (footer === null) {
      return null;
    }

    return (
      <Footer>
        {footer ? footer : (
          <>
            <Button
              className="bg-white hover:bg-gray-100 transition cursor-pointer mr-20 mb-0"
              iconName="close"
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              className="bg-gray-700 hover:bg-gray-900 transition cursor-pointer mb-0"
              modifier="primary"
              iconName="done"
              onClick={onConfirm}
            >
              {okText}
            </Button>
          </>
        )}
      </Footer>
    );
  }

  render() {
    const {
      fullscreen,
      className,
      title,
      children,
      width = '632px',
      height = 'auto',
      onClose,
    } = this.props;

    return createPortal(
      <Wrap className={className}>
        <GlobalStyle />
        <Mask />
        <InnerWrap width={width} height={height} fullscreen={fullscreen}>
          <Header>
            <div className='md-header-left'>
              <div className='md-title'>{title}</div>
            </div>
            <div className='md-header-right'>
              <Icon name='close' size={24} clickable onClick={onClose} />
            </div>
          </Header>
          <Body className='md-body' fullscreen={fullscreen}>
            {children}
          </Body>
          {this.renderFooter()}
        </InnerWrap>
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
  background: white;
  background-image: url(/dist/images/md-header-bg.jpg);
  background-position: top right;
  background-size: contain;
  background-repeat: no-repeat;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;

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
  overflow: auto;
  ${({ fullscreen }) => fullscreen ? css`
      height: calc(100vh - 56px);
    ` : css`
      padding: 24px 40px;
      height: 100%;
    `}
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
type InnerWrapPrapProps = {
  width: number | string,
   height: number | string,
   fullscreen?: boolean
}
const InnerWrap = styled.div<InnerWrapPrapProps>`
  display: flex;
  flex-direction: column;
  width: ${(props) => typeof props.width === 'number' ? props.width + 'px' : props.width};
  height: ${(props) => typeof props.height === 'number' ? props.height + 'px' : props.height};
  background: white;
  ${({ fullscreen }) => fullscreen ? css`
    width: 100vw;
    height: 100vh;
    position: relative;
    top: 56px;
  ` : css`
    margin: auto;  // FFC auto box
    max-width: calc(100vw - 42px);
    max-height: calc(100vh - 42px);
  `};
  z-index: 14;
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
  z-index: 13;
  box-shadow: inset 0px -1px 0px #E2E8F0;

  ${Mask} {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;
