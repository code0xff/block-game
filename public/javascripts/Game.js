const game = {
  rowSize: 10,
  colSize: 10,
  start: function (boardCanvas, boardContext, boardWidth, boardHeight) {
    const rowSize = this.rowSize;
    const colSize = this.colSize;

    boardCanvas.addEventListener("touchstart", function(e) {
      e.preventDefault();
      const touch = e.changedTouches[0];

      const pos = {x: touch.pageX, y: touch.pageY};

      const selectedBlock = board.getSelectedBlock(pos, rowSize, colSize);
      if (selectedBlock.valid) {
        board.setSelectedBlock(selectedBlock.valid, selectedBlock.row, selectedBlock.col, selectedBlock.type);
        board.setPrevBlock(selectedBlock.row, selectedBlock.col, selectedBlock.type);
      }
    });

    boardCanvas.addEventListener('touchmove', function(e) {
      e.preventDefault();

      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        if (board.selectedBlock.isSelected) {
          const pos = {x: touches[i].pageX, y: touches[i].pageY};
          board.saveBlocks(pos, rowSize, colSize);
        }
      }
    });
    
    boardCanvas.addEventListener("touchend", function(e) {
      e.preventDefault();
      board.setSelectedBlock(false, -1, -1, -1);
    });

    board.initBoard(this.rowSize, this.colSize);
    board.setBlocksOnBoard(this.rowSize, this.colSize);
    board.draw(boardContext, boardWidth, boardHeight, this.rowSize, this.colSize);
  }
}