let boardCanvas;
let boardContext;
let boardWidth;
let boardHeight;

const option = {
  rowSize: 10,
  colSize: 10
}

const boardArray = [];
let blockWidth;
let blockHeight;
let startX;
let startY;

const BlockTypes = [
  '#ffffff', // empty
  '#F4FA58', // yello
  '#FF4000', // red
  '#4CAF50', // green
  '#008CBA', // blue
  '#AC58FA', // purple
  '#555555' // black
];

let seletedBlock;

const board = {
  initBoard: function () {
    console.log('init board');
    for (var i = 0; i < option.rowSize; i++) {
      boardArray[i] = [];
      for (var j = 0; j < option.colSize; j++) {
        boardArray[i][j] = { type: 0 };
      }
    }
    console.log(boardArray);
  },
  setBlocksOnBoard: function() {
    console.log('setBlocksOnBoard');
    const blockTypeSize = BlockTypes.length;
    for (var i = 0; i < option.rowSize; i++) {
      boardArray[i] = [];
      for (var j = 0; j < option.colSize; j++) {
        boardArray[i][j] = { type: parseInt(Math.random() * (blockTypeSize - 1)) + 1 };
      }
    }
    console.log(boardArray);
  },
  draw: function() {
    console.log('draw');
    blockWidth = parseInt((boardWidth - 20) / option.colSize);
    blockHeight = parseInt((boardHeight - 20) / option.rowSize);
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
      const pos = calculate.getMousePos(boardCanvas, e);
      selectedBlock = calculate.getSelectedBlock(pos, blockWidth, blockHeight, startX, startY, option.rowSize, option.colSize);
    }, false);

    boardCanvas.addEventListener("mouseup", function (e) {
      selectedBlock = null;
    }, false);

    boardCanvas.addEventListener("mousemove", function (e) {
      const pos = calculate.getMousePos(boardCanvas, e);
      const blockOnPath = calculate.getSelectedBlock(pos, blockWidth, blockHeight, startX, startY, option.rowSize, option.colSize);
      console.log(blockOnPath);
    }, false);

    boardCanvas.addEventListener("touchstart", function (e) {
      e.preventDefault();
      const pos = calculate.getTouchPos(boardCanvas, e);
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