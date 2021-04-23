import React, { cloneElement, PropsWithChildren } from 'react';
import cs from 'classnames';
import BreadcrumbItem from './breadcrumb-item';

interface Segment {
  key: string;
  text: string;
  path?: string;
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
}: Props) {
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
  const breadcrumbChildrenRender = () => {
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
        )
        );
      } else {
        return segments.map((link, idx) => (
          <div key={link.key} className={cs(className, 'qxp-breadcrumb-item')}>
            { idx === segments.length - 1 ?
              (<span>
                {link.text}
              </span>) :
              (
                <a
                  href={link.path}
                  className={cs(className, 'qxp-breadcrumb-link')}
                >
                  {link.text}
                </a>
              )
            }
            <span className="qxp-breadcrumb-separator">{separator}</span>
          </div>
        ));
      }
    }
    return (defaultCrumbRender);
  };

  return (
    <div className={cs('qxp-breadcrumb', className)} style={style}>
      <div>{breadcrumbChildrenRender()}</div>
    </div>
  );
}

Breadcrumb.Item = BreadcrumbItem;

export default Breadcrumb;
