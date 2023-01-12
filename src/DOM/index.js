import createBoard from './board/board'
import {game} from '../Logic/game'
import createSelection from './shipSelection/shipSelect';
import './style.css'

const playerBoardArr = createBoard();
let newGame;
const ctrlBtn =document.getElementById('ctrl-btn');

newGame = game();
createSelection();

for(let x = 0; x < 10; x++){
    for (let y = 0; y < 10; y++) {
        playerBoardArr[x][y].addEventListener('mousedown', ()=>{
        if(playerBoardArr[x][y].classList.toggle('ship'))
            newGame.player.board.placeShip(currShip, {'x': x, 'y': y});
        else
            newGame.player.returnShip(game.player.board.removeShip({'x': x, 'y': y}));
        })      
    }
}

ctrlBtn.addEventListener('click', ()=>{
    if(game.status === 'placing')
        newGame.start();
    else
        newGame = newGame();
})