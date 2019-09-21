const board = {
  board: [],
  blockWidth: 0,
  blockHeight: 0,
  startX: 0,
  startY: 0,
  selectedBlock: {
    isSelected: false,
    id: -1,
    row: -1,
    col: -1,
    type: -1
  },
  prevBlock: {
    id: -1,
    row: -1,
    col: -1,
    type: -1
  },
  savedBlocks: [],
  initBoard: function (rowSize, colSize) {
    for (var i = 0; i < rowSize; i++) {
      this.board[i] = [];
      for (var j = 0; j < colSize; j++) {
        this.board[i][j] = { id: i + '|' + j, type: 0 };
      }
    }
  },
  setBlocksOnBoard: function(rowSize, colSize) {
    const blockTypeSize = BlockTypes.length;
    for (var i = 0; i < rowSize; i++) {
      this.board[i] = [];
      for (var j = 0; j < colSize; j++) {
        this.board[i][j] = { id: i + '|' + j, type: parseInt(Math.random() * (blockTypeSize - 1)) + 1 };
      }
    }
  },
  draw: function(boardContext, boardWidth, boardHeight, rowSize, colSize) {
    this.blockWidth = parseInt((boardWidth - 20) / colSize);
    this.blockHeight = parseInt((boardHeight - 20) / rowSize);
    this.startX = (boardWidth - (this.blockWidth * rowSize)) / 2;
    this.startY = (boardHeight - (this.blockHeight * colSize)) / 2;

    let x = this.startX;
    let y = this.startY;

    for (let i = 0; i < colSize; i++) {
      for (let j = 0; j < rowSize; j++) {
        block.drawRoundedRect(boardContext, x, y, this.blockWidth, this.blockHeight, this.blockWidth / 4, BlockTypes[this.board[i][j].type], 'fill');
        x += this.blockWidth;
      }
      x = this.startX;
      y += this.blockHeight;
    }
  },
  setSelectedBlock: function(isSelected, row, col, type) {
    this.selectedBlock = {isSelected: isSelected, row: row, col: col, type: type};
  },
  setPrevBlock: function(row, col, type) {
    this.prevBlock = {row: row, col: col, type: type};
  },
  getSelectedBlock: function(pos, rowSize, colSize) {
    const row = Math.floor((pos.x - this.startX) / this.blockWidth);
    const col = Math.floor((pos.y - this.startY) / this.blockHeight);
    if (row >= 0 && row < rowSize && col >= 0 && col < colSize) {
      return { 
        valid: true,
        row: row, 
        col: col, 
        type: this.board[row][col].type 
      };
    } else {
      return {
        valid: false,
        row: -1, 
        col: -1, 
        type: -1
      };
    }
  },
  getMousePos: function(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const x =  Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
    const y =  Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
    return {
      x: x, y: y
    };
  },
  saveBlocks: function(pos, rowSize, colSize) {
    const currentBlock = this.getSelectedBlock(pos, rowSize, colSize);
    const checkValue = this.checkBlocks(this.prevBlock, currentBlock);
    console.log(checkValue);
    if (checkValue) {
      // block.drawBlockPath(this.startX + (this.prevBlock.col * this.blockWidth) - (this.blockWidth / 2),
      //   this.startY + (this.prevBlock.row * this.blockHeight) - (this.blockHeight / 2),
      //   this.startX + (this.currentBlock.col * this.blockWidth) - (this.blockWidth / 2),
      //   this.startY + (this.currentBlock.row * this.blockHeight) - (this.blockHeight / 2),
      // );

      // const currentBlockId = this.currentBlock.row + '|' + this.currentBlock.col;
      // if (this.savedBlocks.indexOf(currentBlockId) === -1) {
        this.savedBlocks.push(this.currentBlock.row + '|' + this.currentBlock.col);
      //   this.prevBlock = {row: currentBlock.row, col: currentBlock.col, type: currentBlock.type};
      // }
    }
    console.log(this.savedBlocks);
  },
  checkBlocks: function(prev, current) {
    if (current.valid && prev.type === current.type) {
      const prevRow = parseInt(prev.row);
      const currentRow = parseInt(current.row);
      const prevCol = parseInt(prev.col);
      const currentCol = parseInt(current.col);
      console.log(prevRow, currentRow, prevCol, currentCol);

      if (Math.abs(prevRow - currentRow) + Math.abs(prevCol - currentCol) === 1) {
        return true;
      }
      return false;
    }
  }
}