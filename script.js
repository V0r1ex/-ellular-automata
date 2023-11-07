let grid = []

let canvas = document.querySelector("#canvas")
let context = canvas.getContext("2d")
let playBtn = document.querySelector('.play-btn')

let isPlay = false

let speed = 50
let sizeGrid
let sizeCanvas = Number(canvas.getAttribute('width'))
let cellSize = sizeCanvas / sizeGrid
let densityGrid 
let ruleB = []
let ruleS = []

Number.prototype.inRange = function (arr) {
    if (arr.length == 1) return this == arr[0]
    return this >= arr[0] && this <= arr[arr.length-1]
}

setGrid()
function setGrid() {
    cellSize = sizeCanvas / sizeGrid
    for (let i = 0; i < sizeGrid; i++) {
        grid[i] = []
        for (let k = 0; k < sizeGrid; k++) {
            random = Math.random()
            if (random > densityGrid) grid[i][k] = 0
            else grid[i][k] = 1
        }
    }
}

function getNeighbors() {
    let cellNeighbors = []
    for (let i = 0; i < grid.length; i++) {
        cellNeighbors[i] = []
        for (let k = 0; k < grid.length; k++) {
            cell = grid[i][k]
            let cellsAround = [
                grid[i-1] && grid[i-1][k-1],
                grid[i-1] && grid[i-1][k],
                grid[i-1] && grid[i-1][k+1],
                grid[i][k-1], grid[i][k+1],
                grid[i+1] && grid[i+1][k-1],
                grid[i+1] && grid[i+1][k],
                grid[i+1] && grid[i+1][k+1],

            ]
            cellNeighbors[i][k] = cellsAround.filter((el) => el==1).length
        }
    }
    return cellNeighbors
}

function step() {
    let cellNeighbors = getNeighbors()
    for (let i = 0; i < grid.length; i++) {
        for (let k = 0; k < grid.length; k++) { 
            cell = grid[i][k]
            countNeighbors = cellNeighbors[i][k]
            if ((cell == 0 && (countNeighbors.inRange(ruleB))) || (cell == 1 && (countNeighbors.inRange(ruleS)))) {
                grid[i][k] = 1
            } else {
                grid[i][k] = 0             
            }
        }
    }
    drawTable()
}

function drawTable() {
    for (var row = 0; row < sizeGrid; row++) {
        for (var column = 0; column < sizeGrid; column++) {
            let cellX = cellSize * column
            let cellY = cellSize * row
            if (grid[row][column] == 1) {
                // context.fillStyle = 'black'
                context.fillRect(cellX, cellY, cellSize, cellSize)
            } else {
                context.clearRect(cellX, cellY, cellSize, cellSize)
                // context.fillStyle = 'white'
                // context.fillRect(cellX, cellY, cellSize, cellSize)
            }
        }
    }
}

function play() {
    if (!isPlay) {
        isPlay = setInterval(step, speed)
        playBtn.textContent = 'pause'
    } else {
        clearInterval(isPlay)
        isPlay = false
        playBtn.textContent = 'play'
    }
}

function setSpeed(input) {
    speed = Number(input.value)
    if (isPlay) {
        clearInterval(isPlay)
        isPlay = setInterval(step, speed)
    }
}

function setSize(input) {
    sizeGrid = Number(input.value)
    setGrid()
}

function setDensity(input) {
    densityGrid = Number(input.value) / 100
}

function setRuleB(input) {
    ruleB = input.value.split('').map(el => Number(el))
}

function setRuleS(input) {
    ruleS = input.value.split('').map(el => Number(el))
}

function aliveCell(event) {
    let rect = event.target.getBoundingClientRect()
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top; 
    let row = Math.floor(y / cellSize)
    let column = Math.floor(x / cellSize)
    if (grid.length > 0) {
        grid[row][column] = 1
        drawTable()
    }
}

function downloadImage() {
    let image = canvas.toDataURL('image/png')
    let link = document.createElement('a')
    link.href = image
    link.download = "canvas.jpg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

function generateGrid() {
    setGrid()
    drawTable()
}


