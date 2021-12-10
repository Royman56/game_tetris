const canvas = document.getElementById("tetris");
const ctx = canvas.getContext('2d');

const figure = 20; //cambia el tamaño de la figura

ctx.scale(figure, figure);

const bgWidth = canvas.width / figure;
const bgHeight = canvas.height / figure;

const pieces = [
    [
        [1, 1],
        [1, 1]
    ],
    [
        [0, 2, 0, 0],
        [0, 2, 0, 0],
        [0, 2, 0, 0],
        [0, 2, 0, 0]
    ],
    [
        [0, 0, 0],
        [3, 3, 0],
        [0, 3, 3]
    ],
    [
        [0, 0, 0],
        [0, 4, 4],
        [4, 4, 0]
    ],
    [
        [5, 0, 0],
        [5, 0, 0],
        [5, 5, 0]
    ],
    [
        [0, 0, 6],
        [0, 0, 6],
        [0, 6, 6]
    ],
    [
        [0, 0, 0],
        [7, 7, 7],
        [0, 7, 0]
    ]
];
const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF'
];

let arena = [];

let fRandom;

const player = {
    pos: {x: 0, y: 1},
    matrix: null,
    color: null
}

fRandom = Math.floor(Math.random() * pieces.length);
player.matrix = pieces[fRandom];
player.color = colors[fRandom+1];

function drawMatrix(matrix, x, y) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j])
                ctx.fillRect(x + j, y + i, 1, 1);
        }
    }
}

function rotateFigure(matrix, dir) {
    let newMatrix = [];

    for (let i in matrix)
        newMatrix.push([]);

    if (dir === 1) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                newMatrix[j][matrix.length - i - 1] = matrix[i][j];
            }
        }
    } else {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                newMatrix[matrix.length - j - 1][i] = matrix[i][j];
            }
        }
    }

    return newMatrix;
}

function collides(player, arena) {
    for (let i = 0; i < player.matrix.length; i++) {
        for (let j = 0; j < player.matrix[i].length; j++) {
            if (player.matrix[i][j] && arena[player.pos.y + i + 1][player.pos.x + j + 1])
                return 1;
        }
    }

    return 0;
}

function mergeArena(matrix, x, y) { //crea nuevas figuras en el escenario
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            arena[y+i+1][x+j+1] = arena[y+i+1][x+j+1] || matrix[i][j];
        }
    }
}

function floor() { //Esto coloca el piso
    for (let i = 1; i < arena.length-2; i++) {
        for (let j = 1; j < arena[i].length-1; j++) {
            if (arena[i][j]) {
                ctx.fillStyle = colors[arena[i][j]];
                ctx.fillRect(j-1, i-1, 1, 1);
            }
        }
    }
}

function initArena() {
    arena = [];

    const scene = new Array(bgWidth + 2).fill(1);
    arena.push(scene);

    for (let i = 0; i < bgHeight; i++) {
        let row = new Array(bgWidth).fill(0);
        row.push(1);
        row.unshift(1);

        arena.push(row);
    }

    arena.push(scene);
    arena.push(scene);
}

function gameOver() { //esta funcion reinicia el juego
    for (let f = 1; f < arena[1].length-1; f++){
        if (arena[1][f]){
        return initArena();
        }
    }
          
    return;
    
}


let interval = 1000;
let lastTime = 0;
let count = 0;

function update(time = 0) {

    const dt = time - lastTime;//baja automaticamente la figura
    lastTime = time;//baja automaticamente la figura
    count += dt;//baja automaticamente la figura

    if (count >= interval) {
        player.pos.y++;
        count = 0;
    }

    if (collides(player, arena)) {
        mergeArena(player.matrix, player.pos.x, player.pos.y-1);//establece un limite con el suelo
      
        gameOver();

        player.pos.y = 1;
        player.pos.x = 0;

        fRandom = Math.floor(Math.random() * pieces.length);
        player.matrix = pieces[fRandom];
        player.color = colors[fRandom+1];

        interval = 1000;
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    floor();
    ctx.fillStyle = player.color;
    drawMatrix(player.matrix, player.pos.x, player.pos.y);

    requestAnimationFrame(update);//animacion para que la figura baje
}

document.addEventListener("keydown", event => {

    if (event.key === "ArrowLeft" && interval-1) {
        player.pos.x--;
        if (collides(player, arena))
            player.pos.x++;
    } else if (event.key === "ArrowRight" && interval-1) {
        player.pos.x++;
        if (collides(player, arena))
            player.pos.x--;
    } else if (event.key === "ArrowDown") {
        player.pos.y++;
        count = 0;
    } else if (event.key === "ArrowUp") {
        player.matrix = rotateFigure(player.matrix, 1);
        if (collides(player, arena))
            player.matrix = rotateFigure(player.matrix, -1);
    } else if (event.key === "Space") {
        interval = 1;
    }

});

initArena();
update();