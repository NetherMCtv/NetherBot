module.exports.isNegativeNumber = (number) => {
  return Math.sign(number) === -1 || isNaN(Math.sign(number));
}