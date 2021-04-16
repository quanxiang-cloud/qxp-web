import { InputField, isEmail, isMobile, parseValidateAllResult } from './atom';

export default class UserName extends InputField {
  validate(checkAll?: boolean): boolean | Promise<boolean> {
    let isValid = true;
    if (!isEmail(this.value as string) && !isMobile(this.value as string)) {
      this.errMessage = '请输入正确格式的邮箱或手机号';
      isValid = false;
    }
    if (isValid) {
      this.errMessage = '';
    }
    if (this.value === '') {
      isValid = false;
    }

    if (this.asyncValidate && !this.errMessage) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const msg = '';
          if (msg) {
            (this.errorElement as HTMLElement).textContent = msg;
            isValid = false;
            this.inputElement?.classList.add('error');
          } else {
            (this.errorElement as HTMLElement).textContent = '';
            this.inputElement?.classList.remove('error');
          }

          if (checkAll) {
            const onValidateAllResult: boolean | (
              boolean | Promise<boolean>
            )[] = this.onValidateAll(this, isValid);
            if (onValidateAllResult instanceof Array) {
              parseValidateAllResult(onValidateAllResult, this.errorElement).then(((isAllValid) => {
                isAllValid && this.action.classList.remove('disabled');
              }));
            } else if (onValidateAllResult) {
              this.action.classList.remove('disabled');
            }
          }
          resolve(isValid);
        }, 300);
      });
    } else {
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
}
