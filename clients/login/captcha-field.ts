import { IInputField, InputField, query, OnValidateAll, parseValidateAllResult } from './atom';
import httpClient from '@lib/http-client';
import UserName from './username';

export default class Captcha extends InputField {
  sender?: HTMLButtonElement;
  username?: UserName;
  url!: string;
  errorId?: number;
  isSending?: boolean;

  constructor(
    captcha: IInputField,
    action: HTMLButtonElement,
    onValidateAll?: OnValidateAll,
  ) {
    super(captcha, action, onValidateAll);
    if (!captcha.actionElement) {
      return;
    }
    this.url = captcha.url || '';
    this.sender = captcha.actionElement;
    this.bindEvents();
  }

  toggleSender(result: boolean | Promise<boolean>) {
    const element = this.sender as HTMLButtonElement;
    const toggle = (valid?: boolean) => {
      if (!valid) {
        element.classList.add('disabled');
      } else {
        element.classList.remove('disabled');
      }
    };
    if (typeof result === 'boolean') {
      toggle(result);
    } else if (result instanceof Promise) {
      result.then(toggle);
    }
  }

  setUserName(username: UserName) {
    this.username = username;
    if (!this.sender) {
      return;
    }
  }

  bindEvents() {
    if (!this.sender) {
      return;
    }
    this.sender.onclick = this.onSendCode.bind(this);
  }

  callSendApi() {
    return httpClient(this.url, { userName: this.username?.value }, {
      // todo refactor this
      'X-Proxy': 'API-NO-AUTH',
    });
  }

  showError(errorMessage?: string | undefined) {
    if (this.errorId) {
      clearTimeout(this.errorId);
    }
    const pageErrorElement = query<HTMLSpanElement>('div.captcha-hints');
    if (errorMessage && pageErrorElement) {
      pageErrorElement.innerText = errorMessage;
    }
  }

  sendCode() {
    let counter = 60;
    let tid: NodeJS.Timeout;
    const element = this.sender as HTMLButtonElement;
    const resetVars = (errorMessage?: string) => {
      element.classList.remove('disabled');
      element.innerText = '获取验证码';
      this.showError(errorMessage);
      clearInterval(tid);
      this.toggleSender(this.username?.validate() || false);
      counter = 60;
      this.isSending = false;
    };
    this.isSending = true;
    this.callSendApi()
      .then(() => {
        // todo fixme
        (this.errorElement as HTMLElement).textContent = '';
        // @ts-ignore
        tid = setInterval(() => {
          counter -= 1;
          element.innerText = `${counter} 后重新获取`;
          if (counter <= 0) {
            resetVars();
          }
        }, 1000);
      })
      .catch(resetVars);
    element.classList.add('disabled');
  }

  onSendCode(e: Event) {
    if (this.isSending) {
      return;
    }
    e.preventDefault();
    const validateResult = this.username?.validate();
    this.toggleSender(validateResult || false);
    if (validateResult === true) {
      this.sendCode();
    } else if (validateResult instanceof Promise) {
      validateResult.then((isValid: boolean) => {
        isValid && this.sendCode();
      });
    }
  }

  validate(checkAll?: boolean): boolean | Promise<boolean> {
    let isValid = true;
    if ((this.value as string).length < 6) {
      if (this.value == '') {
        this.errMessage = '验证码不能为空';
      }
      if (this.value !== '') {
        this.errMessage = '请输入 6 位数字验证码';
      }
      isValid = false;
    }
    if (isValid) {
      this.errMessage = '';
    }

    (this.errorElement as HTMLElement).textContent = this.errMessage as string;
    if (this.errMessage) {
      this.inputElement?.classList.add('error');
    } else {
      this.inputElement?.classList.remove('error');
    }
    if (checkAll) {
      const onValidateAllResult: boolean | (boolean | Promise<boolean>)[] = this.onValidateAll(
        this, isValid,
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
