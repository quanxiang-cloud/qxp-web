import React, { useContext, useMemo } from 'react';
import { get } from 'lodash';
import { BasePropSpec } from '@one-for-all/node-carve';

import FountainContext from '@portal/modules/apps-management/pages/page-design/fountain-context';

import store from '../store';
import ClassStation from '../../class-station';
import { useConfigContext } from '../../../context';
import { updateNodeProperty } from '../../../utils';
import CollapsePanel from '../components/collapse-panel';
import { CONTENT_CLASS_NAME, TITLE_CLASS_NAME } from '../constant';

function ClassConfig(): JSX.Element {
  const { artery, rawActiveNode, onArteryChange, activeNode } = useConfigContext() ?? {};
  const { getNodePropsSpec } = useContext(FountainContext);
  const classSpec = useMemo(() => {
    if (!activeNode || (activeNode.type !== 'react-component' && activeNode.type !== 'html-element')) {
      return;
    }

    const specs: BasePropSpec[] = getNodePropsSpec(activeNode)?.props || [];
    if (store.styleType === 'style') {
      return [{ name: 'className', label: 'ClassName', type: 'string ' }];
    }

    const classSpec = [{ name: 'itemClassName', label: 'ItemClassName', type: 'string' }];
    return classSpec.concat(specs.filter(({ will = '' }) => will === 'ClassName'));
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

  return (
    <>
      {classSpec?.map(({ name, label }) => {
        return (
          <CollapsePanel
            key={name}
            defaultCollapse={false}
            titleClassName={TITLE_CLASS_NAME}
            contentClassName={CONTENT_CLASS_NAME}
            title={`${label}设置`}
          >
            <ClassStation
              defaultClassName={get(rawActiveNode, `props.${name}.value`, '')}
              onChange={(newClassName) => handleClassNameChange(newClassName, name)}
            />
          </CollapsePanel>
        );
      })}
    </>
  );
}
export default ClassConfig;
