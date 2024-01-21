const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let birdImg = new Image();
birdImg.src = 'https://i.postimg.cc/PLFyKR9S/bird.png';

let backgroundImg = new Image();
backgroundImg.src = 'https://i.postimg.cc/JtW8QY8r/background.png';

let pipeImg = new Image();
pipeImg.src = 'https://i.postimg.cc/CdHgrCMj/pipe.png';

let bird = {
  x: 50,
  y: canvas.height / 2 - 10,
  width: 40, // Adjusted size to match the bird image
  height: 40, // Adjusted size to match the bird image
  velocity: 0,
  gravity: 0.5
};

let gravity = 0.2;
let jump = -6;
let pipes = [];
let score = 0;

let gameOverDialog = document.getElementById('gameOverDialog');
let retryButton = document.getElementById('retryButton');

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(pipeX, openingY) {
  const pipeWidth = 40; // Adjusted size to match the pipe image
  const pipeSpacing = 250;
  const pipeHeight = canvas.height - openingY;
  
  ctx.drawImage(pipeImg, pipeX, 0, pipeWidth, openingY);
  ctx.drawImage(pipeImg, pipeX, openingY + pipeSpacing, pipeWidth, pipeHeight);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  // Update bird position
  bird.velocity += gravity;
  bird.y += bird.velocity;

  // Check for collision with top or bottom borders
  if (bird.y < 0 || bird.y > canvas.height - bird.height) {
    showGameOverDialog();
    return; // Stop the game loop
  }

  // Draw pipes
  for (let i = 0; i < pipes.length; i++) {
    drawPipe(pipes[i].x, pipes[i].openingY);
    pipes[i].x -= 1;

    // Check for collision with pipes
    if (
      bird.x < pipes[i].x + 40 &&
      bird.x + bird.width > pipes[i].x &&
      (bird.y < pipes[i].openingY || bird.y + bird.height > pipes[i].openingY + 250)
    ) {
      showGameOverDialog();
      return; // Stop the game loop
    }

    // Check for passing pipes
    if (pipes[i].x === bird.x - 40) {
      score++;
    }
  }

  // Draw bird
  drawBird();

  // Draw scoreboard
  ctx.fillStyle = '#FFF';
  ctx.font = '24px Arial';
  ctx.fillText('Score: ' + score, canvas.width - 150, 30);

  // Generate new pipes
  if (Math.random() < 0.01) {
    let openingY = Math.random() * (canvas.height - 250);
    pipes.push({ x: canvas.width, openingY });
  }

  // Remove off-screen pipes
  pipes = pipes.filter(pipe => pipe.x > -40);

  requestAnimationFrame(draw);
}

function resetGame() {
  bird.y = canvas.height / 2 - 10;
  bird.velocity = 0;
  pipes = [];
  score = 0;
}

function showGameOverDialog() {
  gameOverDialog.style.display = 'block';

  // Display collision point image at the position of collision within canvas bounds
  const birdXWithinBounds = Math.min(Math.max(bird.x, 0), canvas.width - bird.width);
  const birdYWithinBounds = Math.min(Math.max(bird.y, 0), canvas.height - bird.height);

  document.getElementById('collisionPointImage').style.display = 'none';
  document.getElementById('collisionPointImage').style.position = 'absolute';
  document.getElementById('collisionPointImage').style.left = birdXWithinBounds + 'px';
  document.getElementById('collisionPointImage').style.top = birdYWithinBounds + 'px';

  // Display the score in the popup
  document.getElementById('scoreDisplay').innerText = 'Score: ' + score;

  // Remove existing event listener to prevent multiple additions
  retryButton.removeEventListener('click', retryButtonClickHandler);

  // Add a new event listener
  retryButton.addEventListener('click', retryButtonClickHandler);
}


function retryButtonClickHandler() {
  gameOverDialog.style.display = 'none';
  document.getElementById('collisionPointImage').style.display = 'none'; // Hide collision point image
  resetGame();
  draw(); // Restart the game loop
}

// Handle key press for jumping
window.addEventListener('keydown', function (e) {
  if (e.code === 'Space') {
    bird.velocity = jump;
  }
});

draw();  // Start the game loop