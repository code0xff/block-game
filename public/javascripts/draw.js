const draw = {
  drawRoundedRect: function(context, x, y, width, height, radius, color, type) {
    context.beginPath();
    context.moveTo(x, y + radius);
    context.lineTo(x, y + height - radius);
    context.arcTo(x, y + height, x + radius, y + height, radius);
    context.lineTo(x + width - radius, y + height);
    context.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    context.lineTo(x + width, y + radius);
    context.arcTo(x + width, y, x + width - radius, y, radius);
    context.lineTo(x + radius, y);
    context.arcTo(x, y, x, y + radius, radius);
   if (type === 'stroke') {
      context.lineWidth = parseInt(width / 10);
      context.strokeStyle = color;
      context.stroke();
    } else if (type === 'fill') {
      context.fillStyle = color;
      context.fill();
    }
  },
  drawBlockPath: function(context, fromX, fromY, toX, toY) {
    context.fillStyle = "#000000";
    context.beginPath();
    context.lineWidth = 5;
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  },
  removeBlock: function(context, x, y, width, height) {
    context.clearRect(x, y, width, height);
  },
  drawImage: function(context, x, y, width, height, imageSource) {
    const image = new Image();
    image.onload = function () {
      context.drawImage(image, x, y, width, height);
    }
    image.src = imageSource;
  },
  drawText: function(context, text, x, y, textStyle, textSize, font) {
    context.fillStyle = "#ffffff";
    context.font = textStyle + " " + textSize + " " + font;
    context.fillText(text, x, y);
  }
}
