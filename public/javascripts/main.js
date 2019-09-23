let boardCanvas;
let boardContext;
let boardWidth;
let boardHeight;

const option = {
  rowSize: 7,
  colSize: 7,
  offsetX: 40,
  offsetY: 40
}

const boardArray = [];
let blockWidth;
let blockHeight;
let startX;
let startY;

const BlockTypes = [
  '#ffffff',
  '#ffffff', // empty
  '#F4FA58', // yello
  '#FF4000', // red
  '#4CAF50', // green
  '#008CBA', // blue
  '#555555' // black
];

let startBlock;
let selectedBlocks = [];

const board = {
  initBoard: function () {
    for (var i = 0; i < option.rowSize; i++) {
      boardArray[i] = [];
      for (var j = 0; j < option.colSize; j++) {
        boardArray[i][j] = { type: 0 };
      }
    }
  },
  setBlocksOnBoard: function() {
    const blockTypeSize = BlockTypes.length;
    for (var i = 0; i < option.rowSize; i++) {
      boardArray[i] = [];
      for (var j = 0; j < option.colSize; j++) {
        boardArray[i][j] = { type: parseInt(Math.random() * (blockTypeSize - 1)) + 1 };
      }
    }
  },
  draw: function() {
    blockWidth = parseInt((boardWidth - option.offsetX) / option.colSize);
    blockHeight = parseInt((boardHeight - option.offsetY) / option.rowSize);
    startX = (boardWidth - (blockWidth * option.rowSize)) / 2;
    startY = (boardHeight - (blockHeight * option.colSize)) / 2;

    let x = startX;
    let y = startY;

    for (let i = 0; i < option.rowSize; i++) {
      for (let j = 0; j < option.colSize; j++) {
        draw.drawRoundedRect(boardContext, x, y, blockWidth, blockHeight, blockWidth / 4, BlockTypes[boardArray[i][j].type], 'fill');
        x += blockWidth;
      }
      x = startX;
      y += blockHeight;
    }
  },
  resolve: function() {
    if (selectedBlocks.length > 2) {
      const blockTypeSize = BlockTypes.length;
      for (let i = 0; i < selectedBlocks.length; i++) {
        const removeBlock = calculate.decodeId(selectedBlocks[i]);
        boardArray[removeBlock.row][removeBlock.col].type = 0;
        const removeBlockPos = calculate.getBlockStartPos(removeBlock.row, removeBlock.col, blockWidth, blockHeight, startX, startY);
        setTimeout(function(){
          draw.removeBlock(boardContext, removeBlockPos.x, removeBlockPos.y, blockWidth, blockHeight);
          boardArray[removeBlock.row][removeBlock.col] = { type: parseInt(Math.random() * (blockTypeSize - 1)) + 1 };
          draw.drawRoundedRect(boardContext, removeBlockPos.x, removeBlockPos.y, blockWidth, blockHeight, blockWidth / 4, 
            BlockTypes[boardArray[removeBlock.row][removeBlock.col].type], 'fill');
        }, 50 * i);
      }
    }
    startBlock = null;
    selectedBlocks = [];
  }
}

const game = {
  start: function () {
    board.initBoard();
    board.setBlocksOnBoard();
    board.draw();
  }
}

const main = {
  init: function() {
    boardCanvas =  document.getElementById("board");
    const displayWidth  = boardCanvas.clientWidth;
    const displayHeight = boardCanvas.clientHeight;
    
    if (boardCanvas.width !== displayWidth || boardCanvas.height !== displayHeight) {
      boardCanvas.width  = displayWidth;
      boardCanvas.height = displayHeight;
    }
    boardWidth = boardCanvas.width;
    boardHeight = boardCanvas.height;

    boardContext = boardCanvas.getContext("2d");

    boardCanvas.addEventListener("mousedown", function (e) {
      if (selectedBlocks.length !== 0) {
        board.resolve();
      } else {
        const pos = calculate.getMousePos(boardCanvas, e);
        startBlock = calculate.getSelectedBlock(pos, blockWidth, blockHeight, startX, startY, option.rowSize, option.colSize);
        if (boardArray[startBlock.row][startBlock.col].type > 0) {
          selectedBlocks.push(startBlock.row + '' + startBlock.col);
        }
      }
    }, false);

    boardCanvas.addEventListener("mouseup", function (e) {
      board.resolve();
    }, false);

    boardCanvas.addEventListener("mouseout", function (e) {
      board.resolve();
    }, false);

    boardCanvas.addEventListener("mousemove", function (e) {
      const pos = calculate.getMousePos(boardCanvas, e);
      const blockOnPath = calculate.getSelectedBlock(pos, blockWidth, blockHeight, startX, startY, option.rowSize, option.colSize);
      if (blockOnPath.row !== -1 && blockOnPath.col !== -1 && boardArray[blockOnPath.row][blockOnPath.col].type !== 0
        && selectedBlocks.indexOf(calculate.createId(blockOnPath.row, blockOnPath.col)) === -1 && selectedBlocks.length !== 0) {
        const prevBlock = calculate.decodeId(selectedBlocks[selectedBlocks.length - 1]);
        if (Math.abs(parseInt(prevBlock.row - blockOnPath.row)) <= 1 && Math.abs(parseInt(prevBlock.col - blockOnPath.col)) <= 1 
        && boardArray[prevBlock.row][prevBlock.col].type === boardArray[blockOnPath.row][blockOnPath.col].type) {
          selectedBlocks.push(blockOnPath.row + '' + blockOnPath.col);
          if (selectedBlocks.length === 3) {
            for (let i = 0; i < selectedBlocks.length - 1; i++) {
              const firstBlock = calculate.decodeId(selectedBlocks[i]);
              const firstBlockCenterPos = calculate.getBlockCenterPos(firstBlock.row, firstBlock.col, blockWidth, blockHeight, startX, startY);
              const secondBlock = calculate.decodeId(selectedBlocks[i + 1]);
              const secondBlockCenterPos = calculate.getBlockCenterPos(secondBlock.row, secondBlock.col, blockWidth, blockHeight, startX, startY);
              
              draw.drawBlockPath(boardContext, firstBlockCenterPos.x, firstBlockCenterPos.y, secondBlockCenterPos.x, secondBlockCenterPos.y);
            }
          } else if (selectedBlocks.length > 3) {
            const firstBlock = calculate.decodeId(selectedBlocks[selectedBlocks.length - 2]);
            const firstBlockCenterPos = calculate.getBlockCenterPos(firstBlock.row, firstBlock.col, blockWidth, blockHeight, startX, startY);
            const secondBlock = calculate.decodeId(selectedBlocks[selectedBlocks.length - 1]);
            const secondBlockCenterPos = calculate.getBlockCenterPos(secondBlock.row, secondBlock.col, blockWidth, blockHeight, startX, startY);
            
            draw.drawBlockPath(boardContext, firstBlockCenterPos.x, firstBlockCenterPos.y, secondBlockCenterPos.x, secondBlockCenterPos.y);
          }
        }
      }
    }, false);

    boardCanvas.addEventListener("touchstart", function (e) {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      boardCanvas.dispatchEvent(mouseEvent);
    });

    boardCanvas.addEventListener("touchend", function (e) {
      e.preventDefault();
      var mouseEvent = new MouseEvent("mouseup", {});
      boardCanvas.dispatchEvent(mouseEvent);
    }, false);

    boardCanvas.addEventListener("touchmove", function (e) {
      e.preventDefault();
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      boardCanvas.dispatchEvent(mouseEvent);
    }, false);
  }
}

main.init();
game.start();