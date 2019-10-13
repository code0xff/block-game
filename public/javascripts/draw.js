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
  drawBlockPath: function(context, fromX, fromY, toX, toY, lineWidth) {
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
  removeImage: function(context, x, y, width, height) {
    context.clearRect(x, y, width, height);
  },
  drawEnergyBar: function(context, x, y, fullWidth, valueWidth, height) {
    draw.drawRoundedRect(context, x, y, fullWidth, height, 0, '#555555', 'fill');
    draw.drawRoundedRect(context, x, y, valueWidth, height, 0, '#FF0000', 'fill');
  },
  removeEnergyBar: function(context, width, height) {
    context.clearRect(0, 0, width, height);
  },
  drawText: function(context, text, x, y, fontSize, font, fontColor) {
    context.fillStyle = fontColor;
    context.font = fontSize + "px " + font;
    context.fillText(text, x, y);
  },
  removeText: function(context, x, y, width, height) {
    context.clearRect(x, y - height, width, parseInt(2 * height));
  },
  removeAll: function(canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}
