import { Option } from './messy/enum'

export interface DefaultConfig {
    title: string;
    description?: string;
    displayModifier: FormBuilder.DisplayModifier;
    placeholder?: string;
    required: boolean;
    defaultValue: string | string[];
    optionalRange?: 'all' | 'customize';
    multiple?: 'signle' | 'multiple';
    rangeList: EmployeeOrDepartmentOfRole[];
    defaultValues: string | string[];
    enums?: Option[];
    loading?: boolean;
    onSearch?: (value: string) => string | void
}

export const defaultConfig: DefaultConfig = {
    title: '人员选择器',
    description: '',
    displayModifier: 'normal',
    placeholder: '',
    required: false,
    defaultValue: '',
    optionalRange: 'all',
    multiple: 'signle',
    rangeList: [],
    defaultValues: [],
    loading: false
}

export const toSchema = (config: DefaultConfig): FormBuilder.Schema => {
    console.log('toSchema_', config, config.defaultValues)

    return Object.assign(config, {
        type: config.multiple === 'multiple' ? 'array' : 'string',
        title: config.title,
        description: config.description,
        required: config.required,
        readOnly: config.displayModifier === 'readonly',
        display: config.displayModifier !== 'hidden',
        'x-component': 'UserPicker',
        ['x-component-props']: {
            placeholder: config.placeholder,
            mode: config.multiple,
            showSearch: true,
            loading: config.loading,
            onSearch(value: string) {
                config.onSearch && config.onSearch(value)
                console.log(value)
            },

            filterOption: (input: string, option: any[]) =>
                //@ts-ignore 
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        enum: config.optionalRange === 'all' ? [] : (config.rangeList || []).map(itm => ({
            label: itm.ownerName,
            value: itm.id
        })),
        defaultValues: config.multiple === 'multiple' ? config.defaultValues : config.defaultValues.slice(0, 1),
        defaultValue: config.multiple === 'multiple' ? config.defaultValues : config.defaultValues[0] || '',
    })

}

export const toConfig = (schema: FormBuilder.Schema): DefaultConfig => {
    let displayModifier: FormBuilder.DisplayModifier = 'normal';
    if (schema.readOnly) {
        displayModifier = 'readonly';
    } else if (!schema.display) {
        displayModifier = 'hidden';
    }
    return {
        title: schema.title as string,
        description: schema.description as string,
        displayModifier: displayModifier,
        placeholder: schema['x-component-props']?.placeholder || '',
        required: !!schema.required,
        // @ts-ignore
        defaultValue: schema?.defaultValue || [],
        // @ts-ignore
        defaultValues: schema?.defaultValues || [],
        // @ts-ignore
        rangeList: schema?.rangeList || []
    }
}
