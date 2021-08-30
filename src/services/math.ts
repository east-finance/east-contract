import { BigNumber } from 'bignumber.js';

export function divide(a: BigNumber, b: BigNumber): BigNumber {
  return a.dividedBy(b)
}

export function multiply(a: BigNumber, b: BigNumber): BigNumber {
  return a.multipliedBy(b)
}

export function subtract(a: BigNumber, b: BigNumber): BigNumber {
  return a.minus(b)
}

export function add(a: BigNumber, b: BigNumber): BigNumber {
  return a.plus(b)
}
