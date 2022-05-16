import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Node } from '@one-for-all/artery';
import type { PackageComponent } from '@pageDesign/blocks/fountainhead/type';
import cs from 'classnames';
import { isArray } from 'lodash';

import TreeNodeHeader from './tree-node-header';
import { filterChildren, getRealNode } from '../utils';

interface Props {
  node: Node;
  components?: PackageComponent[];
}

export default function TreeNode({
  node,
  components,
}: Props): JSX.Element {
  const [expand, setExpand] = useState(true);

  const nodeBodyRef = useRef<HTMLDivElement>(null);

  const { title, children, id, realNode } = useMemo(() => {
    const realNode = getRealNode(node);
    if (!realNode) return {};

    if (isArray(realNode)) {
      return { children: filterChildren(realNode) };
    }

    if (realNode.type === 'html-element') {
      return {
        title: realNode.name,
        children: filterChildren(realNode.children),
        id: realNode.id,
        realNode,
      };
    }

    if (realNode.type === 'react-component') {
      return {
        title: realNode.exportName,
        children: filterChildren(realNode.children),
        id: realNode.id,
        realNode,
      };
    }

    return {};
  }, [node]);

  const Icon = useMemo(() => {
    const realNode = getRealNode(node);
    if (!realNode || isArray(realNode)) return;

    if (realNode.type === 'html-element') {
      return components?.find((component) => component.name === realNode.name)?.Icon;
    }

    if (realNode.type === 'react-component') {
      return components?.find((component) => component.name === realNode.exportName)?.Icon;
    }
  }, [node, components]);

  useEffect(() => {
    const { current } = nodeBodyRef;
    if (!current) return;
    if (expand) {
      current.style.height = `${current.scrollHeight}px`;
      setTimeout(() => {
        current.style.height = 'auto';
      }, 200);
    } else {
      current.style.height = `${current.scrollHeight}px`;
      requestAnimationFrame(() => {
        current.style.height = '0';
      });
    }
  }, [expand, children?.length]);

  if (!title && !id && children?.length) {
    return (
      <>
        {children.map((childNode) => (
          <TreeNode
            key={childNode.id}
            node={childNode}
            components={components}
          />
        ))}
      </>
    );
  }

  if (!title || !id) return <></>;

  return (
    <div className="w-full">
      <TreeNodeHeader
        id={id}
        title={title}
        hasChildren={!!children?.length}
        expand={expand}
        node={realNode}
        ComponentIcon={Icon}
        onChangeExpand={setExpand}
      />
      {!!children?.length && (
        <div
          ref={nodeBodyRef}
          style={{ transition: 'all .2s linear' }}
          className={cs('overflow-y-hidden pl-8 ml-8 border-l-1', expand && 'is-expand')}
        >
          {children.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              components={components}
            />
          ))}
        </div>
      )}
    </div>
  );
}
