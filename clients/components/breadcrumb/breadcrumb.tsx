import React, { cloneElement, PropsWithChildren } from 'react';
import cs from 'classnames';
import BreadcrumbItem from './breadcrumb-item';
import { Link } from 'react-router-dom';

interface Segment {
  key: string;
  text: string;
  path?: string;
  render?: (segment: Segment) => React.ReactNode;
}

type Props = PropsWithChildren<{
  segments?: Array<Segment>;
  separator?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  segmentRender?: (segment: Segment) => React.ReactNode;
}>;

function Breadcrumb({
  separator = '/',
  children,
  className,
  style,
  segments,
  segmentRender,
}: Props): JSX.Element {
  const defaultCrumbRender = React.Children.map(children, (child, idx) => {
    if (!child) {
      return child;
    }

    return cloneElement(child as React.ReactElement, {
      separator,
      key: idx,
    });
  });

  // Breadcrumb Children Render function :
  // if have segments array ,and segmentRender function should be return a custom render
  // else return link with a tag,
  // as segments come in , the children inside <Breadcrumb>  won't be rendered
  // without segments , must need the BreadCrumbItem inside the Breadcrumb ,follow the lego-ui
  const breadcrumbChildrenRender = (): JSX.Element[] | null | undefined | Record<string, unknown>[]=> {
    if (segments) {
      if (segmentRender) {
        return segments.map((link) => (
          <div
            key={link.key}
            className={cs(className, 'qxp-breadcrumb-item')}
          >
            {segmentRender(link)}
            <span className="qxp-breadcrumb-separator">{separator}</span>
          </div>
        ),
        );
      }

      return segments.map((link, index) => {
        const isLast = index === segments.length - 1;

        if (isLast) {
          return (
            <div key={link.key} className={cs(className, 'qxp-breadcrumb-item')}>
              <span>{link.text}</span>
            </div>
          );
        }

        return (
          <div key={link.key} className={cs(className, 'qxp-breadcrumb-item')}>
            {
              // eslint-disable-next-line no-nested-ternary
              link.render ? link.render(link) : (
                !link.path ? link.text : (
                  <Link to={link.path} className={cs(className, 'qxp-breadcrumb-link')}>
                    {link.text}
                  </Link>
                )
              )
            }
            <span className="qxp-breadcrumb-separator">{separator}</span>
          </div>
        );
      });
    }
    return (defaultCrumbRender);
  };

  return (
    <div className={cs('qxp-breadcrumb', className)} style={style}>
      {breadcrumbChildrenRender()}
    </div>
  );
}

Breadcrumb.Item = BreadcrumbItem;

export default Breadcrumb;
