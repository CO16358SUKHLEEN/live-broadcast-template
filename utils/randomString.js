module.exports = (delimitter = '.', length = 10, includeTime = true) => {
  const charsNumbers = "0123456789";
  const charsLower = "abcdefghijklmnopqrstuvwxyz";
  const charsUpper = charsLower.toUpperCase();
  let chars;

  chars = charsNumbers + charsLower + charsUpper;

  let string = "";
  for (let i = 0; i < length; i++) {
    let randomNumber = Math.floor(Math.random() * 32) + 1;
    randomNumber = randomNumber || 1;
    string += chars.substring(randomNumber - 1, randomNumber);
  }
  return string + delimitter + includeTime ? new Date().getTime() : '';
}