import { update } from 'lodash';
import React, {
  useState, useEffect, createContext, useMemo, JSXElementConstructor, useContext,
} from 'react';
import {
  SchemaForm, createFormActions, FormEffectHooks, ISchemaFormActions, ISchemaFieldComponentProps,
} from '@formily/antd';
import {
  Input as input, Select as select, Switch, ArrayTable, NumberPicker, DatePicker,
} from '@formily/antd-components';

import Button from '@c/button';

import { StoreContext } from '../../context';
import formTableFields from './form-table-fields';
import configSchema from './config-schema';
import switcher from './switcher';
import columns from './columns';
import subordination from './subordination';
import formTableSelectorWrapper from './form-table-selector-wrapper';
import { SubTableConfig } from './convertor';
import sInput from './components/input';
import sTextarea from './components/textarea';
import sNumber from './components/number';
import sDatePicker from './components/datetime';
import sSelect from './components/select';
import sMultipleSelect from './components/multiple-select';
import { addOperate } from '../operates';
import { FieldConfigContext } from '../../form-settings-panel/form-field-config/context';
import DefaultValueLinkageConfigBtn
  from '../../form-settings-panel/form-field-config/default-value-linkage-config-btn';

export const ActionsContext = FieldConfigContext;
export const ItemActionsContext = createContext<ISchemaFormActions>(createFormActions());

type State = {
  currentFieldKey: string;
}

interface Props {
  onChange: (value: any) => void;
  initialValue: SubTableConfig;
}

const { onFieldValueChange$ } = FormEffectHooks;

export default function ConfigForm({ onChange, initialValue }: Props) {
  const [state, setState] = useState<State>({ currentFieldKey: '' });
  const itemActions = useMemo(() => createFormActions(), []);
  const { appID } = useContext(StoreContext);
  const { actions } = useContext(ActionsContext);

  useEffect(() => {
    actions.getFieldState('Fields.linkedTable', (state) => {
      actions.setFieldState('Fields.linkedTable', (st) => {
        st.value = Object.assign(state.value || {}, { appID });
      });
    });
  }, [appID]);

  const components: Record<string, JSXElementConstructor<ISchemaFieldComponentProps>> = {
    switcher, textarea: input.TextArea, subordination, input,
    select, formTableFields, formtableselectorwrapper: formTableSelectorWrapper, switch: Switch,
    arraytable: ArrayTable, addoperate: addOperate, columns,
    numberpicker: NumberPicker, datepicker: DatePicker,
    defaultvaluelinkageconfigbtn: DefaultValueLinkageConfigBtn,
  };

  const componentsForSubTable: Record<
    string, Omit<FormBuilder.SourceElement<any>, 'displayOrder'>
  > = {
    ...components,
    input: sInput,
    textarea: sTextarea,
    numberpicker: sNumber,
    datepicker: sDatePicker,
    select: sSelect,
    multipleselect: sMultipleSelect,
  };

  function onFieldConfigValueChange(value: any) {
    const { items } = initialValue;
    update(items, `properties.${state.currentFieldKey}`, (schema) => ({
      ...schema,
      ...componentsForSubTable[currentSchemaType]?.toSchema(value),
    }));
    onChange({ ...initialValue, items });
    actions.setFieldState('Fields.items', (state) => state.value = items);
  }

  function onGoBack() {
    actions.setFieldState('Fields.curConfigSubTableKey', (state) => {
      state.value = '';
    });
  }

  function effects() {
    onFieldValueChange$('Fields.curConfigSubTableKey').subscribe(({ value }) => {
      setState({ currentFieldKey: value });
    });
    onFieldValueChange$('Fields.items').subscribe(({ value }) => {
      actions.setFieldState('Fields.columns', (state) => {
        state.value = Object.entries((value as ISchema)?.properties || {}).map(([
          key, schema,
        ]) => {
          return { title: schema.title, dataIndex: key };
        });
      });
    });
  }

  const currentSubSchema = initialValue.items?.properties?.[state.currentFieldKey];
  const currentSchemaType = currentSubSchema?.['x-component']?.toLowerCase() as string;
  const currentSubSchemaDefault = componentsForSubTable[currentSchemaType]?.configSchema;
  const currentSubSchemaConfig = componentsForSubTable[currentSchemaType]?.defaultConfig;

  return (
    <>
      <ActionsContext.Provider value={{ actions }}>
        <SchemaForm
          initialValues={initialValue}
          components={components}
          onChange={onChange}
          schema={configSchema}
          actions={actions}
          hidden={!!currentSubSchema}
          effects={effects}
        />
      </ActionsContext.Provider>
      {currentSubSchema && (
        <ItemActionsContext.Provider value={itemActions}>
          <div className="flex flex-row items-center mb-10">
            <Button className="mr-10" onClick={onGoBack}>返回</Button>
            <p>子表单</p>
          </div>
          <SchemaForm
            initialValues={currentSubSchemaConfig}
            components={components}
            onChange={onFieldConfigValueChange}
            schema={currentSubSchemaDefault}
            actions={itemActions}
          />
        </ItemActionsContext.Provider>
      )}
    </>
  );
}
