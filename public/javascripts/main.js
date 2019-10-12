let gameMode = 0; // game mode: 0 (start), 1 (puzzle), 2 (arcade)
let time = 180;

let energy = [ 0, 0, 0, 0, 0, 0 ];

let boardCanvas;
let context;
let boardWidth;
let boardHeight;
let fontSize;

const option = {
  rowSize: 7,
  colSize: 7
}

const boardArray = [];
let blockWidth;
let blockHeight;
let startX;
let startY;

const BlockTypes = [
  '#ffffff', // empty (void)
  '#F4FA58', // yello (light)
  '#555555', // black (darkness)
  '#FF4000', // red (fire)
  '#008CBA', // blue (ice)
  '#4CAF50'  // green (earth)
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
  drawBoard: function() {
    blockWidth = parseInt(boardWidth / (option.colSize + 1));
    blockHeight = parseInt(boardHeight / (option.rowSize + 1));

    fontSize = parseInt(blockHeight / 2);

    startX = parseInt((boardWidth - (blockWidth * option.colSize)) / 2);
    startY = parseInt((boardHeight - (blockHeight * option.rowSize)) / 2) + blockHeight;

    let x = startX;
    let y = startY;

    for (let i = 0; i < option.rowSize; i++) {
      for (let j = 0; j < option.colSize; j++) {
        draw.drawRoundedRect(context, x, y, blockWidth, blockHeight, blockWidth / 4, BlockTypes[boardArray[i][j].type], 'fill');
        draw.drawRoundedRect(context, x, y, blockWidth, blockHeight, blockWidth / 4, '#000000', 'stroke');
        x += blockWidth;
      }
      x = startX;
      y += blockHeight;
    }
  },
  resolve: function() {
    if (selectedBlocks.length > 2) {
      const blockTypeSize = BlockTypes.length;
      let sumOfEnergy = 0;
      let energyType = boardArray[startBlock.row][startBlock.col].type;
      for (let i = 0; i < selectedBlocks.length; i++) {
        const removeBlock = calculate.decodeId(selectedBlocks[i]);
        boardArray[removeBlock.row][removeBlock.col].type = 0;
        const removeBlockPos = calculate.getBlockStartPos(removeBlock.row, removeBlock.col, blockWidth, blockHeight, startX, startY);
        sumOfEnergy += (i + 1);
        setTimeout(function(){
          draw.removeBlock(context, removeBlockPos.x, removeBlockPos.y, blockWidth, blockHeight);
          boardArray[removeBlock.row][removeBlock.col] = { type: parseInt(Math.random() * (blockTypeSize - 1)) + 1 };
          draw.drawRoundedRect(context, removeBlockPos.x, removeBlockPos.y, blockWidth, blockHeight, blockWidth / 4, 
            BlockTypes[boardArray[removeBlock.row][removeBlock.col].type], 'fill');
          draw.drawRoundedRect(context, removeBlockPos.x, removeBlockPos.y, blockWidth, blockHeight, blockWidth / 4, '#000000', 'stroke');
        }, 50 * i);
      }
      energy[energyType] += sumOfEnergy;
      console.log(energy);
    }
    startBlock = null;
    selectedBlocks = [];
  }
}

const image = {
  drawWizard: function() {
    draw.drawImage(context, parseInt(boardWidth / 2) - blockWidth, boardWidth + blockHeight, 96, 96, "assets/green_wizard_back-48px.png");
  }
}

const text = {
  title: function() {
    draw.drawText(context, "Gain Elemental Energy...", startX, blockHeight, "", fontSize + "px", "cursive");
  }
}

const game = {
  start: function () {
    board.initBoard();
    board.setBlocksOnBoard();
    board.drawBoard();
    image.drawWizard();
    text.title();
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
    boardHeight = boardCanvas.width;

    context = boardCanvas.getContext("2d");

    boardCanvas.addEventListener("mousedown", function (e) {
      if (selectedBlocks.length !== 0) {
        board.resolve();
      } else {
        const pos = calculate.getMousePos(boardCanvas, e);
        startBlock = calculate.getSelectedBlock(pos, blockWidth, blockHeight, startX, startY, option.rowSize, option.colSize);
        if (startBlock.row !== -1 && startBlock.col !== -1 && boardArray[startBlock.row][startBlock.col].type > 0) {
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
              
              draw.drawBlockPath(context, firstBlockCenterPos.x, firstBlockCenterPos.y, secondBlockCenterPos.x, secondBlockCenterPos.y);
            }
          } else if (selectedBlocks.length > 3) {
            const firstBlock = calculate.decodeId(selectedBlocks[selectedBlocks.length - 2]);
            const firstBlockCenterPos = calculate.getBlockCenterPos(firstBlock.row, firstBlock.col, blockWidth, blockHeight, startX, startY);
            const secondBlock = calculate.decodeId(selectedBlocks[selectedBlocks.length - 1]);
            const secondBlockCenterPos = calculate.getBlockCenterPos(secondBlock.row, secondBlock.col, blockWidth, blockHeight, startX, startY);
            
            draw.drawBlockPath(context, firstBlockCenterPos.x, firstBlockCenterPos.y, secondBlockCenterPos.x, secondBlockCenterPos.y);
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

    boardCanvas.addEventListener("touchcancel", function (e) {
      e.preventDefault();
      var mouseEvent = new MouseEvent("mouseout", {});
      boardCanvas.dispatchEvent(mouseEvent);
    }, false);
  }
}

main.init();
game.start();
