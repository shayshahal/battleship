import {createBoard} from './board/board'
import {game} from '../Logic/game'
import createSelection from './shipSelection/shipSelect';
import './style.css'

const board = createBoard();
let newGame = game();
const ctrlBtn =document.getElementById('ctrl-btn');

const shipSelectArr = createSelection();

// Ship taking events





ctrlBtn.addEventListener('click', ()=>{
    if(newGame.status === 'placing')
        newGame.start();
    else
        newGame = newGame();
})