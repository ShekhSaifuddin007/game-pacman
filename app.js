import { LEVEL, OBJECT_TYPE } from './setup'
import GameBoard from './GameBoard'
import PacMan from "./PacMan";
import { randomMovement } from './ghostMoves'
import Ghost from './Ghost'

// Import Sounds
import dotSound from './sounds/munch.wav'
import pillSound from './sounds/pill.wav'
import startGameSound from './sounds/game_start.wav'
import gameOverSound from './sounds/death.wav'
import ghostSound from './sounds/eat_ghost.wav'


// DOM Elements....
const gameGrid = document.querySelector('#game')
const scoreTable = document.querySelector('#score')
const startBtn = document.querySelector('#start-button')

// Game Constants....
const POWER_PILL_TIME = 10000 // ms
const GLOBAL_SPEED = 80 // ms
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL)

// initial setup
let score = 0
let timer = null
let gameWin = false
let powerPillActive = false
let powerPillTimer = null

// Sounds

function playSound(sound) {
    const soundEffect = new Audio(sound)
    soundEffect.play()
}

function gameOver(pacman, grid) {
    playSound(gameOverSound)
    document.removeEventListener('keydown', e =>
        pacman.handleKeyInput(e, gameBoard.objectExist)
    )

    gameBoard.showGameStatus(gameWin)

    clearInterval(timer)
    startBtn.classList.remove('hide')
}

function checkCollision(pacman, ghosts) {
    const collidedGhost = ghosts.find(ghost => pacman.pos === ghost.pos)

    if (collidedGhost) {
        if (pacman.powerPill) {
            playSound(ghostSound)
            gameBoard.removeObject(collidedGhost.pos, [
                OBJECT_TYPE.GHOST,
                OBJECT_TYPE.SCARED,
                collidedGhost.name
            ])
            collidedGhost.pos = collidedGhost.startPos
            score += 100
        } else {
            gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN])
            gameBoard.rotateDiv(pacman.pos, 0)
            gameOver(pacman, gameGrid)
        }
    }
}

function gameLoop(pacman, ghosts) {
    gameBoard.moveCharacter(pacman)
    checkCollision(pacman, ghosts)

    ghosts.forEach((ghost) => gameBoard.moveCharacter(ghost))
    checkCollision(pacman, ghosts)

    // pacman eat dot
    if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT)) {
        playSound(dotSound)
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT])
        gameBoard.dotCount--
        score += 10
    }

    // pacman eat powerPill
    if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {
        playSound(pillSound)
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL])
        pacman.powerPill = true
        score += 50

        clearTimeout(powerPillTimer)
        powerPillTimer = setTimeout(() => (pacman.powerPill = false), POWER_PILL_TIME)
    }

    // after eat powerPill change ghosts color
    if (pacman.powerPill !== powerPillActive) {
        powerPillActive = pacman.powerPill
        ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill))
    }
    // after dot finish
    if (gameBoard.dotCount === 0) {
        gameWin = true
        gameOver(pacman, ghosts)
    }

    // show score
    scoreTable.innerHTML = score
}

function startGame() {
    playSound(startGameSound)

    gameWin = false
    powerPillActive = false
    score = 0

    startBtn.classList.add('hide')
    gameBoard.createGrid(LEVEL)

    const pacman = new PacMan(2, 287)
    gameBoard.addObject(287, [OBJECT_TYPE.PACMAN])
    document.addEventListener('keydown', (e) =>
        pacman.handleKeyInput(e, gameBoard.objectExist)
    )

    const ghosts = [
        new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
        new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
        new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
        new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE)
    ]

    timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED)
}

startBtn.addEventListener('click', startGame)