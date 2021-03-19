import React, { useState } from 'react';
import useCss from 'react-use/lib/useCss';
import { RadioGroup as LegoRadioGroup, RadioButton as LegoRadioButton } from '@QCFE/lego-ui'

interface ISwitchOption {
	label: string
	value: string
}

interface ISwitch {
	className?: string
	options: ISwitchOption[]
	onChange?: (value: string | number) => void
}

export const Switch = ({ ...props }: ISwitch) => {
	const [selectedValue, setSelectedValue] = useState(props.options[0]['value'])

	return (
		<div className={useCss({
			display:'inline-block',
			'margin-right':'16px',
			'.radio-group label.radio-button':{
				width:'60px',
				height:'32px',
				padding:'5px 16px',
				background:'none',
				color:'#475569',
				'font-size':'14px',
				'line-height':'22px',
				'border-color':'#CBD5E1'
			},
			'.radio-group label.radio-button.checked':{
				'border-color':'#375FF3',
				'color':'#375FF3'
			}
		})}>
			<LegoRadioGroup
				defaultValue={selectedValue}
				onChange={props.onChange}
			>
				<LegoRadioButton style={{ borderRadius: '8px 0 0 8px' }} value={props.options[0]['value']}>{props.options[0]['label']}</LegoRadioButton>
				<LegoRadioButton style={{ borderRadius: '0 8px 8px 0' }} value={props.options[1]['value']}>{props.options[1]['label']}</LegoRadioButton>
			</LegoRadioGroup>
		</div>

	)
}