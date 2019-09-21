const block = {
  drawRoundedRect: function(ctx, x, y, width, height, radius, color, type) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.lineTo(x + width - radius, y + height);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.lineTo(x + width, y + radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.lineTo(x + radius, y);
    ctx.arcTo(x, y, x, y + radius, radius);
    if (type === 'stroke') {
      ctx.stroke();
    } else if (type === 'fill') {
      ctx.fill();
    }
  },
  drawBlockPath: function(fromX, fromY, toX, toY) {
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }
}