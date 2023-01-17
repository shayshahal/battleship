import {createBoard} from './board/board'
import {game} from '../Logic/game'
import createSelection from './shipSelection/shipSelect';
import './style.css'

const board = createBoard();
let newGame = game();
const ctrlBtn =document.getElementById('ctrl-btn');

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




ctrlBtn.addEventListener('click', ()=>{
    if(newGame.status === 'placing')
        newGame.start();
    else
        newGame = newGame();
})