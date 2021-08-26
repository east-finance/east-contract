import BigNumber from "bignumber.js";
import { add, divide, multiply, subtract } from "../services/math";

BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

// (() => {
//   const rwaPart = 0.5,
//     westCollateral = 2.5;
//   const rwaPartInPosition = rwaPart / ((1 - rwaPart) * westCollateral + rwaPart);
//   console.log(rwaPartInPosition);
// })();

// (() => {
//   const rwaPart = new BigNumber('0.5'),
//     westCollateral = new BigNumber('2.5');
//   const rwaPartInPosition = divide(
//     rwaPart,
//     add(
//       multiply(
//         subtract(new BigNumber(1), rwaPart),
//         westCollateral
//       ),
//       rwaPart
//     )
//   );
//   console.log(rwaPartInPosition.toString())
// })();

// (() => {
//   const rwaPart = new BigNumber('0.5'),
//     westCollateral = new BigNumber('2.5');
//   const rwaPartInPosition = rwaPart.dividedBy(
//     (new BigNumber(1).minus(rwaPart))
//     .multipliedBy(westCollateral)
//     .plus(rwaPart)
//   )
//   console.log(rwaPartInPosition.toString())
// })();

console.log(BigNumber.maximum(new BigNumber('-0.45'), '-0.5').toString())