import React, { ReactNode, FC, ComponentProps } from 'react';
import Radio from '@c/radio';
import './index.scss';
interface CustormRadioProps extends ComponentProps<typeof Radio>{
  children: ReactNode,
  describe: string
}
const CustomRadio: FC<CustormRadioProps> = ({ children, describe, ...props })=>{
  return (
    <>
      <Radio {...props}></Radio>
      <div className='custom-radio-content'>
        <p className='custom-radio-describe'>{describe}</p>
        {children}
      </div>
    </>
  );
};
export default CustomRadio;
