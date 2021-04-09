import omit from 'lodash/omit';
import { createTooltipLabel } from './utils';
/**
 * convert form-builder data structure to formily structure
 * @param data object { schema: array, linkages: object }
 * @param setDefault if set defaultValue
 * @returns {{}}
 */
function converter(data = {}, setDefault = true, formAttrs = {}) {
  const { schema, linkages = {} } = data;
  if (!schema || !Array.isArray(schema)) {
    return {};
  }

  const formSchema = {};
  schema.forEach((item, index) => {
    const { id, props = {}, children } = item;
    const component = item.component === 'MegaLayout' ? 'mega-layout' : item.component;
    const {
      name,
      label,
      required,
      help,
      dataType,
      options,
      layoutMode,
      span,
      ...restProps
    } = props;
    let { initialValue } = props;
    const titleEl =
      formAttrs.helpInLabel && label && help ? createTooltipLabel(label, help) : label;
    const description = !formAttrs.helpInLabel && help ? help : null;
    const formKey = name || id;
    formSchema[formKey] = {
      key: id,
      type: 'string',
      name,
      title: titleEl,
      required,
      description,
      'x-component': component,
      'x-component-props': omit(props, 'initialValue', 'value', 'layoutMode', 'span'),
      'x-index': index,
    };

    // special case: handle enum formItem.
    if (restProps.optionType === 'static' && options) {
      const defaultValue = [];
      options.forEach(option => {
        if (option.checked) defaultValue.push(option.value);
      });
      if (defaultValue.length) {
        if (props.mode === 'multiple' || props.multiple || component === 'Checkbox') {
          initialValue = defaultValue;
        } else {
          [initialValue] = defaultValue;
        }
      }
    }

    // for TimePicker
    if (restProps.rangePicker && component === 'TimePicker') {
      formSchema[formKey]['x-component'] = 'TimeRangePicker';
    }

    // for megaLayout
    if (layoutMode === 'inline') {
      formSchema[formKey]['x-component-props'].inline = true;
    } else if (layoutMode === 'grid') {
      formSchema[formKey]['x-component-props'].grid = true;
    }
    if (span) {
      formSchema[formKey]['x-mega-props'] = { span };
    }

    // set default value
    if (setDefault) {
      formSchema[formKey].default = initialValue;
    }
    // set linkage
    if (linkages && linkages[formKey]) {
      formSchema[formKey]['x-linkages'] = linkages[formKey];
    }

    if (Array.isArray(children)) {
      const childrenSchema = { schema: children };
      if (component === 'ArrayTable') {
        if (props.arrayListMode === 'card') {
          formSchema[formKey]['x-component'] = 'ArrayCards';
        }
        formSchema[formKey]['x-component-props'] = restProps;
        formSchema[formKey].items = {
          type: 'object',
          properties: converter(childrenSchema, setDefault),
        };
      } else {
        formSchema[formKey].type = 'object';
        formSchema[formKey].properties = converter(childrenSchema, setDefault);
      }
    }
  });

  return formSchema;
}

export default converter;
