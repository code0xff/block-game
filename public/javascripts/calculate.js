const calculate = {
  getSelectedBlock: function(pos, blockWidth, blockHeight, startX, startY, rowSize, colSize) {
    const row = Math.floor((pos.y - startY) / blockHeight);
    const col = Math.floor((pos.x - startX) / blockWidth);
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
  getBlockCenterPos: function(row, col, blockWidth, blockHeight, startX, startY) {
    const x = ((col + 1) * blockWidth) + startX -  parseInt(blockWidth / 2);
    const y = ((row + 1) * blockHeight) + startY - parseInt(blockHeight / 2);
    return {
      x: x,
      y: y
    }
  },
  createId: function(row, col) {
    return row + '' + col;
  },
  decodeId: function(id) {
    if (id.length === 2) {
      const parsedId = parseInt(id);
      return {
        row: parseInt(parsedId / 10),
        col:parsedId % 10
      }
    }
    return null;
  },
  getBlockStartPos: function(row, col, blockWidth, blockHeight, startX, startY) {
    const x = (col * blockWidth) + startX;
    const y = (row * blockHeight) + startY;
    return {
      x: x,
      y: y
    }
  }
}