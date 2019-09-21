const app = {
  init: function() {
    const boardCanvas = document.getElementById("board");
    this.resize(boardCanvas);
    
    const boardContext = boardCanvas.getContext("2d");
    game.start(boardCanvas, boardContext, boardCanvas.width, boardCanvas.height);
  },
  resize: function(boardCanvas) {
    const displayWidth  = boardCanvas.clientWidth;
    const displayHeight = boardCanvas.clientHeight;
    
    if (boardCanvas.width  !== displayWidth || boardCanvas.height !== displayHeight) {
      boardCanvas.width  = displayWidth;
      boardCanvas.height = displayHeight;
    }
  }
}