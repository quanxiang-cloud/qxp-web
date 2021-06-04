import { TreeNode } from 'react-dropdown-tree-select'

export interface DefaultConfig {
    title: string;
    description?: string;
    displayModifier: FormBuilder.DisplayModifier;
    placeholder?: string;
    required: boolean;
    multiple?: 'signle' | 'multiple';
    rangeList: string[];
    optionalRange?: 'all' | 'customize';
    defaultValues?: string[]
}

export const defaultConfig: DefaultConfig = {
    title: '部门选择器',
    description: '',
    displayModifier: 'normal',
    placeholder: '',
    required: false,
    multiple: 'signle',
    rangeList: [],
    optionalRange: 'all',
    defaultValues: []
}

export const toSchema = (config: DefaultConfig): FormBuilder.Schema => {
    return Object.assign(config, {
        type: 'string',
        title: config.title,
        description: config.description,
        required: config.required,
        readOnly: config.displayModifier === 'readonly',
        display: config.displayModifier !== 'hidden',
        rangeList: config.rangeList,
        'x-component': 'OrganizationPicker',
        ['x-component-props']: {
            placeholder: config.placeholder,
        },
        ['x-internal']: {
            permission: 3,
        },
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
        defaultValues: schema?.defaultValues || [],
        // @ts-ignore
        rangeList: schema?.rangeList || []
    }
}
