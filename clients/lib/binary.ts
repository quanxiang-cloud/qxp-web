export function numberToBinaryString(integer: number, decimal = 4): string {
  return (integer >>> 0).toString(2).padStart(decimal, '0');
}

export function binaryStringToNumber(binaryString: string): number {
  return parseInt(binaryString, 2);
}
