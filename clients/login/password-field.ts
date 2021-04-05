import { InputField, IInputField, OnValidateAll, parseValidateAllResult } from '@lib/atom';

export default class Password extends InputField {
  toggler: HTMLImageElement;

  constructor(args: IInputField, action: HTMLButtonElement, onValidateAll?: OnValidateAll) {
    super(args, action, onValidateAll);
    this.toggler = this.inputElement.nextElementSibling?.querySelector('img') as HTMLImageElement;
    this.toggler.onclick = () => this.togglePassword();
  }

  togglePassword() {
    const toggleType = this.toggler.src;
    if (toggleType.endsWith('/dist/images/visibility-off.svg')) {
      this.toggler.src = '/dist/images/visibility-on.svg';
      this.toggler.alt = 'eye-opened';
      this.inputElement.type = 'text';
    } else {
      this.toggler.src = '/dist/images/visibility-off.svg';
      this.toggler.alt = 'eye-closed';
      this.inputElement.type = 'password';
    }
  }

  validate(checkAll?: boolean): boolean | Promise<boolean> {
    let isValid = true;
    if ((this.value as string).length < 6) {
      if (this.value !== '') {
        this.errMessage = '密码至少为6位';
        isValid = false;
      }
      this.action.classList.add('disabled');
    }
    if (isValid) {
      this.errMessage = '';
    }
    if (this.value === '') {
      isValid = false;
    }
    (this.errorElement as HTMLElement).textContent = this.errMessage as string;
    if (this.errMessage) {
      this.inputElement?.classList.add('error');
    } else {
      this.inputElement?.classList.remove('error');
    }

    if (checkAll) {
      const onValidateAllResult: boolean | (boolean | Promise<boolean>)[] = this.onValidateAll(
        this, isValid
      );
      if (onValidateAllResult instanceof Array) {
        parseValidateAllResult(onValidateAllResult, this.errorElement).then((isAllValid) => {
          isAllValid && this.action.classList.remove('disabled');
        });
      } else if (onValidateAllResult) {
        this.action.classList.remove('disabled');
      }
    }
    return isValid;
  }
}
