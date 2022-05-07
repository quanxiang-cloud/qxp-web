import React, { useEffect, useState } from 'react';

import { Artery, ReactComponentNode } from '@one-for-all/artery';
import { ArteryRenderer } from '@one-for-all/artery-renderer';

import Loading from '@c/loading';

import repository from '../repository';
import { useConfigContext } from '../context';
import buildConfigArtery from '../utils/buildConfigNodes';
import Section from '../../../utils/section';
import usePropsSpec from '../hooks/usePropsSpec';
import { PropsSpec } from '../type';

function getArteryBySpec(specs: PropsSpec[], options: {
  prefix?: string;
  bindVarible?: boolean;
}): Artery | null {
  if (specs.length) {
    return buildConfigArtery(specs, options);
  }
  return null;
}

function NodeCarve(): JSX.Element {
  const [attrArtery, setAttrArtery] = useState<Artery | null>(null);
  const [functionArtery, setFunctionArtery] = useState<Artery | null>(null);
  const { activeNode } = useConfigContext() ?? {};
  const getSpecByPkg = usePropsSpec(activeNode);
  const { packageName, packageVersion, exportName } = activeNode as ReactComponentNode;

  const [isLoading, data, isError] = getSpecByPkg(packageName, packageVersion);

  useEffect(() => {
    if (!activeNode || !data) {
      return;
    }
    const specs = data[exportName.toLowerCase()];
    if (!specs || !specs.length) {
      setAttrArtery(null);
      setFunctionArtery(null);
      return;
    }

    const attrSpecs = getArteryBySpec(specs.filter((s) => s.type !== 'function'), {
      prefix: 'props',
      bindVarible: true,
    });
    const funcSpecs = getArteryBySpec(specs.filter((s) => s.type === 'function'), {
      prefix: 'props',
    });
    setAttrArtery(attrSpecs);
    setFunctionArtery(funcSpecs);
  }, [activeNode?.id, data]);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center flex-col h-full">
        <p>获取配置表单失败</p>
      </div>
    );
  }

  if (!data || (!attrArtery && !functionArtery)) {
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

export default NodeCarve;
