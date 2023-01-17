import {createBoard} from './board/board'
import {game} from '../Logic/game'
import createSelection from './shipSelection/shipSelect';
import './style.css'

const playerBoard = document.getElementById('player-board');
const btnsDiv = document.getElementById('btns-div');
const board = createBoard(playerBoard);
let game;
const startBtn =document.getElementById('start');
const extraBoard = document.getElementById('extra-space')

const rndBtn = document.createElement('button');
rndBtn.classList.add('ctrl-btn');
rndBtn.textContent = 'Random';
const clrBtn = document.createElement('button');
clrBtn.classList.add('ctrl-btn');
clrBtn.textContent = 'Clear';

init();

function init(){
    game = newGame();
    transitionClear();
const shipSelectArr = createSelection();
    extraBoard.classList.add('ships');
    btnsDiv.append(rndBtn);
    btnsDiv.append(clrBtn);
    clrBtn.click();
    let currSelect;
// Ship taking events
    shipSelectArr.forEach((s) => {
        s.radio.addEventListener('change', ()=>{
            currSelect = s;
            board.enableStack(currSelect.stack, currSelect.len === currSelect.stack.length);
        })
    });

    shipSelectArr[0].radio.click();
    // Board placing events
    for(let x = 0; x < 10; x++)
        for (let y = 0; y < 10; y++) 
            board.arr[x][y].addEventListener('mousedown', ()=>{placeShipOnBoard(x, y, currSelect)})      
}

function placeShipOnBoard(x, y, currSelect){
    let currShip;
    if(board.arr[x][y].classList.toggle('playerShip')){
        currShip = game.player.takeShip(currSelect.len);
        if(game.player.board.placeShip(currShip, {'x': x, 'y': y})){                    
            currSelect.stack.push({'x': x, 'y': y});
            board.enableStack(currSelect.stack, currSelect.len === currSelect.stack.length);
        }
        else{
            board.arr[x][y].classList.toggle('playerShip');
            game.player.returnShip(currShip);
        }
    }
    else{
        game.player.returnShip(game.player.board.removeShip({'x': x, 'y': y}));
        currSelect.stack.pop();
        board.enableStack(currSelect.stack, currSelect.len === currSelect.stack.length);
    }
}

function startGame() {
    transitionClear();
    btnsDiv.removeChild(rndBtn);
    btnsDiv.removeChild(clrBtn);
    let aiBoard = createBoard(extraBoard);
    startBtn.disabled = true;
    game.ai.generatePlacement();
    extraBoard.classList.add('Board')
    for(let x = 0; x < 10; x++)
        for (let y = 0; y < 10; y++) 
            aiBoard.arr[x][y].addEventListener('mousedown', ()=>{turn(x, y, aiBoard)});

}

// initiates a turn (1 attack for each if no hits)
function turn(x, y, aiBoard){
    let res = game.player.attack(game.ai, {'x': x, 'y': y});
    if(!Array.isArray(res)){
        aiBoard.arr[x][y].textContent = '✕';
        aiBoard.arr[x][y].disabled = true;
        res = game.ai.attack(game.player);
        while(Array.isArray(res)){
            board.arr[res[0].x][res[0].y].textContent = '✕';
            board.arr[res[0].x][res[0].y].disabled = true;
            res = game.ai.attack(game.player);
        }   
        board.arr[res.x][res.y].textContent = '✕';
        board.arr[res.x][res.y].disabled = true;   
    }
    else{
        aiBoard.arr[x][y].classList.add('aiShip')
        res.forEach(coor=>{game
            aiBoard.arr[coor.x][coor.y].textContent = '✕';
            aiBoard.arr[coor.x][coor.y].disabled = true;
        })
    }
    if(game.isFinished()){
        startBtn.textContent = game.status;
        startBtn.style.color = game.status === 'won' ? 'green' : 'red';
        startBtn.disabled = false;
    }
}

// Clear placing events and the extra div
function transitionClear(){
    for(let x = 0; x < 10; x++)
        for (let y = 0; y < 10; y++) 
            board.arr[x][y].disabled = true;
    while(extraBoard.firstChild)
        extraBoard.removeChild(extraBoard.firstChild)
    extraBoard.className = '';
}
    else
        newGame = newGame();
})