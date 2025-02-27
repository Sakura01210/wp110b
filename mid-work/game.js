var BLOCK_SIZE = 20
var BLOCK_COUNT = 20

var gameInterval
var snack
var apple
var score
var level

function gameStart() {
  snack = {
    body: [
      { x: BLOCK_COUNT / 2, y: BLOCK_COUNT / 2 }
    ],
    size: 3,
    direction: { x: 0, y: -1 }
  }
  
  putApple()
  updateScore(0)
  updateGameLevel(1)
}

function updateGameLevel(newLevel) {
  level = newLevel
  
  if (gameInterval) {
    clearInterval(gameInterval)
  }
  gameInterval = setInterval(gameRoutine, 1200 / (10 + level))
}

function updateScore(newScore) {
  score = newScore
  document.getElementById('score_id').innerHTML = score
}

function putApple() {
  apple = {
    x: Math.floor(Math.random() * BLOCK_COUNT),
    y: Math.floor(Math.random() * BLOCK_COUNT)
  }
  
  for (var i=0; i<snack.body.length; i++) {
    if (snack.body[i].x === apple.x &&
        snack.body[i].y === apple.y) {
      putApple()
      break
    }
  }
}

function eatApple() {
  snack.size += 1
  putApple()
  updateScore(score + 1)
}

function gameRoutine() {
  moveSnack()
  
  if (snackIsDead()) {
    ggler()
    return
  }
  
  if (snack.body[0].x === apple.x &&
      snack.body[0].y === apple.y) {
    eatApple()
  }
  
  updateCanvas()
}

function snackIsDead() {
  // hit walls
  if (snack.body[0].x < 0) {
    return true
  } else if (snack.body[0].x >= BLOCK_COUNT) {
    return true
  } else if (snack.body[0].y < 0) {
    return true
  } else if (snack.body[0].y >= BLOCK_COUNT) {
    return true
  }
  
  // hit body
  for (var i=1; i<snack.body.length; i++) {
    if (snack.body[0].x === snack.body[i].x &&
        snack.body[0].y === snack.body[i].y) {
      return true
    }
  }
  
  return false
}

function ggler() {
  clearInterval(gameInterval)
  window.alert("遊戲結束,按開始遊戲重新開始")
}

function moveSnack() {
  var newBlock = {
    x: snack.body[0].x + snack.direction.x,
    y: snack.body[0].y + snack.direction.y
  }
  
  snack.body.unshift(newBlock)
  
  while (snack.body.length > snack.size) {
    snack.body.pop()
  }
}

function updateCanvas() {
  var canvas = document.getElementById('canvas_id')
  var context = canvas.getContext('2d')
  
  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)
  
  context.fillStyle = 'lime'
  for (var i=0; i<snack.body.length; i++) {
    context.fillRect(
      snack.body[i].x * BLOCK_SIZE + 1,
      snack.body[i].y * BLOCK_SIZE + 1,
      BLOCK_SIZE - 1,
      BLOCK_SIZE - 1
    )
  }
  
  context.fillStyle = 'red'
  context.fillRect(
    apple.x * BLOCK_SIZE + 1,
    apple.y * BLOCK_SIZE + 1,
    BLOCK_SIZE - 1,
    BLOCK_SIZE - 1
  )
}

window.onload = onPageLoaded

function onPageLoaded() {
  document.addEventListener('keydown', handleKeyDown)
}

function handleKeyDown(event) {
  var originX = snack.direction.x
  var originY = snack.direction.y
  
  if (event.keyCode === 37) { // left arrow 
    snack.direction.x = originY
    snack.direction.y = -originX
  } else if (event.keyCode === 39) { // right arrow 
    snack.direction.x = -originY
    snack.direction.y = originX
  }
}
