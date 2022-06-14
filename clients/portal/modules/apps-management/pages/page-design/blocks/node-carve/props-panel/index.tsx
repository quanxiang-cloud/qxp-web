import React, { useContext, useEffect, useState } from 'react';

import { Artery } from '@one-for-all/artery';
import { ArteryRenderer } from '@one-for-all/artery-renderer';
import { BasePropSpec } from '@one-for-all/node-carve';

import repository from '../repository';
import { useConfigContext } from '../context';
import buildNodeCarveArtery from '../buildNodeCarveArtery';
import Section from '../../../utils/section';
import FountainContext from '../../../fountain-context';

function getArteryBySpec(specs: BasePropSpec[], options: {
  prefix?: string;
  bindVariable?: boolean;
}): Artery | null {
  if (specs.length) {
    return buildNodeCarveArtery(specs, options);
  }
  return null;
}

function PropsPanel(): JSX.Element {
  const [attrArtery, setAttrArtery] = useState<Artery | null>(null);
  const [functionArtery, setFunctionArtery] = useState<Artery | null>(null);
  const { activeNode } = useConfigContext() ?? {};
  const { getNodePropsSpec } = useContext(FountainContext);

  useEffect(() => {
    if (!activeNode || (activeNode.type !== 'react-component' && activeNode.type !== 'html-element')) {
      setAttrArtery(null);
      setFunctionArtery(null);
      return;
    }
    const specs: BasePropSpec[] = getNodePropsSpec(activeNode)?.props || [];
    const attrSpecs = getArteryBySpec(specs.filter((s) => s.type !== 'function'), {
      prefix: 'props',
      bindVariable: true,
    });
    const funcSpecs = getArteryBySpec(specs.filter((s) => s.type === 'function'), {
      prefix: 'props',
    });
    setAttrArtery(attrSpecs);
    setFunctionArtery(funcSpecs);
  }, [activeNode?.id]);

  if (!attrArtery && !functionArtery) {
    return (
      <div className="flex justify-center items-center flex-col h-full">
        <p>没有对应的配置表单</p>
      </div>
    );
  }

  return (
    <>
      {attrArtery && (
        <Section title='属性' defaultExpand>
          <ArteryRenderer
            artery={attrArtery}
            plugins={{ repository }}
          />
        </Section>
      )}
      {functionArtery && (
        <Section title='事件' defaultExpand>
          <ArteryRenderer
            artery={functionArtery}
            plugins={{ repository }}
          />
        </Section>
      )}
    </>

  );
}

export default PropsPanel;
