import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Node } from '@one-for-all/artery';
import cs from 'classnames';
import { isArray } from 'lodash';

import OutlineNodeHeader from './outline-node-header';
import { filterChildren, getRealNode } from '../utils';
import { useOutLineContext } from './context';

interface Props {
  node: Node;
}

export default function OutlineNode({ node }: Props): JSX.Element {
  const { components, modifiedNodeName } = useOutLineContext() || {};
  const [expand, setExpand] = useState(true);

  const nodeBodyRef = useRef<HTMLDivElement>(null);

  const { nodeName, children, id, realNode } = useMemo(() => {
    const realNode = getRealNode(node);
    if (!realNode) return {};

    if (isArray(realNode)) {
      return { children: filterChildren(realNode) };
    }

    if (realNode.type === 'html-element') {
      return {
        nodeName: realNode.label || realNode.name,
        children: filterChildren(realNode.children),
        id: realNode.id,
        realNode,
      };
    }

    if (realNode.type === 'react-component') {
      return {
        nodeName: realNode.label || realNode.exportName,
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

  function handleModifiedNodeName(nodeName: string): void {
    modifiedNodeName?.(node, nodeName);
  }

  if (!nodeName && !id && children?.length) {
    return (
      <>
        {children.map((childNode) => (
          <OutlineNode
            key={childNode.id}
            node={childNode}
          />
        ))}
      </>
    );
  }

  if (!nodeName || !id) return <></>;

  return (
    <div className="w-full">
      <OutlineNodeHeader
        id={id}
        nodeName={nodeName}
        hasChildren={!!children?.length}
        expand={expand}
        node={realNode}
        ComponentIcon={Icon}
        onChangeExpand={setExpand}
        onModifiedNodeName={handleModifiedNodeName}
      />
      {!!children?.length && (
        <div
          ref={nodeBodyRef}
          style={{ transition: 'all .2s linear' }}
          className={cs('overflow-y-hidden pl-12 ml-12 border-l-1', expand && 'is-expand')}
        >
          {children.map((childNode) => (
            <OutlineNode
              key={childNode.id}
              node={childNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
