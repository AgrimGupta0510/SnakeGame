function initializeGame() {
    canvas = document.getElementById('mycanvas');
    W = H = canvas.width = canvas.height = 1000;
    pen = canvas.getContext('2d');
    cellSize = 66;
    food = getRandomFood();
    gameOver = false;
    score = 0;

    foodImage = new Image();
    foodImage.src = "Assets/apple.png";

    trophyImage = new Image();
    trophyImage.src = "Assets/trophy.png";

    snake = {
        initialLength: 4,
        color: "blue",
        cells: [],
        direction: "right",

        createSnake: function() {
            for (var i = this.initialLength; i > 0; i--) {
                this.cells.push({ x: i, y: 0 });
            }
        },

        drawSnake: function() {
            for (var i = 0; i < this.cells.length; i++) {
                pen.fillStyle = this.color;
                pen.fillRect(this.cells[i].x * cellSize, this.cells[i].y * cellSize, cellSize - 2, cellSize - 2);
            }
        },

        updateSnake: function() {
            var headX = this.cells[0].x;
            var headY = this.cells[0].y;

            if (headX === food.x && headY === food.y) {
                food = getRandomFood();
                score += 1;
            } else {
                this.cells.pop();
            }

            var nextX, nextY;

            if (this.direction === 'right') {
                nextX = headX + 1;
                nextY = headY;
            } else if (this.direction === 'left') {
                nextX = headX - 1;
                nextY = headY;
            } else if (this.direction === 'down') {
                nextX = headX;
                nextY = headY + 1;
            } else {
                nextX = headX;
                nextY = headY - 1;
            }

            this.cells.unshift({ x: nextX, y: nextY });

            var lastX = Math.round(W / cellSize);
            var lastY = Math.round(H / cellSize);

            if (this.cells[0].x > lastX || this.cells[0].y > lastY || this.cells[0].x < 0 || this.cells[0].y < 0) {
                gameOver = true;
            }
        }
    };

    snake.createSnake();

    function handleKeyPress(event) {
        if (event.key === 'ArrowRight') {
            snake.direction = 'right';
        } else if (event.key === 'ArrowLeft') {
            snake.direction = 'left';
        } else if (event.key === 'ArrowDown') {
            snake.direction = 'down';
        } else {
            snake.direction = 'up';
        }
    }

    document.addEventListener('keydown', handleKeyPress);
}

function draw() {
    pen.clearRect(0, 0, W, H);
    snake.drawSnake();

    pen.fillStyle = food.color;
    pen.drawImage(foodImage, food.x * cellSize, food.y * cellSize, cellSize, cellSize);

    pen.drawImage(trophyImage, 18, 20, cellSize, cellSize);
    pen.fillStyle = "black";
    pen.font = "25px Roboto";
    pen.fillText(score, 45, 50);
}

function update() {
    snake.updateSnake();
}

function getRandomFood() {
    var foodX = Math.round(Math.random() * (W - cellSize) / cellSize);
    var foodY = Math.round(Math.random() * (H - cellSize) / cellSize);

    var food = {
        x: foodX,
        y: foodY,
        color: "red",
    }

    return food;
}

function gameLoop() {
    if (gameOver) {
        clearInterval(gameLoopInterval);
        alert("Game Over");
        return;
    }
    draw();
    update();
}

initializeGame();
var gameLoopInterval = setInterval(gameLoop, 100);
