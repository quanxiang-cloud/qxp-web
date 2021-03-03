import { InputField, isEmail, isMobile } from 'clients/assets/lib/atom'

export default class UserName extends InputField {
  validate(checkAll?: boolean) {
    let isValid = true
    if (!isEmail(this.value as string) && !isMobile(this.value as string)) {
      if(this.value !== '') {
        this.errMessage = '请输入有效的邮箱或手机号'
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
