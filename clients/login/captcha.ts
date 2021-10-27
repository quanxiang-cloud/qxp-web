import { removeError, validateCaptcha, validateUsername, httpClient } from './login-common';
import './style.scss';

window.onload = function() {
  const username = document.querySelector('#username') as HTMLInputElement;
  const captcha = document.querySelector('#captcha') as HTMLInputElement;
  const nameMessage = document.querySelector('#nameMessage') as HTMLElement;
  const captchaMessage = document.querySelector('#captchaMessage') as HTMLElement;
  const captchaBtn = document.querySelector('#captchaBtn') as HTMLButtonElement;
  const loginForm = document.querySelector('#loginForm') as HTMLFormElement;

  let counter = 60;
  let isSending = false;
  let tid: NodeJS.Timeout;

  function resetVars(errorMessage?: string): void {
    captchaBtn.classList.remove('disabled');
    captchaBtn.innerText = '获取验证码';
    captchaMessage.textContent = errorMessage as string;
    clearInterval(tid);
    counter = 59;
    isSending = false;
  }

  function callSendApi(): any {
    return httpClient('/api/v1/org/login/code', { userName: username?.value }, {
      'X-Proxy': 'API-NO-AUTH',
    });
  }

  function sendCode(): void {
    isSending = true;
    captchaBtn.classList.add('disabled');

    callSendApi().then(() => {
      captchaBtn.innerText = `${counter} 后重新获取`;
      tid = global.setInterval(() => {
        counter -= 1;
        captchaBtn.innerText = `${counter} 后重新获取`;
        if (counter <= 0) {
          resetVars();
        }
      }, 1000);
    }).catch(resetVars);
  }

  function onSendCode(e: Event): void {
    if (isSending) {
      return;
    }
    e.preventDefault();
    if (validateUsername(username, nameMessage) === true) {
      sendCode();
    }
    return;
  }

  username.addEventListener('input', function() {
    removeError(username, nameMessage);
  });

  captcha.addEventListener('input', function() {
    removeError(captcha, captchaMessage);
  });

  captchaBtn.addEventListener('click', onSendCode);

  loginForm.addEventListener('submit', function(event) {
    if (!validateUsername(username, nameMessage)) {
      event.preventDefault();
    }
    if (!validateCaptcha(captcha, captchaMessage)) {
      event.preventDefault();
    }
  });
};
