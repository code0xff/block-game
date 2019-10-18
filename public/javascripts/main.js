let time = 180;

let canvas;
let context;
let gameWidth;
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

const character = {
  x: 0,
  y: 0,
  size: 0,
  mp: 0,
  maxMp: 100
}

let timer;
let timerX;
let timerY;

let selectedEnemy = { type: 0, image: 'void', hp: 0 };

let hpBarWidth;
const hpBarHeight = 5;
let mpBarWidth;
const mpBarHeight = 5;

let pathWidth;

const animationTime = 300;

let score = 0;
let endMessageX;
let endMessageY;

const BlockTypes = [
  '#ffffff', // empty (void)
  '#F4FA58', // yello (light)
  '#555555', // black (darkness)
  '#FF4000', // red (fire)
  '#008CBA', // blue (ice)
  '#4CAF50'  // green (earth)
];

const EffectTypes = [
  { type: 0, image: 'void' },
  { type: 1, image: 'light' },
  { type: 2, image: 'dark' },
  { type: 3, image: 'fire' },
  { type: 4, image: 'ice' },
  { type: 5, image: 'earth' },
];

const EnemyTypes = [
  { type: 0, image: 'void', hp: 0, critical: [], immune: [] },
  { type: 1, image: 'light', hp: 150, critical: [2], immune: [1] },
  { type: 2, image: 'dark', hp: 150, critical: [1], immune: [2] },
  { type: 3, image: 'fire', hp: 150, critical: [4], immune: [5] },
  { type: 4, image: 'ice', hp: 150, critical: [5], immune: [3] },
  { type: 5, image: 'earth', hp: 150, critical: [3], immune: [4] }
];

let startBlock;
let selectedBlocks = [];

const wizard = {
  ready: function() {
    draw.removeImage(context, character.x, character.y, character.size, character.size);
    image.wizard("green_wizard_left2");
  },
  attack: function() {
    draw.removeImage(context, character.x, character.y, character.size, character.size);
    image.wizard("green_wizard_left");
    setTimeout(function() {
      wizard.ready();
    }, animationTime);
  },
  mana: function() {
    const displayedMp = parseInt(mpBarWidth * (character.mp / character.maxMp));
    draw.removeEnergyBar(context, 0, hpBarHeight, mpBarWidth, mpBarHeight);
    draw.drawEnergyBar(context, 0, hpBarHeight, mpBarWidth, displayedMp, mpBarHeight, "#0000ff");
  },
  magic: function() {
    if (character.mp >= character.maxMp) {
      character.mp = 0;
      wizard.mana();
      board.setBlocksOnBoard();
      board.drawBoard();
      draw.removeImage(context, character.x, character.y, character.size, character.size);
      image.wizard("green_wizard2_front");
      setTimeout(function() {
        wizard.ready();
      }, animationTime);
    }
  }
}

const enemy = {
  x: 0,
  y: 0,
  create: function() {
    const enemyType = parseInt(Math.random() * (EnemyTypes.length - 1)) + 1;
    selectedEnemy.type = enemyType;
    selectedEnemy.image = EnemyTypes[enemyType].image;
    selectedEnemy.hp = EnemyTypes[enemyType].hp;
    image.enemy(selectedEnemy.image);
    image.enemyHp(EnemyTypes[enemyType].hp, selectedEnemy.hp);
  },
  damage: function(type, value) {
    if (EnemyTypes[selectedEnemy.type].critical.indexOf(type) !== -1) {
      value *= 2;
    } else if (EnemyTypes[selectedEnemy.type].immune.indexOf(type) !== -1) {
      value = parseInt(value / 2);
    }
    selectedEnemy.hp -= value;
    if (selectedEnemy.hp > 0) {
      image.enemyHp(EnemyTypes[type].hp, selectedEnemy.hp);
      image.effect(EffectTypes[type].image, EnemyTypes[selectedEnemy.type].image);
    } else {
      character.mp += (-selectedEnemy.hp);
      if (character.mp > character.maxMp) {
        character.mp = character.maxMp;
      }
      wizard.mana();
      draw.removeImage(context, enemy.x, enemy.y, character.size, character.size);
      score += 1;
      enemy.create();
    }
  }
}

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
    if (selectedBlocks.length === 2) {
      for (let i = 0; i < selectedBlocks.length; i++) {
        const removeBlock = calculate.decodeId(selectedBlocks[i]);
        const removeBlockPos = calculate.getBlockStartPos(removeBlock.row, removeBlock.col, blockWidth, blockHeight, startX, startY);
        draw.removeBlock(context, removeBlockPos.x, removeBlockPos.y, blockWidth, blockHeight);
        draw.drawRoundedRect(context, removeBlockPos.x, removeBlockPos.y, blockWidth, blockHeight, blockWidth / 4, 
          BlockTypes[boardArray[removeBlock.row][removeBlock.col].type], 'fill');
        draw.drawRoundedRect(context, removeBlockPos.x, removeBlockPos.y, blockWidth, blockHeight, blockWidth / 4, '#000000', 'stroke');
      }
    } else if (selectedBlocks.length > 2) {
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
      wizard.attack();
      enemy.damage(energyType, sumOfEnergy);
    }
    startBlock = null;
    selectedBlocks = [];
  }
}

const text = {
  time: function() {
    draw.removeText(context, 0, timerY, boardWidth, fontSize);
    draw.drawText(context, time + " second(s) left...", timerX, timerY, fontSize, "sans-serif", "#ffffff");
  }
}

const image = {
  button: function() {

  },
  wizard: function(image) {
    draw.drawImage(context, character.x, character.y, character.size, character.size, "assets/" + image + "-48px.png");
  },
  enemy: function(image) {
    draw.drawImage(context, enemy.x, enemy.y, character.size, character.size, "assets/" + image + "-48px.png");
  },
  enemyHp: function(fullHp, hp) {
    const displayedHp = parseInt(hpBarWidth * (hp / fullHp));
    draw.removeEnergyBar(context, 0, 0, hpBarWidth, hpBarHeight);
    draw.drawEnergyBar(context, 0, 0, hpBarWidth, displayedHp, hpBarHeight, "#ff0000");
  },
  effect: function(effectImage, enemyImage) {
    draw.drawImage(context, enemy.x, enemy.y, character.size, character.size, "assets/" + effectImage + "-effect-48px.png");
    setTimeout(function() {
      draw.removeImage(context, enemy.x, enemy.y, character.size, character.size);
      draw.drawImage(context, enemy.x, enemy.y, character.size, character.size, "assets/" + enemyImage + "-48px.png");
    }, animationTime);
  },
  endWizard: function() {
    draw.drawImage(context, parseInt((gameWidth - character.size) / 2), character.y, character.size, character.size, "assets/green_wizard2_front-48px.png");
  }
}

const game = {
  mode: 1, // game mode: 0 (start), 1 (puzzle), 2 (end)
  menu: function() {

  },
  start: function () {
    board.initBoard();
    board.setBlocksOnBoard();
    board.drawBoard();
    wizard.mana();
    wizard.ready();
    enemy.create();

    text.time();
    timer = setInterval(function() {
      time -= 1;
      if (time >= 0) {
        text.time();
      } else {
        game.end();
      }
    }, 1000);
  },
  end: function() {
    game.mode = 2;
    clearInterval(timer);
    board.resolve();

    setTimeout(function() {
      draw.removeAll(canvas);
      image.endWizard();
      draw.drawText(context, "You've defeated " + score + " monsters...", endMessageX, endMessageY, fontSize,"sans-serif", "#ffffff");
      draw.drawText(context, "Very well...", endMessageX, endMessageY + fontSize, fontSize, "sans-serif", "#ffffff");
    }, 1000);
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

    main.setSize();
   
    context = canvas.getContext("2d");

    canvas.addEventListener("mousedown", function (e) {
      if (game.mode === 1) {
        if (selectedBlocks.length !== 0) {
          board.resolve();
        } else {
          const pos = calculate.getMousePos(canvas, e);
          if (pos.x >= startX && pos.x <= boardWidth - startX && pos.y >= startY && pos.y <= startY + boardHeight) {
            startBlock = calculate.getSelectedBlock(pos, blockWidth, blockHeight, startX, startY, option.rowSize, option.colSize);
            if (startBlock.row !== -1 && startBlock.col !== -1 && boardArray[startBlock.row][startBlock.col].type > 0) {
              selectedBlocks.push(startBlock.row + '' + startBlock.col);
            }
          } else if (pos.x >= character.x && pos.x <= character.x + character.size && pos.y >= character.y &&  pos.y <= character.y + character.size) {
            wizard.magic();
          }
        }
      }
    }, false);

    canvas.addEventListener("mouseup", function (e) {
      if (game.mode === 1) {
        board.resolve();
      }
    }, false);

    canvas.addEventListener("mouseout", function (e) {
      if (game.mode === 1) {
        board.resolve();
      }
    }, false);

    canvas.addEventListener("mousemove", function (e) {
      if (game.mode === 1) {
        const pos = calculate.getMousePos(canvas, e);
        const blockOnPath = calculate.getSelectedBlock(pos, blockWidth, blockHeight, startX, startY, option.rowSize, option.colSize);
        if (blockOnPath.row !== -1 && blockOnPath.col !== -1 && boardArray[blockOnPath.row][blockOnPath.col].type !== 0
          && selectedBlocks.indexOf(calculate.createId(blockOnPath.row, blockOnPath.col)) === -1 && selectedBlocks.length !== 0) {
          const prevBlock = calculate.decodeId(selectedBlocks[selectedBlocks.length - 1]);
          if (Math.abs(parseInt(prevBlock.row - blockOnPath.row)) <= 1 && Math.abs(parseInt(prevBlock.col - blockOnPath.col)) <= 1 
          && boardArray[prevBlock.row][prevBlock.col].type === boardArray[blockOnPath.row][blockOnPath.col].type) {
            selectedBlocks.push(blockOnPath.row + '' + blockOnPath.col);
            if (selectedBlocks.length === 2) {
              const firstBlock = calculate.decodeId(selectedBlocks[0]);
              const firstBlockCenterPos = calculate.getBlockCenterPos(firstBlock.row, firstBlock.col, blockWidth, blockHeight, startX, startY);
              const secondBlock = calculate.decodeId(selectedBlocks[1]);
              const secondBlockCenterPos = calculate.getBlockCenterPos(secondBlock.row, secondBlock.col, blockWidth, blockHeight, startX, startY);
              
              draw.drawBlockPath(context, firstBlockCenterPos.x, firstBlockCenterPos.y, secondBlockCenterPos.x, secondBlockCenterPos.y, pathWidth);
            } else if (selectedBlocks.length >= 3) {
              const firstBlock = calculate.decodeId(selectedBlocks[selectedBlocks.length - 2]);
              const firstBlockCenterPos = calculate.getBlockCenterPos(firstBlock.row, firstBlock.col, blockWidth, blockHeight, startX, startY);
              const secondBlock = calculate.decodeId(selectedBlocks[selectedBlocks.length - 1]);
              const secondBlockCenterPos = calculate.getBlockCenterPos(secondBlock.row, secondBlock.col, blockWidth, blockHeight, startX, startY);
              
              draw.drawBlockPath(context, firstBlockCenterPos.x, firstBlockCenterPos.y, secondBlockCenterPos.x, secondBlockCenterPos.y, pathWidth);
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
  },
  setSize: function() {
    gameWidth = canvas.width;
    boardWidth = canvas.width;
    boardHeight = canvas.width;
    hpBarWidth = canvas.width;
    mpBarWidth = canvas.width;

    blockWidth = parseInt(boardWidth / (option.colSize + 1));
    blockHeight = parseInt(boardHeight / (option.rowSize + 1));

    fontSize = parseInt(blockHeight / 2);
    character.size = blockWidth * 2;

    startX = parseInt((boardWidth - (blockWidth * option.colSize)) / 2);
    startY = parseInt((boardHeight - (blockHeight * option.rowSize)) / 2) + character.size + parseInt(blockHeight / 2);

    character.x = startX;
    character.y = startX;

    enemy.x = boardWidth - character.size - startX;
    enemy.y = startX;

    timerX = startX;
    timerY = boardHeight + character.size + blockHeight;

    pathWidth = parseInt(blockWidth / 5) * 2;

    endMessageX = startX;
    endMessageY = character.y + character.size + (2 * fontSize);
  }
}

main.init();
game.start();
