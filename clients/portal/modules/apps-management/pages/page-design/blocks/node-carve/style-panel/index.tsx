import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import cs from 'classnames';

import LayoutConfig from './layout-config';
import PositionConfig from './position-config';
import DisplayConfig from './display-config';
import BackgroundConfig from './background-config';
import FontConfig from './font-config';
import BorderConfig from './border-config';
import ShadowConfig from './shadow-config';
import Section from '../../../utils/section';
import { parseStyleToForm, formatStyles } from '../../../utils/config';

import styles from './index.m.scss';
import { useConfigContext } from '../context';
import { updateNodeProperty } from '../utils';
import { get } from 'lodash';
interface Props {
  className?: string;
}

function StylePanel({ className }: Props): JSX.Element {
  const { register, getValues, setValue, reset } = useForm();
  const [values, setValues] = useState<any>({});

  const { artery, rawActiveNode, onArteryChange } = useConfigContext() ?? {};

  useEffect(() => {
    if (rawActiveNode) {
      setValues(getCurStyle());
      reset(getCurStyle());
    }
  }, [rawActiveNode?.id]);

  function getCurStyle(): React.CSSProperties {
    if (rawActiveNode) {
      const defaultStyles = get(rawActiveNode, 'props.style.value', {});
      const newStyles = parseStyleToForm(defaultStyles);
      return newStyles;
    }

    return {};
  }

  if (!rawActiveNode) {
    return (
      <div className='flex justify-center items-center flex-col h-full'>
        <p>当前层级没有内容</p>
        <p>请在左侧画布选中其他元素</p>
      </div>
    );
  }

  function handleFormChange(): void {
    const _values = getValues();
    setValues(_values);
    const newValues = formatStyles(_values);
    if (rawActiveNode && artery) {
      const newArtery = updateNodeProperty(
        rawActiveNode,
        'props.style',
        { type: 'constant_property', value: newValues },
        artery,
      );
      onArteryChange?.(newArtery);
    }
  }

  return (
    <div className={cs(styles.stylePanel, className)}>
      <form onChange={handleFormChange}>
        <Section title='画布' defaultExpand>
          <LayoutConfig initValues={values} register={register} setValue={setValue} />
        </Section>
        <Section title='显示布局' defaultExpand>
          <DisplayConfig initValues={values} register={register} setValue={setValue} />
        </Section>
        <Section title='定位' defaultExpand>
          <PositionConfig initValues={values} register={register} setValue={setValue} />
        </Section>
        <Section title='字体' defaultExpand>
          <FontConfig
            initValues={values}
            register={register}
            setValue={setValue}
            onFormChange={handleFormChange}
          />
        </Section>
        <Section title='背景' defaultExpand>
          <BackgroundConfig
            initValues={values}
            register={register}
            setValue={setValue}
            onFormChange={handleFormChange}
          />
        </Section>
        <Section title='边框' defaultExpand>
          <BorderConfig
            initValues={values}
            register={register}
            setValue={setValue}
            onFormChange={handleFormChange}
          />
        </Section>
        <Section title='阴影' defaultExpand>
          <ShadowConfig
            initValues={values}
            register={register}
            setValue={setValue}
            onFormChange={handleFormChange}
          />
        </Section>
      </form>
    </div>
  );
}

export default StylePanel;
