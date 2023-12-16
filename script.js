let grid = []

let canvas = document.querySelector("#canvas")
let context = canvas.getContext("2d")
let playBtn = document.querySelector('.play-btn')
let colorsContainer = document.querySelector('.colors-container')
let counterSteps = document.querySelector('.counter-steps')
let counterAliveCells = document.querySelector('.counter-alive-cells')

let isPlay = false

let speed = 50
let generationsCount = 0
let generationMode = '1'
let generationsColor = ['#000000']
let bgColor = '#ffffff'
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
    counterSteps.textContent = '0'
    grid = []
    cellSize = sizeCanvas / sizeGrid
    for (let i = 0; i < sizeGrid; i++) {
        grid[i] = []
        for (let k = 0; k < sizeGrid; k++) {
            random = Math.random()
            if (random > densityGrid) {
                grid[i][k] = 0
            }
            else {
                grid[i][k] = 1
            }
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
    counterSteps.textContent = +counterSteps.textContent + 1
    let cellNeighbors = getNeighbors()
    for (let i = 0; i < grid.length; i++) {
        for (let k = 0; k < grid.length; k++) { 
            cell = grid[i][k]
            countNeighbors = cellNeighbors[i][k]

            if (!generationsCount) {
                if ((cell == 0 && ruleB.includes(countNeighbors)) || (cell == 1 && ruleS.includes(countNeighbors))) grid[i][k] = 1
                else grid[i][k] = 0   
            } else if (generationMode == '1') {
                if (cell == 0 && (ruleB.includes(countNeighbors))) grid[i][k] = 1
                else if (ruleS.includes(countNeighbors) && cell.inRange([1, generationsCount-1])) grid[i][k] += 1
                else grid[i][k] = 0    
            } else if (generationMode == '2') {
                if (cell == 0 && (ruleB.includes(countNeighbors))) grid[i][k] = 1           
                else if (!ruleS.includes(countNeighbors) && cell.inRange([1, generationsCount-1])) grid[i][k] += 1
                else if (!cell.inRange([1, generationsCount-1])) grid[i][k] = 0   
            }            
        }
    }
    drawTable()
    counterAliveCells.textContent = String(grid).match(/[1-9]+/g).length
}

function drawTable() {
    for (var row = 0; row < sizeGrid; row++) {
        for (var column = 0; column < sizeGrid; column++) {
            let cellX = cellSize * column
            let cellY = cellSize * row
            if (grid[row][column] >= 1) {
                context.fillStyle = generationsColor[grid[row][column]-1]
                context.fillRect(cellX, cellY, cellSize, cellSize)
            } else {
                context.fillStyle = bgColor
                context.fillRect(cellX, cellY, cellSize, cellSize)
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
    generateGrid()
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

function setGenerations(input) {
    generationsColor = ["#000000"]
    colorsContainer.innerHTML = ''
    generationsCount = +input.value
    for (let i = 0; i < generationsCount; i++) {
        addColorInput(i, 'Цвет ' + (i+1) + ' поколения')
    }
    if (!generationsCount) {
        addColorInput(0, 'Цвет живых клеток')
        colorsContainer.innerHTML += '<div>Нет поколений</div>'
    }
}

function addColorInput(number, text) {
    let colorContainer = document.createElement('div')
    colorContainer.className = 'color-container'
    colorContainer.innerHTML = `
    <div class="color-container">
        <label>${text}: </label>
        <input type="color" class="color-input" onchange="setGenerationColor(this)" number="${number+1}">
    </div>`
    colorsContainer.appendChild(colorContainer)
    generationsColor[number] = "#000000"
    return colorContainer
}

function setBgColor(input) {
    bgColor = input.value
    drawTable()
}

function setGenerationColor(input) {
    generationsColor[+input.getAttribute('number')-1] = input.value
    drawTable()
}

function setMode(button) {
    generationMode = button.getAttribute('mode')
    document.querySelector('.generation-btn__selected').classList.remove('generation-btn__selected')
    button.classList.add('generation-btn__selected')
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


