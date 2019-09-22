const calculate = {
  getSelectedBlock: function(pos, blockWidth, blockHeight, startX, startY, rowSize, colSize) {
    const row = Math.floor((pos.x - startX) / blockWidth);
    const col = Math.floor((pos.y - startY) / blockHeight);
    if (row >= 0 && row < rowSize && col >= 0 && col < colSize) {
      return { 
        row: row, 
        col: col, 
      };
    } else {
      return {
        row: -1, 
        col: -1, 
      };
    }
  },
  getMousePos: function(canvasDom, mouseEvent) {
    const rect = canvasDom.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top
    }
  },
  getTouchPos: function(canvasDom, touchEvent) {
    const rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
    };
  }
}