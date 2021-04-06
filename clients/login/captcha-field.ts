import { IInputField, InputField, query, OnValidateAll, parseValidateAllResult } from '@lib/atom';
import { httpPost } from '@lib/utils';
import { Response } from '@clients/types/api';
import UserName from './username';

export default class Captcha extends InputField {
  sender?: HTMLButtonElement;
  username?: UserName;
  url!: string;
  errorId?: number;

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
    const syncUsername = () => {
      const validateResult = this.username?.validate() || false;
      this.toggleSender(validateResult);
    };
    syncUsername();
    this.username.on('change', syncUsername);
  }

  bindEvents() {
    if (!this.sender) {
      return;
    }
    this.sender.onclick = this.onSendCode.bind(this);
  }

  callSendApi() {
    return httpPost(this.url, JSON.stringify({ userName: this.username?.value }));
  }

  showError(errorMessage?: string) {
    if (this.errorId) {
      clearTimeout(this.errorId);
    }
    const pageErrorElement = query<HTMLSpanElement>('span.error');
    if (errorMessage && pageErrorElement) {
      pageErrorElement.innerText = errorMessage;
      pageErrorElement.classList.remove('hidden');
      this.errorId = window.setTimeout(() => {
        pageErrorElement.classList.add('hidden');
      }, 3000);
    }
  }

  sendCode() {
    let counter = 60;
    let tid = 0;
    const element = this.sender as HTMLButtonElement;

    const resetVars = (errorMessage?: string) => {
      this.showError(errorMessage);
      clearInterval(tid);
      element.classList.remove('disabled');
      counter = 60;
      element.innerText = '获取验证码';
    };

    this.callSendApi()
      .then((resp: unknown) => {
        const res = resp as Response<string>;
        if (res.code !== 0) {
          this.showError(res.msg);
        }
      })
      .catch(resetVars);
    element.classList.add('disabled');
    tid = window.setInterval(() => {
      counter -= 1;
      element.innerText = `${counter}`;
      if (counter <= 0) {
        resetVars();
      }
    }, 1000);
  }

  onSendCode(e: Event) {
    e.preventDefault();
    const validateResult = this.username?.validate();
    if (validateResult === true) {
      this.sendCode();
    } else if (validateResult instanceof Promise) {
      validateResult.then(() => this.sendCode());
    }
  }

  validate(checkAll?: boolean): boolean | Promise<boolean> {
    let isValid = true;
    if ((this.value as string).length < 6) {
      if (this.value !== '') {
        this.errMessage = '验证码至少为6位';
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
