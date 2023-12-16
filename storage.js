const saveMenuHTML = `
<h3 class="saves-title">Сохранения</h3>
<div class="saves">
</div>
<div class="saves-btns">
    <button class="base-btn" onclick="addSave()">Сохранить</button>
    <button class="base-btn" onclick="loadSave()">Загрузить</button>
    <button class="base-btn" onclick="removeSave()">Удалить</button>
</div>`

let pickedSaveText 

document.addEventListener('click', (event) => {
    if (document.querySelector('.save-menu')) {
        if (!event.composedPath().includes(document.querySelector('.save-menu')) && !event.composedPath().includes(document.querySelector('.save-menu-btn'))) 
            document.body.removeChild(document.querySelector('.save-menu'))
    }
})

function openSavesWindow() {
    let menu = document.querySelector('.save-menu')
    if (menu) {
        changeSaveName()
        menu.parentElement.removeChild(menu)
        return
    } 
    let saveMenu = document.createElement('div')
    saveMenu.className = 'save-menu'
    saveMenu.innerHTML = saveMenuHTML
    document.body.appendChild(saveMenu)

    let saves = Object.entries({ ...localStorage })
    saves = saves.filter(arr => JSON.parse(arr[1]).bgColor)
    saves.forEach(save => {
        let newSave = document.createElement('div')
        newSave.className = "save"
        newSave.onclick = pickSave
        newSave.innerHTML = `<p class="save-title" contenteditable spellcheck="false" onblur="changeSaveName()">${save[0]}</p>`
        document.querySelector(".saves").appendChild(newSave)
    })
}

function pickSave() {
    document.querySelectorAll('.save__picked').forEach(save => save.classList.remove('save__picked'))
    this.classList.add('save__picked')
    pickedSaveText = this.textContent
}

function addSave() {
    let name = 'Сохранение '+(new Date().getTime())
    let newSave = document.createElement("div")
    newSave.className = "save"
    newSave.onclick = pickSave
    newSave.innerHTML = `<p class="save-title" contenteditable spellcheck="false" onblur="changeSaveName()">${name}</p>`
    document.querySelector(".saves").appendChild(newSave)

    localStorage.setItem(name, JSON.stringify(getInfo()))
}

function loadSave() {
    let pickedSave = document.querySelector('.save__picked')
    let config = JSON.parse(localStorage.getItem(pickedSave.textContent))

    bgColor = config.bgColor
    speed = config.speed
    ruleB = config.ruleB
    ruleS = config.ruleS
    sizeGrid = config.sizeGrid
    densityGrid = config.densityGrid
    generationMode = config.generationMode
    generationsCount = config.generationsCount

    document.querySelector('[name="size"]').value = ''
    document.querySelector('[name="density"]').value = ''
    document.querySelector('.color-input').value = bgColor
    document.querySelector('[name="speed"]').value = speed
    document.querySelector('[name="rule1"]').value = ruleB.join('')
    document.querySelector('[name="rule2"]').value = ruleS.join('')
    if (sizeGrid) document.querySelector('[name="size"]').value = sizeGrid
    if (densityGrid) document.querySelector('[name="density"]').value = densityGrid * 100
    document.querySelector('[name="generations"]').value = generationsCount
    setMode(document.querySelector(`[mode="${generationMode}"]`)) 

    if (generationsCount) {
        colorsContainer.innerHTML = ''
        for (let i = 0; i < generationsCount; i++) {
            let colorContainer = addColorInput(i, 'Цвет ' + (i+1) + ' поколения')
            colorContainer.querySelector('.color-input').value = config.generationsColor[i]
        }
    } else {
        colorsContainer.innerHTML = `
        <div class="color-container">
            <label>Цвет клеток: </label>
            <input type="color" class="color-input" value=${config.generationsColor[0]} onchange="setGenerationColor(this)" number="1">
        </div>
        <div>Нет поколений</div>`
    }
    generationsColor = config.generationsColor
}

function changeSaveName() {
    let pickedSave = document.querySelector('.save__picked')
    let dataSave = localStorage.getItem(pickedSaveText)
    localStorage.removeItem(pickedSaveText)
    localStorage.setItem(pickedSave.textContent, dataSave)
}

function removeSave() {
    let pickedSave = document.querySelector('.save__picked')
    pickedSave.parentElement.removeChild(pickedSave)
    localStorage.removeItem(pickedSave.textContent)
}

function getInfo() {
    return {
        bgColor,
        speed,
        ruleB,
        ruleS,
        generationsCount,
        generationsColor,
        generationMode,
        sizeGrid,
        densityGrid
    }
}