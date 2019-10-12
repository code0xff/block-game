let gameMode = 1; // game mode: 0 (start), 1 (puzzle), 2 (middle term), 3 (arcade)
let time = 100;

let canvas;
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

let characterSize;
let timer;

const BlockTypes = [
  '#ffffff', // empty (void)
  '#F4FA58', // yello (light)
  '#555555', // black (darkness)
  '#FF4000', // red (fire)
  '#008CBA', // blue (ice)
  '#4CAF50'  // green (earth)
];

const energy = [ 
  { value: 0, x: 0, y: 0 },
  { value: 0, x: 0, y: 0 },
  { value: 0, x: 0, y: 0 },
  { value: 0, x: 0, y: 0 },
  { value: 0, x: 0, y: 0 },
  { value: 0, x: 0, y: 0 }
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
    characterSize = blockWidth * 2;

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
        draw.removeBlock(context, removeBlockPos.x, removeBlockPos.y, blockWidth, blockHeight);
        boardArray[removeBlock.row][removeBlock.col] = { type: parseInt(Math.random() * (blockTypeSize - 1)) + 1 };
        draw.drawRoundedRect(context, removeBlockPos.x, removeBlockPos.y, blockWidth, blockHeight, blockWidth / 4, 
          BlockTypes[boardArray[removeBlock.row][removeBlock.col].type], 'fill');
        draw.drawRoundedRect(context, removeBlockPos.x, removeBlockPos.y, blockWidth, blockHeight, blockWidth / 4, '#000000', 'stroke');
      }
      energy[energyType].value += sumOfEnergy;
      text.remove(energyType);
      text.energy(energy[energyType].value, energy[energyType].x, energy[energyType].y, energyType);
    }
    startBlock = null;
    selectedBlocks = [];
  }
}

const image = {
  drawWizard: function() {
    draw.drawImage(context, 
      parseInt(canvas.width / 2) - parseInt(characterSize / 2), parseInt(canvas.width / 2) - parseInt(characterSize / 2), 
      characterSize, characterSize, 
      "assets/green_wizard2_front-48px.png");
  },
  drawWizardBack: function() {
    draw.drawImage(context, parseInt(boardWidth / 2) - blockWidth, boardWidth + blockHeight, characterSize, characterSize, "assets/green_wizard_back-48px.png");
  }
}

const text = {
  title: function() {
    draw.removeText(context, startX, blockHeight, boardWidth, blockHeight);
    draw.drawText(context, "Gather Elemental Energy..." + time, startX, blockHeight, fontSize, "sans-serif", "#ffffff");
  },
  remove: function(type) {
    let removeWidth = (parseInt(Math.log10(energy[type].value)) + 1) * fontSize;
    let removeHeight = fontSize;
    draw.removeText(context, energy[type].x, energy[type].y, removeWidth, removeHeight);
  },
  energy: function(value, x, y, type) {
    draw.drawText(context, value, x, y, fontSize, "sans-serif", BlockTypes[type]);
  },
  initEnergy: function() {
    energy[1].x = startX + blockWidth;
    energy[1].y = boardHeight + (2 * blockHeight);
    energy[2].x = startX + blockWidth;
    energy[2].y = boardHeight + (3 * blockHeight);
    energy[3].x = startX + (blockWidth * 3);
    energy[3].y = boardHeight + (4 * blockHeight);
    energy[4].x = startX + (blockWidth * 5);
    energy[4].y = boardHeight + (2 * blockHeight);
    energy[5].x = startX + (blockWidth * 5);
    energy[5].y = boardHeight + (3 * blockHeight);

    for (let i = 1; i < energy.length; i++) {
      draw.drawText(context, energy[i].value, energy[i].x, energy[i].y, fontSize, "sans-serif", BlockTypes[i]);
    }
  },
  midtermText: function() {
    draw.drawText(context, "You're finally ready to fight...", startX, blockHeight, fontSize, "sans-serif", "#ffffff");
    energy[1].x = parseInt(canvas.width / 5);
    energy[2].x = parseInt(canvas.width / 5);
    energy[3].x = parseInt(canvas.width / 2);
    energy[4].x = parseInt(canvas.width / 5) * 4;
    energy[5].x = parseInt(canvas.width / 5) * 4;

    energy[1].y = parseInt(canvas.width / 8) * 3;
    energy[2].y = parseInt(canvas.width / 8) * 5;
    energy[3].y = parseInt(canvas.width / 4);
    energy[4].y = parseInt(canvas.width / 8) * 3;
    energy[5].y = parseInt(canvas.width / 8) * 5;
    for (let i = 1; i < energy.length; i++) {
      draw.drawText(context, energy[i].value, energy[i].x, energy[i].y, fontSize, "sans-serif", BlockTypes[i]);
    }
    draw.drawText(context, "Please tab screen...", startX, canvas.width, fontSize, "sans-serif", "#ffffff");
  }
}

const game = {
  startPuzzle: function () {
    board.initBoard();
    board.setBlocksOnBoard();
    board.drawBoard();
    image.drawWizardBack();

    text.title();
    timer = setInterval(function() {
      time -= 1;
      if (time >= 0) {
        text.title();
      } else {
        game.endPuzzle();
      }
    }, 1000);
    text.initEnergy();
  },
  endPuzzle: function() {
    gameMode = 2;
    clearInterval(timer);
    board.resolve();
    draw.removeAll(canvas);
    game.midtermStart();
  },
  midtermStart: function() {
    image.drawWizard();
    text.midtermText();
  }
}

const main = {
  init: function() {
    canvas =  document.getElementById("canvas");
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
    boardWidth = canvas.width;
    boardHeight = canvas.width;

    context = canvas.getContext("2d");

    canvas.addEventListener("mousedown", function (e) {
      if (gameMode === 1) {
        if (selectedBlocks.length !== 0) {
          board.resolve();
        } else {
          const pos = calculate.getMousePos(canvas, e);
          startBlock = calculate.getSelectedBlock(pos, blockWidth, blockHeight, startX, startY, option.rowSize, option.colSize);
          if (startBlock.row !== -1 && startBlock.col !== -1 && boardArray[startBlock.row][startBlock.col].type > 0) {
            selectedBlocks.push(startBlock.row + '' + startBlock.col);
          }
        }
      } else if (gameMode === 2) {
        draw.removeAll(canvas);
      }
    }, false);

    canvas.addEventListener("mouseup", function (e) {
      if (gameMode === 1) {
        board.resolve();
      }
    }, false);

    canvas.addEventListener("mouseout", function (e) {
      if (gameMode === 1) {
        board.resolve();
      }
    }, false);

    canvas.addEventListener("mousemove", function (e) {
      if (gameMode === 1) {
        const pos = calculate.getMousePos(canvas, e);
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
                
                draw.drawBlockPath(context, firstBlockCenterPos.x, firstBlockCenterPos.y, secondBlockCenterPos.x, secondBlockCenterPos.y, parseInt(blockWidth / 5) * 2);
              }
            } else if (selectedBlocks.length > 3) {
              const firstBlock = calculate.decodeId(selectedBlocks[selectedBlocks.length - 2]);
              const firstBlockCenterPos = calculate.getBlockCenterPos(firstBlock.row, firstBlock.col, blockWidth, blockHeight, startX, startY);
              const secondBlock = calculate.decodeId(selectedBlocks[selectedBlocks.length - 1]);
              const secondBlockCenterPos = calculate.getBlockCenterPos(secondBlock.row, secondBlock.col, blockWidth, blockHeight, startX, startY);
              
              draw.drawBlockPath(context, firstBlockCenterPos.x, firstBlockCenterPos.y, secondBlockCenterPos.x, secondBlockCenterPos.y, parseInt(blockWidth / 5) * 2);
            }
          }
        }
      }
    }, false);

    canvas.addEventListener("touchstart", function (e) {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener("touchend", function (e) {
      e.preventDefault();
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchmove", function (e) {
      e.preventDefault();
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchcancel", function (e) {
      e.preventDefault();
      var mouseEvent = new MouseEvent("mouseout", {});
      canvas.dispatchEvent(mouseEvent);
    }, false);
  }
}

main.init();
game.startPuzzle();
