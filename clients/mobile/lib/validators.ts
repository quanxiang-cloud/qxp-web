export function isPhoneNumber(value?: string): boolean {
  return value ? /^1[3456789]\d{9}$/.test(value) : false;
}

export function isEmail(value?: string): boolean {
  return value ? /\w+([-+.]\w+)*@\w+([-.]\w+)*.\w+([-.]\w+)*/.test(value) : false;
}

export function isPassword(value?: string): boolean {
  if (!value || value.length < 8) return false;
  let numAsc = 0; let charAsc = 0; let otherAsc = 0;
  for (let i = 0; i < value.length; i += 1) {
    const asciiNumber = value.charCodeAt(i);
    if (asciiNumber >= 48 && asciiNumber <= 57) {
      numAsc += 1;
    }
    if ((asciiNumber >= 65 && asciiNumber <= 90) || (asciiNumber >= 97 && asciiNumber <= 122)) {
      charAsc += 1;
    }
    if (
      (asciiNumber >= 33 && asciiNumber <= 47) ||
      (asciiNumber >= 58 && asciiNumber <= 64) ||
      (asciiNumber >= 91 && asciiNumber <= 96) ||
      (asciiNumber >= 123 && asciiNumber <= 126)
    ) {
      otherAsc += 1;
    }
  }
  return !(numAsc < 1 || charAsc < 1 || otherAsc < 1);
}

export function checkPhoneEmail(value?: string): string {
  if (!value) {
    return '请输入手机号/邮箱';
  } else if (!isPhoneNumber(value) && !isEmail(value)) {
    return '请检查手机号/邮箱格式';
  }
  return '';
}

export function checkPassword(value?: string): string {
  if (!value) {
    return '请输入密码';
  } else if (value.length < 8) { // Test password's length
    return '密码长度至少为 8 位';
  } else if (!isPassword(value)) {
    return '密码须包含数字、字母和符号';
  }
  return '';
}

export function checkVerifyCode(value?: string): string {
  if (!value) {
    return '请输入验证码';
  }
  return '';
}
