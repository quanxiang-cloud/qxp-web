export function getOperateButtonPer(wIndex: number, authority: number): boolean {
  const weightArr = authority.toString(2).split('').reverse();
  if (weightArr.length < 7) {
    const permissionFillTimes = 7 - weightArr.length;
    for (let index = 0; index < permissionFillTimes; index += 1) {
      weightArr.push('0');
    }
  }
  if (weightArr[wIndex - 1] === '0') {
    return false;
  }

  return true;
}
