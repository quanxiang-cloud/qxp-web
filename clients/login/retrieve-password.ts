import httpClient from '@lib/http-client';
import { imgChange, removeError, validateCaptcha, validateUsername } from './login-common';
import './style.scss';

window.onload = function() {
  const username = document.querySelector('#username') as HTMLInputElement;
  const captcha = document.querySelector('#captcha') as HTMLInputElement;
  const newPassword = document.querySelector('#newPassword') as HTMLInputElement;
  const nameMessage = document.querySelector('#nameMessage') as HTMLElement;
  const captchaMessage = document.querySelector('#captchaMessage') as HTMLElement;
  const newMessage = document.querySelector('#newMessage') as HTMLElement;
  const captchaBtn = document.querySelector('#captchaBtn') as HTMLButtonElement;
  const newImg = document.querySelector('#newImg') as HTMLImageElement;
  const findForm = document.querySelector('#findForm') as HTMLFormElement;

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
    return httpClient('/api/v1/org/forget/code', { userName: username?.value }, {
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
    if (validateUsername(username, nameMessage)) {
      sendCode();
    }
    return;
  }

  captchaBtn.addEventListener('click', function(e: Event) {
    onSendCode(e);
  });

  newImg.addEventListener('click', function() {
    imgChange(newImg, newPassword);
  });

  username.addEventListener('input', function() {
    removeError(username, nameMessage);
  });

  captcha.addEventListener('input', function() {
    removeError(captcha, captchaMessage);
  });

  newPassword.addEventListener('input', function() {
    removeError(newPassword, newMessage);
  });

  findForm.addEventListener('submit', function(event) {
    if (!validateUsername(username, nameMessage)) {
      event.preventDefault();
    }
    if (!validateCaptcha(captcha, captchaMessage)) {
      event.preventDefault();
    }
  });
};
