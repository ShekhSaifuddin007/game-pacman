import { LEVEL, OBJECT_TYPE } from './setup'
import GameBoard from './GameBoard'
import PacMan from "./PacMan";

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

function gameOver(pacman, grid) {

}

function checkCollision(pacman, ghosts) {

}

function gameLoop(pacman, ghosts) {
    gameBoard.moveCharacter(pacman)
}

function startGame() {
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

    timer = setInterval(() => gameLoop(pacman), GLOBAL_SPEED)
}

startBtn.addEventListener('click', startGame)