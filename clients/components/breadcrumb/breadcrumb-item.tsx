import React, { cloneElement } from 'react';
import classnames from 'classnames';

interface Props {
    separator?: React.ReactNode
    children: string | JSX.Element
    style?: React.CSSProperties
    className?: string
}

export default function BreadcrumbItem({
    separator,
    children,
    className,
    style,
    ...restProps
}: Props) {

    const childrenRender = () => {
        if (typeof children === 'string') {
            return <span>{children}</span>
        } else {
            return (
                cloneElement(children, {
                    className: classnames(className, 'qxp-breadcrumb-link'),
                })
            );
        }
    }

    if (!children) {
        return null;
    }
    return (
        <li
            {...restProps}
            style={style}
            className={classnames(className, 'qxp-breadcrumb-item')}
        >
            {childrenRender()}
            <span className="qxp-breadcrumb-separator">{separator}</span>
        </li>
    );
}