import {createBoard} from './board/board'
import {game} from '../Logic/game'
import createSelection from './shipSelection/shipSelect';
import './style.css'

const playerBoard = document.getElementById('player-board');
const btnsDiv = document.getElementById('btns-div');
const board = createBoard(playerBoard);
let game;
const startBtn =document.getElementById('start');

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



ctrlBtn.addEventListener('click', ()=>{
    if(newGame.status === 'placing')
        newGame.start();
    else
        newGame = newGame();
})