import { InputField, IInputField } from '@assets/lib/atom'

export default class Password extends InputField {
  toggler: HTMLImageElement;

  constructor(args: IInputField, action: HTMLButtonElement, onValidateAll?: Function) {
    super(args, action, onValidateAll)
    this.toggler = this.inputElement.nextElementSibling?.querySelector('img') as HTMLImageElement 
    this.toggler.onclick = () => this.togglePassword()
  }

  togglePassword() {
    const toggleType = this.toggler.src;
    if(toggleType.endsWith('/dist/images/eye-close.png')) {
      this.toggler.src = '/dist/images/eye-open.png'
      this.toggler.alt = 'eye-opened'
      this.inputElement.type = 'text'
    } else {
      this.toggler.src = '/dist/images/eye-close.png'
      this.toggler.alt = 'eye-closed'
      this.inputElement.type = 'password'
    }
  }

  validate(checkAll?: boolean) {
    let isValid = true
    if ((this.value as string).length < 6) {
      if(this.value !== '') {
        this.errMessage = '密码至少为6位'
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
    if (checkAll && (this.onValidateAll as Function)(this, isValid)) {
      this.action.classList.remove('disabled')
    }
    return isValid
  }
}
