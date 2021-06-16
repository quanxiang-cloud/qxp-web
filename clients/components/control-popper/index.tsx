import React from 'react';
import ReactDOM from 'react-dom';
import { createPopper, Instance, Placement, Modifier } from '@popperjs/core';

type Theme = 'light' | 'dark';

type Props = {
  reference: React.RefObject<Element>;
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  enableArrow?: boolean;
  placement?: Placement;
  modifiers?: Array<Partial<Modifier<any, any>>>;
  theme?: Theme;
}

const arrowModifier = {
  name: 'arrow',
  options: {
    element: '[data-popper-arrow]',
  },
};

export default class ControlPopper extends React.Component<Props> {
  popperContainer: HTMLElement = document.createElement('div');
  instance: Instance | null = null;
  delayTimer: number | null = null;

  constructor(props: Props) {
    super(props);

    const { theme = 'light', visible } = props;

    this.popperContainer.classList.add(
      'popper-container',
      `popper-container--${theme}`,
      visible ? '' : 'hidden',
    );

    if (props.enableArrow) {
      const arrowEle = document.createElement('div');
      arrowEle.setAttribute('data-popper-arrow', '');
      this.popperContainer.append(arrowEle);
    }
  }

  componentDidMount(): void {
    this.createPopperInstance();
  }

  componentDidUpdate(preProps: Props): void {
    if (preProps.visible === this.props.visible) {
      return;
    }

    if (this.props.visible) {
      this.popperContainer.classList.remove('hidden');
    } else {
      this.popperContainer.classList.add('hidden');
    }
  }

  componentWillUnmount(): void {
    this.cleanUp();
  }

  createPopperInstance = (): void => {
    if (!this.props.reference.current) {
      return;
    }

    this.instance = createPopper(this.props.reference.current, this.popperContainer, {
      placement: this.props.placement || 'bottom',
      modifiers: (this.props.modifiers || []).concat(arrowModifier),
    });
  }

  appendContainer(): void {
    document.body.appendChild(this.popperContainer);
  }

  cleanUp(): void {
    this.instance?.destroy();
    this.popperContainer.remove();
  }

  render(): React.ReactPortal | null {
    if (!this.props.reference.current) {
      this.cleanUp();
      return null;
    }

    this.appendContainer();

    return ReactDOM.createPortal(
      this.props.children,
      this.popperContainer,
    );
  }
}
