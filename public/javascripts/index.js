function init() {
  const canvas = document.getElementById("canvas");
  resize(canvas);
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.rect(10, 10, 50, 50);
  ctx.stroke();
}

const resize = (canvas) => {
  const displayWidth  = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
 
  if (canvas.width  !== displayWidth || canvas.height !== displayHeight) {
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}