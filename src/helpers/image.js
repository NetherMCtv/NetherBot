module.exports.applyText = (canvas, text, font = 'sans-serif') => {
  const context = canvas.getContext('2d');
  let fontSize = 70;

  do {
    context.font = `${fontSize -= 10}px ${font}`;
  } while (context.measureText(text).width > canvas.width - 300);

  return context.font;
};