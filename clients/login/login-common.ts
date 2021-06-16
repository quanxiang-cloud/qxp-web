export function validateUsername(username: HTMLInputElement, message: HTMLElement): boolean {
  if (!username.value) {
    message.innerText = '用户名不能为空';
    username.classList.add('error');
    return false;
  }

  if (
    !/^1[0-9]{10}$/.test(username.value) &&
    !/^([a-zA-Z0-9]+[_|_|.|+]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/.test(username.value)
  ) {
    message.innerText = '请输入正确格式的邮箱或手机号';
    username.classList.add('error');
    return false;
  }

  message.innerText = '';
  username.classList.remove('error');
  return true;
}

export function validateCaptcha(captcha: HTMLInputElement, massage: HTMLElement): boolean {
  const captchaValue = captcha.value.trim();
  if (!captchaValue) {
    massage.innerText = '验证码不能为空';
    captcha.classList.add('error');
    return false;
  }

  if (!/^\d{8}$/.test(captchaValue)) {
    massage.innerText = '请输入 8 位数字验证码';
    captcha.classList.add('error');
    return false;
  }

  massage.innerText = '';
  captcha.classList.remove('error');
  return true;
}

export function validatePwd(password: HTMLInputElement, massage: HTMLElement): boolean {
  if (!password.value) {
    massage.innerText = '请输入密码';
    password.classList.add('error');
    return false;
  }

  if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&+.])[A-Za-z\d@$!%*#?&+.]{8,}$/.test(password.value)) {
    massage.innerText = '密码必须包含数字、字母和符号，长度至少为 8 位且不包含空格';
    password.classList.add('error');
    return false;
  }
  massage.innerText = '';
  password.classList.remove('error');
  return true;
}

export function removeError(input: HTMLInputElement, massage: HTMLElement): void {
  massage.innerText = '';
  input.classList.remove('error');
}

export function imgChange(img: HTMLImageElement, input: HTMLInputElement): void {
  if (img.dataset.passwordVisible === 'true') {
    img.src = img.dataset.eyeOffSrc as string;
    img.alt = '隐藏密码';
    input.type = 'password';
    img.dataset.passwordVisible = 'false';
  }

  img.src = img.dataset.eyeOpenSrc as string;
  img.alt = '显示密码';
  input.type = 'text';
  img.dataset.passwordVisible = 'true';
}
