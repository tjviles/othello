var ctx;
var ctx2;
var index;

var b1 = new Image();
b1.src = 'black1.png';

var state = {
  action: 'idle',
  over: false,
  turn: 'b',
  hoverValid: false,
  board: [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'w', 'b', null, null, null],
    [null, null, null, 'b', 'w', null, null, null],
    [null, null, null, null, null, null, null,null],
    [null, null, null, null, null, null, null,null],
    [null, null, null, null, null, null, null, null],
  ],
  captures: {w: 0, b: 0}
}

function renderTile(piece, x, y) {
  ctx.beginPath();
  if(state.board[y][x].charAt(0) === 'w') {
    ctx.fillStyle = '#fff';
    ctx.arc(x*125+63, y*125+63, 50, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.drawImage(b1, x*125 + 20, y*125 + 20);
  }

  // TODO: Add a crown for kings
}


function renderSquare(x,y) {
    ctx.fillStyle = '#0f5109';
    ctx.strokeStyle = '#fff';
    ctx.fillRect(x*125, y*125, 125, 125);
    ctx.strokeRect(x*125, y*125, 125, 125);
    if(state.board[y][x]) {
      renderTile(state.board[y][x], x, y);
    }
  }

function renderBoard() {
  if(!ctx) return;
  for(var y = 0; y < 8; y++) {
    for(var x = 0; x < 8; x++) {
      renderSquare(x, y);
    }
  }
}

function renderStatus(){
  if(!ctx2) return;
  ctx2.clearRect(0,0,1000,200);
  ctx2.font = '48px serif';
  var score = updateScore();
  var t;
  if(state.turn === 'b'){
    v = "BLACK!";
    var test = document.getElementById("test");
    test.style.border = '20px solid #000';
  }
  else{
    v = "WHITE!";
    var test = document.getElementById("test");
    test.style.border = '20px solid #faebd7';
  }

  if(state.over){
    if(score.black > score.white){
      ctx2.fillText("BLACK WINS!!!"  + v, 10, 50);
    }
    else{
      ctx2.fillText("WHITE WINS!!!"  + v, 10, 50);
    }
  }
  else{
    ctx2.fillText("Turn is "  + v, 10, 50);
  }
  ctx2.fillText("Black: " + score.black + "  White: " + score.white, 600, 50);
}

function handleMouseMove(event) {
  renderBoard();
  renderStatus();
  switch(state.action) {
    case 'idle':
      hoverOverTile(event);
      break;
  }
}

function hoverOverTile(event) {
  // Make sure we have a canvas context to render to
  if(!ctx) return;
  // Clear any other highlights
  renderBoard();
  renderStatus();
  var x = Math.floor(event.offsetX / 62.5);
  var y = Math.floor(event.offsetY / 62.5);
  //console.log(x,y);
  // Adjust for scrolling
  // Avoid array out-of-bounds issues.
  if(x < 0 || y < 0 || x > 7 || y > 7) return;
  // Check to see if there is an opposite color piece anywhere around us and push all of them into an arry
  var proxarray = [];
  proxarray = checkProxRefactor(state.turn, x, y);
  //If any were found (spot 0 not empty), proceed
  if(proxarray[0]) {
    //For each direction found
    proxarray.forEach(function (prox){
      switch(prox.dir){
        case "upleft":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkUpLeft(state.turn, x, y);
          if(dirCheck.found){
            ctx.strokeWidth = 15;
            ctx.strokeStyle = "yellow";
            ctx.beginPath();
            ctx.arc(x*125+62.5, y*125+62.5, 50, 0, Math.PI * 2);
            ctx.stroke();
          }
        break;
        case "up":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkUp(state.turn, x, y);
          if(dirCheck.found){
            ctx.strokeWidth = 15;
            ctx.strokeStyle = "yellow";
            ctx.beginPath();
            ctx.arc(x*125+62.5, y*125+62.5, 50, 0, Math.PI * 2);
            ctx.stroke();
          }
        break;
        case "upright":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkUpRight(state.turn, x, y);
          if(dirCheck.found){
            ctx.strokeWidth = 15;
            ctx.strokeStyle = "yellow";
            ctx.beginPath();
            ctx.arc(x*125+62.5, y*125+62.5, 50, 0, Math.PI * 2);
            ctx.stroke();
          }
        break;
        case "left":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkLeft(state.turn, x, y);
          if(dirCheck.found){
            ctx.strokeWidth = 15;
            ctx.strokeStyle = "yellow";
            ctx.beginPath();
            ctx.arc(x*125+62.5, y*125+62.5, 50, 0, Math.PI * 2);
            ctx.stroke();
          }
        break;
        case "right":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkRight(state.turn, x, y);
          if(dirCheck.found){
            ctx.strokeWidth = 15;
            ctx.strokeStyle = "yellow";
            ctx.beginPath();
            ctx.arc(x*125+62.5, y*125+62.5, 50, 0, Math.PI * 2);
            ctx.stroke();
          }
        break;
        case "downleft":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkDownLeft(state.turn, x, y);
          if(dirCheck.found){
            ctx.strokeWidth = 15;
            ctx.strokeStyle = "yellow";
            ctx.beginPath();
            ctx.arc(x*125+62.5, y*125+62.5, 50, 0, Math.PI * 2);
            ctx.stroke();
          }
        break;
        case "down":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkDown(state.turn, x, y);
          if(dirCheck.found){
            ctx.strokeWidth = 15;
            ctx.strokeStyle = "yellow";
            ctx.beginPath();
            ctx.arc(x*125+62.5, y*125+62.5, 50, 0, Math.PI * 2);
            ctx.stroke();
          }
        break;
        case "downright":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkDownRight(state.turn, x, y);
          if(dirCheck.found){
            ctx.strokeWidth = 15;
            ctx.strokeStyle = "yellow";
            ctx.beginPath();
            ctx.arc(x*125+62.5, y*125+62.5, 50, 0, Math.PI * 2);
            ctx.stroke();
          }
        break;

      }
    });
  }
}
function handleMouseDown(event) {
  var x = Math.floor(event.offsetX / 62.5);
  var y = Math.floor(event.offsetY / 62.5);
  // Check to see if there is an opposite color piece anywhere around us and push all of them into an arry
  var proxarray = [];
  var turnflag = false;
  proxarray = checkProxRefactor(state.turn, x, y);
  //If any were found (spot 0 not empty), proceed
  if(proxarray[0]){
    proxarray.forEach(function (prox){
      switch(prox.dir){
        case "upleft":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkUpLeft(state.turn, x, y);
          if(dirCheck.found){
            turnflag = true;
            flipUpLeft(state.turn, x, y, dirCheck.y);
            state.board[y][x] = state.turn;
          }
        break;
        case "up":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkUp(state.turn, x, y);
          if(dirCheck.found){
            turnflag = true;
            flipUp(state.turn, x, y, dirCheck.y);
            state.board[y][x] = state.turn;
          }
        break;
        case "upright":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkUpRight(state.turn, x, y);
          if(dirCheck.found){
            turnflag = true;
            flipUpRight(state.turn, x, y, dirCheck.y);
            state.board[y][x] = state.turn;
          }
        break;
        case "left":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkLeft(state.turn, x, y);
          if(dirCheck.found){
            turnflag = true;
            flipLeft(state.turn, x, y, dirCheck.x);
            state.board[y][x] = state.turn;
          }
        break;
        case "right":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkRight(state.turn, x, y);
          if(dirCheck.found){
            turnflag = true;
            flipRight(state.turn, x, y, dirCheck.x);
            state.board[y][x] = state.turn;
          }
        break;
        case "downleft":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkDownLeft(state.turn, x, y);
          if(dirCheck.found){
            turnflag = true;
            flipDownLeft(state.turn, x, y, dirCheck.y);
            state.board[y][x] = state.turn;
          }
        break;
        case "down":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkDown(state.turn, x, y);
          if(dirCheck.found){
            turnflag = true;
            flipDown(state.turn, x, y, dirCheck.y);
            state.board[y][x] = state.turn;
          }
        break;
        case "downright":
          //check if it is a valid placement, if so highlight the square currently moused over
          var dirCheck = checkDownRight(state.turn, x, y);
          if(dirCheck.found){
            turnflag = true;
            flipDownRight(state.turn, x, y, dirCheck.y);
            state.board[y][x] = state.turn;
          }
        break;
      }
    });

    }
  if(turnflag){
    endOfTurnCheck();
  }
  renderBoard();
  renderStatus();
  //TODO add turn display functionality
  //TODO write function to check if next turn has any possible moves at all (oof) iterate through the whole array
  //and check for moves at all of the pieces on the board
}

function endOfTurnCheck(){
  if(state.turn === 'w'){
    state.turn = 'b';
  }
  else{
    state.turn = 'w';
  }
  if(checkPossibleMoves()){
    console.log(state.turn + " can move");
  }
  else{
    console.log(state.turn + " can NOT move");
    if(state.turn === 'w'){
      state.turn = 'b';
    }
    else{
      state.turn = 'w';
    }
    if(checkPossibleMoves()){
      console.log(state.turn + " can move");
    }
    else{
        state.over = true;
      
    }
  }
}

function setup() {
  var canvas = document.getElementById("test");
  var canvas2 = document.getElementById("thing");
  canvas.width = 1000;
  canvas.height = 1000;
  canvas2.width = 1000;
  canvas2.height = 200;
  canvas.onmousemove = handleMouseMove;
  canvas.onmousedown = handleMouseDown;
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  ctx2 = canvas2.getContext('2d');
  setTimeout(renderBoard, 100);
  renderStatus();
}

function flipUp(piece, x, y, target){
  var j = y - 1;
  while(j > 0 && j > target){
    state.board[j][x] = piece;
    j--;
  }
}

function flipUpLeft(piece, x, y, target){
  var j = y - 1;
  var i = x - 1;
  while(j > 0 && j > target){
    state.board[j][i] = piece;
    j--;
    i--;
  }
}

function flipUpRight(piece, x, y, target){
  var j = y - 1;
  var i = x + 1;
  while(j > 0 && j > target){
    state.board[j][i] = piece;
    j--;
    i++;
  }
}

function flipLeft(piece, x, y, target){
  var i = x - 1;
  while(i > 0 && i > target){
    state.board[y][i] = piece;
    i--;
  }
}

function flipRight(piece, x, y, target){
  var i = x + 1;
  while(i < 8 && i < target){
    state.board[y][i] = piece;
    i++;
  }
}

function flipDown(piece, x, y, target){
  var j = y + 1;
  while(j < 8 && j < target){
    state.board[j][x] = piece;
    j++;
  }
}

function flipDownRight(piece, x, y, target){
  var j = y + 1;
  var i = x + 1;
  while(j < 8 && j < target){
    state.board[j][i] = piece;
    j++;
    i++;
  }
}

function flipDownLeft(piece, x, y, target){
  var j = y + 1;
  var i = x - 1;
  while(j < 8 && j < target){
    state.board[j][i] = piece;
    j++;
    i--;
  }
}

// result prototype {found: boolean, y: y of end piece match, x: x of end piece match}
//#TODO Have each check function make sure there aren't any gaps

function checkUp(piece, x, y){
  for(var i = y - 1; i >= 0; i--){
    if(!state.board[i][x]){
      return result = {found: false, y: null, x: null};
    }
    if(state.board[i][x] === piece){
      return result = {found: true, y: i, x: x};
    }
  }
  return result = {found: false, y: null, x: null};
}

function checkUpLeft(piece, x, y){
  var j = y - 1;
  for(var i = x - 1; i >= 0 && j >= 0; i--){
    if(!state.board[j][i]){
      return result = {found: false, y: null, x: null};
    }
    if(state.board[j][i] === piece){
      return result = {found: true, y: j, x: i};
    }
    j--;
  }
  return result = {found: false, y: null, x: null};
}

function checkUpRight(piece, x, y){
  var j = y - 1;
  for(var i = x + 1; i < 8 && j >= 0; i++){
    if(!state.board[j][i]){
      return result = {found: false, y: null, x: null};
    }
    if(state.board[j][i] === piece){
      return result = {found: true, y: j, x: i};
    }
    j--;
  }
  return result = {found: false, y: null, x: null};
}

function checkLeft(piece, x, y){
  for(var i = x - 1; i >= 0; i--){
    if(!state.board[y][i]){
      return result = {found: false, y: null, x: null};
    }
    if(state.board[y][i] === piece){
      return result = {found: true, y: y, x: i};
    }
  }
  return result = {found: false, y: null, x: null};
}

function checkRight(piece, x, y){
  for(var i = x + 1; i < 8; i++){
    if(!state.board[y][i]){
      return result = {found: false, y: null, x: null};
    }
    if(state.board[y][i] === piece){
      return result = {found: true, y: y, x: i};
    }
  }
  return result = {found: false, y: null, x: null};
}

function checkDownLeft(piece, x, y){
  var j = y + 1;
  for(var i = x - 1; i >= 0 && j < 8; i--){
    if(!state.board[j][i]){
      return result = {found: false, y: null, x: null};
    }
    if(state.board[j][i] === piece){
      return result = {found: true, y: j, x: i};
    }
    j++;
  }
  return result = {found: false, y: null, x: null};
}

function checkDown(piece, x, y){
  for(var j = y + 1; j < 8; j++){
    if(!state.board[j][x]){
      return result = {found: false, y: null, x: null};
    }
    if(state.board[j][x] === piece){
      return result = {found: true, y: j, x: x};
    }
  }
  return result = {found: false, y: null, x: null};
}

function checkDownRight(piece, x, y){
  var j = y + 1;
  for(var i = x + 1; i < 8 && j < 8; i++){
    if(!state.board[j][i]){
      return result = {found: false, y: null, x: null};
    }
    if(state.board[j][i] === piece){
      return result = {found: true, y: j, x: i};
    }
    j++;
  }
  return result = {found: false, y: null, x: null};
}

function checkProxRefactor(piece, x, y){
  var validDirections = [];
  if(state.board[y][x]){
    return validDirections;
  }
  //UP-LEFT
  if((y - 1) > -1 && (x-1) > -1 && state.board[y-1][x-1] != piece && state.board[y-1][x-1]){
    validDirections.push({dir: "upleft"});
  }
  //UP
  if((y - 1) > -1 && state.board[y-1][x] != piece && state.board[y-1][x]){
    validDirections.push({dir: "up"});
  }
  //UP-RIGHT
  if((y - 1) > -1 && (x+1) < 8 && state.board[y-1][x+1] != piece && state.board[y-1][x+1]){
    validDirections.push({dir: "upright"});
  }
  //LEFT
  if((x-1) > -1 && state.board[y][x-1] != piece && state.board[y][x-1]){
    validDirections.push({dir: "left"});
  }
  //RIGHT
  if((x+1) < 8 &&  state.board[y][x+1] != piece && state.board[y][x+1]){
    validDirections.push({dir: "right"});
  }
  //DOWN-LEFT
  if((y+1) < 8 && (x-1) > -1 && state.board[y+1][x-1] != piece && state.board[y+1][x-1]){
    validDirections.push({dir: "downleft"});
  }
  //DOWN
  if((y+1) < 8 && state.board[y+1][x] != piece && state.board[y+1][x]){
    validDirections.push({dir: "down"});
  }
  //DOWN-RIGHt
  if((y+1) < 8 && (x+1) < 8 && state.board[y+1][x+1] != piece && state.board[y+1][x+1]){
    validDirections.push({dir: "downright"});
  }
  return validDirections;
}

function checkPossibleMoves(){
  var foundone = false;
  for(var j = 0; j < 8; j++){
    for(var i = 0; i < 8; i++){
      if(!state.board[j][i]){
        var proxarray = [];
        proxarray = checkProxRefactor(state.turn, i, j);
        //If any were found (spot 0 not empty), proceed
        if(proxarray[0]){
          proxarray.forEach(function (prox){
            switch(prox.dir){
              case "upleft":
                //check if it is a valid placement, if so highlight the square currently moused over
                var dirCheck = checkUpLeft(state.turn, i, j);
                if(dirCheck.found){
                  foundone = true;
                  return;
                }
              break;
              case "up":
                //check if it is a valid placement, if so highlight the square currently moused over
                var dirCheck = checkUp(state.turn, i, j);
                if(dirCheck.found){
                  foundone = true;
                  return;
                }
              break;
              case "upright":
                //check if it is a valid placement, if so highlight the square currently moused over
                var dirCheck = checkUpRight(state.turn, i, j);
                if(dirCheck.found){
                  foundone = true;
                  return;
                }
              break;
              case "left":
                //check if it is a valid placement, if so highlight the square currently moused over
                var dirCheck = checkLeft(state.turn, i, j);
                if(dirCheck.found){
                  foundone = true;
                  return;
                }
              break;
              case "right":
                //check if it is a valid placement, if so highlight the square currently moused over
                var dirCheck = checkRight(state.turn, i, j);
                if(dirCheck.found){
                  foundone = true;
                  return;
                }
              break;
              case "downleft":
                //check if it is a valid placement, if so highlight the square currently moused over
                var dirCheck = checkDownLeft(state.turn, i, j);
                if(dirCheck.found){
                  foundone = true;
                  return;
                }
              break;
              case "down":
                //check if it is a valid placement, if so highlight the square currently moused over
                var dirCheck = checkDown(state.turn, i, j);
                if(dirCheck.found){
                  foundone = true;
                  return;
                }
              break;
              case "downright":
                //check if it is a valid placement, if so highlight the square currently moused over
                var dirCheck = checkDownRight(state.turn, i, j);
                if(dirCheck.found){
                  foundone = true;
                  return;
                }
              break;
            }
          });
        }
        if(foundone){
          return true;
        }
      }
    }
  }
  return foundone;
}

function updateScore(){
  var black = 0;
  var white = 0;
  for(var j = 0; j < 8; j++){
    for(var i = 0; i < 8; i++){
      if(state.board[j][i] === "b"){
        black++;
      }
      else if(state.board[j][i] === "w"){
        white++;
      }
    }
  }
  return score = {black: black, white: white};
}

setup();
