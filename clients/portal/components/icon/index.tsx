import * as React from 'react';
import classnames from 'classnames';

import svgSprite from '../../../assets/sprite/icons';
import domReady from './domReady';
import './_icon.scss';
import { IconName } from './types';

const prepend = (el: any, target: any) => {
  if (target.firstChild) {
    target.insertBefore(el, target.firstChild);
  } else {
    target.appendChild(el);
  }
};

const appendSvg = () => {
  const svgContainer = document.createElement('div');
  svgContainer.innerHTML = svgSprite;
  const svg = svgContainer.getElementsByTagName('svg')[0];
  if (svg) {
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.style.overflow = 'hidden';
    prepend(svg, document.body);
  }
};

if (!(window as any).svgicon_inject) {
  (window as any).svgicon_inject = true;
  domReady(appendSvg);
}

interface Icon extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  type?: 'dark' | 'coloured' | 'light';
  size?: number;
  color?: string;
  className?: any;
  disabled?: boolean;
  changeable?: boolean;
  clickable?: boolean;
}

interface Style {
  width?: string;
  height?: string;
  color?: string;
}

const Icon = (
  {
    name,
    size = 22,
    type = 'dark',
    changeable = false,
    disabled = false,
    clickable = false,
    className,
    color,
    ...props
  }: Icon,
  ref: React.Ref<SVGSVGElement>
) => {
  const styleCSS: Style = {
    width: size ? `${size - 1}px` : undefined,
    height: size ? `${size - 1}px` : undefined,
  };

  if (color) {
    styleCSS.color = color;
  }

  const _style: React.CSSProperties = styleCSS;

  return (
    <svg
      {...props}
      ref={props.ref}
      data-name={name}
      style={_style}
      className={classnames('svg-icon', `svg-icon--${type}`, className, {
        'svg-icon--changeable': changeable,
        'svg-icon--clickable': clickable,
        'svg-icon--disabled': disabled,
      })}
    >
      <use xlinkHref={`#${name}`} />
    </svg>
  );
};

const SvgIconRef = React.forwardRef(Icon);

const SvgIcon = SvgIconRef;

export default SvgIcon;
