import { InputField } from '@assets/lib/atom'

export default class Captcha extends InputField {
  validate(checkAll?: boolean) {
    let isValid = true
    if ((this.value as string).length < 6) {
      if(this.value !== '') {
        this.errMessage = '验证码至少为6位'
        isValid = false;
      } 
      this.action.classList.add('disabled')
    }
    if (isValid) {
      this.errMessage = ''
    }
    if (this.value === '') {
      isValid = false
    }
    (this.errorElement as HTMLElement).textContent = this.errMessage as string
    if(checkAll && (this.onValidateAll as Function)(this, isValid)) {
      this.action.classList.remove('disabled')
    }
    return isValid
  }
}
