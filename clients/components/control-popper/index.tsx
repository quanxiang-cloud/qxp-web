import React from 'react';
import ReactDOM from 'react-dom';
import { createPopper, Instance, Placement, Modifier } from '@popperjs/core';

export type TriggerMethod = 'click' | 'hover' | 'focus' | 'forever';

type Theme = 'light' | 'dark';

type Props = {
  reference: React.RefObject<Element>;
  children: React.ReactNode;
  visible: boolean;
  onVisibilityChange?: (visible: boolean) => void;
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

    const { theme = 'light' } = props;

    this.popperContainer.classList.add('popper-container', `popper-container--${theme}`);

    if (props.enableArrow) {
      const arrowEle = document.createElement('div');
      arrowEle.setAttribute('data-popper-arrow', '');
      this.popperContainer.append(arrowEle);
    }
  }

  componentDidMount(): void {
    this.createPopperInstance();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.visible !== this.props.visible) {
      this.createPopperInstance();
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

  // close popper when click outside of target or popper content
  // onDocumentClick = (e: MouseEvent): boolean => {
  //   if (!this.props.reference.current ||
  //     this.popperContainer.contains(e.target as Node) ||
  //     this.props.reference.current.contains(e.target as Node) ||
  //     this.props.reference.current === e.target) {
  //     return true;
  //   }

  //   this.close();

  //   return true;
  // }

  cleanUp(): void {
    this.instance?.destroy();
    this.popperContainer.remove();
  }

  render(): React.ReactPortal | null {
    if (!this.props.reference.current || !this.props.visible) {
      // this.cleanUp();
      return null;
    }

    this.appendContainer();

    return ReactDOM.createPortal(
      this.props.children,
      this.popperContainer,
    );
  }
}
