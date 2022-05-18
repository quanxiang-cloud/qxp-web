import React, { useEffect, useState } from 'react';

import { Artery, ReactComponentNode } from '@one-for-all/artery';
import { ArteryRenderer } from '@one-for-all/artery-renderer';
import { BasePropSpec } from '@one-for-all/node-carve';

import repository from '../repository';
import { useConfigContext } from '../context';
import buildNodeCarveArtery from '../buildNodeCarveArtery';
import Section from '../../../utils/section';

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
  const { activeNode, packagePropsSpec } = useConfigContext() ?? {};

  useEffect(() => {
    if (!activeNode || !packagePropsSpec) {
      setAttrArtery(null);
      setFunctionArtery(null);
      return;
    }
    const { exportName } = activeNode as ReactComponentNode;
    const specs: BasePropSpec[] = packagePropsSpec[exportName]?.props ?? [];
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
