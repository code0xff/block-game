const draw = {
  drawRoundedRect: function(ctx, x, y, width, height, radius, color, type) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.lineTo(x + width - radius, y + height);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.lineTo(x + width, y + radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.lineTo(x + radius, y);
    ctx.lineWidth = 1;
    ctx.arcTo(x, y, x, y + radius, radius);
   if (type === 'stroke') {
      ctx.strokeStyle = color;
      ctx.stroke();
    } else if (type === 'fill') {
      ctx.fillStyle = color;
      ctx.fill();
    }
  },
  drawBlockPath: function(ctx, fromX, fromY, toX, toY) {
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  },
  removeBlock: function(ctx, x, y, width, height) {
    ctx.clearRect(x, y, width, height);
  }
}
