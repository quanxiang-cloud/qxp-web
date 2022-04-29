import React, { useEffect, useState } from 'react';

import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import { ArteryRenderer } from '@one-for-all/artery-renderer';
import repository from '../repository';
import { useConfigContext } from '../context';
import buildConfigArtery from '../utils/buildConfigNodes';
import { Artery, ReactComponentNode } from '@one-for-all/artery';
import Section from '../../../utils/section';
import usePropsSpec from '../mock';
import { PropsSpec } from '../type';

function getArteryBySpec(specs: PropsSpec[]): Artery | null {
  if (specs.length) {
    return buildConfigArtery(specs, 'props.');
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
    const specs = data[exportName];
    if (!specs || !specs.length) {
      setAttrArtery(null);
      setFunctionArtery(null);
      return;
    }

    const attrSpecs = getArteryBySpec(specs.filter((s) => s.type !== 'function'));
    const funcSpecs = getArteryBySpec(specs.filter((s) => s.type === 'function'));
    setAttrArtery(attrSpecs);
    setFunctionArtery(funcSpecs);
  }, [activeNode?.id, data]);

  if (!activeNode) {
    return <ErrorTips desc='当前层级没有内容, 请在左侧画布选中其他元素' />;
  }

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (isError) {
    return <ErrorTips desc="访问异常..." />;
  }

  if (!data || (!attrArtery && !functionArtery)) {
    return <ErrorTips desc="没有对应的配置表单" />;
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
