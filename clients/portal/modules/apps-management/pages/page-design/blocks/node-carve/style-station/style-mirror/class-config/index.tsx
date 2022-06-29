import React, { useContext, useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { BasePropSpec } from '@one-for-all/node-carve';

import FountainContext from '@portal/modules/apps-management/pages/page-design/fountain-context';

import store from '../store';
import ClassStation from '../../class-station';
import { useConfigContext } from '../../../context';
import { updateNodeProperty } from '../../../utils';
import CollapsePanel from '../components/collapse-panel';
import { CONTENT_CLASS_NAME, TITLE_CLASS_NAME } from '../constant';
import SubTitle from '../components/style-sub-title';
import { useStyleData } from './hooks';

const DEFAULT_CLASS_NAME_TYPE: LabelValue = {
  label: 'ClassName',
  value: 'className',
};

function ClassConfig(): JSX.Element {
  const [isLoading, classNameData] = useStyleData();
  const { artery, rawActiveNode, onArteryChange, activeNode } = useConfigContext() ?? {};
  const { getNodePropsSpec } = useContext(FountainContext);
  const classSpec = useMemo(() => {
    if (!activeNode || (activeNode.type !== 'react-component' && activeNode.type !== 'html-element')) {
      return;
    }

    const specs: BasePropSpec[] = getNodePropsSpec(activeNode)?.props || [];
    if (store.styleType === 'style') {
      return [DEFAULT_CLASS_NAME_TYPE];
    }
    if (store.styleType === 'itemStyle') {
      const classSpecs = specs.filter((item) => item.will === 'ClassName').map((item) => ({
        label: item.label,
        value: item.name,
      }));
      return [{ label: 'item 样式设置', value: 'itemClassName' }, ...classSpecs];
    }

    return [];
  }, [activeNode, store.styleType]);

  function handleClassNameChange(newClassName: string, key: string): void {
    if (rawActiveNode && artery) {
      const newArtery = updateNodeProperty(
        rawActiveNode,
        `props.${key}`,
        { type: 'constant_property', value: newClassName },
        artery,
      );
      onArteryChange?.(newArtery);
    }
  }

  useEffect(() => {
    store.setStyleType('style');
  }, [activeNode]);

  return (
    <CollapsePanel
      defaultCollapse={false}
      titleClassName={TITLE_CLASS_NAME}
      contentClassName={CONTENT_CLASS_NAME}
      title="ClassName设置"
    >
      {
        isLoading ? (<div>正在获取ClassName...</div>) : (
          <>
            {classSpec?.map(({ label, value }) => {
              return (
                <>
                  <SubTitle title={`${label}设置`} />
                  <ClassStation
                    classNameData={classNameData}
                    defaultClassName={get(rawActiveNode, `props.${value}.value`, '')}
                    onChange={(newClassName) => handleClassNameChange(newClassName, value)}
                  />
                </>

              );
            })}
          </>
        )
      }
    </CollapsePanel>
  );
}
export default ClassConfig;
