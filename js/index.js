var MYAPP = {
  'player-1-score' : 0,
  'player-2-score': 0,
  'board' : [[-1, -1, -1],[-1, -1, -1],[-1, -1, -1]],
  'playing-with-ai': false,
  'player-1-sym' : '',
  'player-2-sym' : '',
  'player-1-turn': true,
  'players': ['Player 1', 'Player 2'],
  'move': null,
  'X': 1,
  'O': 0,
  'repeater': null,
  'counter': 0 // keeps track how many times show player animation been requested
};

var canvasCtx, canvas;

$(document).ready(function(){
  canvas = document.getElementById('canvas');
  canvasCtx = canvas.getContext('2d'); 
  reset();
});

function gameOver(){
  for(var row = 0; row < 3; row++){
    if(MYAPP['board'][row][0] == MYAPP['board'][row][1] && 
       MYAPP['board'][row][0] == MYAPP['board'][row][2])
      if(MYAPP['board'][row][0] == 0 || MYAPP['board'][row][0] == 1)
        return row + 1;
  }
  for(var col = 0; col < 3; col++){
    if(MYAPP['board'][0][col] == MYAPP['board'][1][col] && 
       MYAPP['board'][0][col] == MYAPP['board'][2][col])
      if(MYAPP['board'][0][col] == 0 || MYAPP['board'][0][col] == 1)
        return col + 4;
  }
  
  if(MYAPP['board'][0][0] == MYAPP['board'][1][1] &&
     MYAPP['board'][1][1] == MYAPP['board'][2][2])
    if(MYAPP['board'][0][0] == 0 || MYAPP['board'][0][0] == 1)
      return 7;
  
  if(MYAPP['board'][2][0] == MYAPP['board'][1][1] &&
     MYAPP['board'][1][1] == MYAPP['board'][0][2])
    if(MYAPP['board'][1][1] == 0 || MYAPP['board'][1][1] == 1)
      return 8;
  
  for(var row = 0; row < 3; row++)
    for(var col = 0; col < 3; col++)
      if(MYAPP['board'][row][col] == -1)
        return -1;
  
  // draw
  return 9;
}

function drawLine(status){
  $('#canvas').css('display', 'block');
  canvasCtx.lineCap = 'round';
  canvasCtx.strokeStyle = 'green';
  canvasCtx.lineWidth = 6;
  switch(status){
    case 1: // draw line in first row
      canvasCtx.beginPath();
      canvasCtx.moveTo(20, 54);
      canvasCtx.lineTo(300, 54);
      canvasCtx.stroke();
      break;
    case 2: // draw line in second row     
      canvasCtx.beginPath();
      canvasCtx.moveTo(20, 165);
      canvasCtx.lineTo(300, 165);
      canvasCtx.stroke();
      break;
    case 3: // draw line in third row
      canvasCtx.beginPath();
      canvasCtx.moveTo(20, 274);
      canvasCtx.lineTo(300, 274);
      canvasCtx.stroke();
      break;
    case 4: // draw line in first column
      canvasCtx.beginPath();
      canvasCtx.moveTo(55, 35);
      canvasCtx.lineTo(55, 294);
      canvasCtx.stroke();
      break;
    case 5: // draw line in second column
      canvasCtx.beginPath();
      canvasCtx.moveTo(165, 35);
      canvasCtx.lineTo(165, 294);
      canvasCtx.stroke();
      break;
    case 6: // draw line in third column
      canvasCtx.beginPath();
      canvasCtx.moveTo(275, 35);
      canvasCtx.lineTo(275, 294);
      canvasCtx.stroke();
      break;
    case 7: // draw line in main dia  
      canvasCtx.beginPath();    
      canvasCtx.moveTo(53, 50);
      canvasCtx.lineTo(280, 274);
      canvasCtx.stroke();
      break;
    case 8: // draw line in off dia
      canvasCtx.beginPath();    
      canvasCtx.moveTo(280, 50);
      canvasCtx.lineTo(53, 274);
      canvasCtx.stroke();
      break;
  }
}

function gameOverMsg(status){  
  drawLine(status);
  var msg = '';
  if(status == 9)
    msg = 'Both Played Well!';
  else{  
    var winner = MYAPP['player-1-turn'] ? MYAPP['players'][1] : MYAPP['players'][0];
    if(MYAPP['player-1-turn'])
      $('#score-2').html(++MYAPP['player-2-score']);
    else
      $('#score-1').html(++MYAPP['player-1-score']);
    msg = winner + ' won!';
  }  
  $('.inner-board').css('opacity', .2);
  $('.message').html(msg);
  $('.message').css('opacity', 1);
  $('.message').fadeIn(100);
  setTimeout(function(){
    $('.message').fadeOut(100);drawBoard();play();},3000);
}

function drawBoard(){
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  $('#canvas').css('display', 'none');
  $('td').html('');
  for(let row = 0; row < 3; row++)
    for(let col = 0; col < 3; col++)
      MYAPP.board[row][col] = -1;  
  $('.inner-board').css('opacity', 1);
}

function showTurnMsg(){  
    MYAPP['counter']++;
    if(MYAPP['counter'] < 7)
      return;
    var player = MYAPP['player-1-turn'] ? MYAPP['players'][0] : MYAPP['players'][1];
    $('.whoseTurn').html(player + "'s turn");
    $('.whoseTurn').animate({'top': '-45px'}, 800);
    $('.whoseTurn').animate({'top': '0px'}, 800);
    MYAPP['counter'] = 0;
}

function play(){
  MYAPP['repeater'] = setInterval(function(){updateBoard();} ,500);
  function updateBoard(){
    var gameStatus = gameOver();
    if(gameStatus >= 0){
      clearInterval(MYAPP['repeater']);
      gameOverMsg(gameStatus);
      return;
    }
    //alert('ohh');
    showTurnMsg();
    var move = GetMove();
    if(move == null)
      return;
    var sym = MYAPP['player-1-turn'] ? MYAPP['player-1-sym'] : MYAPP['player-2-sym'];
    $('#'+move).append(sym);
    var row = Math.floor(move / 3), col = move % 3;
    MYAPP['board'][row][col] = MYAPP[sym];
    MYAPP['player-1-turn'] = !MYAPP['player-1-turn'];
  }
}

function GetMove(){
  var move = null;
  if(MYAPP['playing-with-ai'] && !MYAPP['player-1-turn']){
      var aiMove = getMove(MYAPP['board'], MYAPP[MYAPP['player-2-sym']]);
      move = aiMove.row * 3 + aiMove.col;
      //alert('Ai move: ' + move);
  }
  else{
    move = MYAPP['move'];
    MYAPP['move'] = null;
  }
  return move;
}


$('td').click(function(){
	var pos = $(this).attr('id');
  if(!legitMove(pos)){
   MYAPP['move']  = null;
    return;
  }
  if(MYAPP['playing-with-ai']){
    if(!MYAPP['player-1-turn'])
      MYAPP['move']  = null;
    else
      MYAPP['move']  = pos;
  }
  else
    MYAPP['move']  = pos;
});

function legitMove(pos){
  var row = Math.floor(pos/3);
  var col = pos % 3;
  if(MYAPP['board'][row][col] == -1)
    return true;
  return false;
}

function playWithAI(val){
  switch(val){
    case 'yes': MYAPP['playing-with-ai'] = true;
                MYAPP['players'][1] = 'AI';
                break;
    case 'no': MYAPP['playing-with-ai'] = false;
                break;
  }
  fadeOut($('.play-with-ai'));
  setTimeout(function(){fadeIn($('.player-1')); }, 1500);  
}

function playerOneIs(val){
  fadeOut($('.player-1')); 
  switch(val){
    case 'x': MYAPP['player-1-sym'] = 'X';
              MYAPP['player-2-sym'] = 'O';
              break;
    case 'o': MYAPP['player-1-sym'] = 'O';
              MYAPP['player-2-sym'] = 'X';
              break;
  }
  setTimeout(function(){whoPlaysFirst();},1000);
}

function whoPlaysFirst(){
  var x = Math.floor(Math.random() * 2);
  $('.message').html('<p>'+MYAPP['players'][x]+' plays first.</p>');
  MYAPP['player-1-turn'] = x == 0 ? true : false;
  fadeIn($('.message'));
  setTimeout(function(){fadeOut($('.message'));
    setTimeout(function(){fadeIn($('.inner-board')); 
      setTimeout(function(){play()}, 1000);},2000);},2500);
}

function reset(){
  if(MYAPP['repeater'] != null)
    clearInterval(MYAPP['repeater']);
  $('.inner-board').fadeOut(0);
  $('.player-1').fadeOut(0);  
  $('.whoseTurn').animate({'top': '0px'}, 50);
  $('.message').fadeOut(0);  
  fadeIn($('.play-with-ai'));
  drawBoard();
  
  MYAPP['counter'] = 0;
  MYAPP['player-1-score'] = 0;
  MYAPP['player-2-score'] = 0;
  MYAPP['computer-turn'] = false;
  MYAPP['player-1-turn'] = true;
  MYAPP['players'] = ['Player 1', 'Player 2']
  $('#score-1').html(MYAPP['player-1-score']);
  $('#score-2').html(MYAPP['player-2-score']);  
}

function fadeOut(element){
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.css('display', 'none');
        }
        element.css('opacity', op);
        element.css('filter', 'alpha(opacity=' + op * 100 + ")");
        op -= op * 0.1;
    }, 50);
}

function fadeIn(element){
      var op = 0.1;  // initial opacity
    element.css('display', 'block');
    var timer = setInterval(function () {
        if (op >= 1){
            element.css('opacity', 1);
        element.css('filter','alpha(opacity=' + 100 + ")");
            clearInterval(timer);
        }
        element.css('opacity', op);
        element.css('filter','alpha(opacity=' + op * 100 + ")");
        op += op * 0.1;
    }, 50);
}