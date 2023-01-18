import {createBoard} from './board/board'
import {newGame} from '../Logic/game'
import createSelection from './shipSelection/shipSelect';
import './style.css'

// All needed declarations
const playerBoard = document.getElementById('player-board');
const btnsDiv = document.getElementById('btns-div');
const board = createBoard(playerBoard); // Player's DOM board
let game;
const startBtn =document.getElementById('start');
const extraBoard = document.getElementById('extra-space')


// Creation of clear and random buttons
const rndBtn = document.createElement('button');
rndBtn.classList.add('ctrl-btn');
rndBtn.textContent = 'Random';
const clrBtn = document.createElement('button');
clrBtn.classList.add('ctrl-btn');
clrBtn.textContent = 'Clear';

// Call to initialize on page load
init();

function init(){
    transitionClear(); // Clear what was before (if there was anything)
    const shipSelectArr = createSelection(); // DOM radio buttons creation

    // Control buttons
    btnsDiv.append(rndBtn);
    btnsDiv.append(clrBtn);
    clrBtn.click(); // Clear the player's board
    // Turn start button back to initial state
    startBtn.textContent = 'Start';
    startBtn.style.color = 'white';

    game = newGame(); 

    let currSelect;
    // Ship taking events
    shipSelectArr.forEach((s) => {
        s.radio.addEventListener('change', ()=>{
            currSelect = s; // Save the current radio button selected
            board.enableStack(currSelect.stack, currSelect.len === currSelect.stack.length);
        })
    });

    // Make a radio button automatically selected at page load
    shipSelectArr[0].radio.click();
    // Board placing events
    for(let x = 0; x < 10; x++)
        for (let y = 0; y < 10; y++) 
            board.arr[x][y].onclick = ()=>{placeShipOnBoard(x, y, currSelect)};

    rndBtn.addEventListener('click', ()=>{
        game.player.returnShip(); // Return all ships that were previously taken (no parameters = all)
        let arr = game.player.generatePlacement();
        for(let x = 0; x < 10; x++)
            for (let y = 0; y < 10; y++) 
            {    
                if(arr[x][y] > 0)
                    board.arr[x][y].classList.add('playerShip');
                else
                    board.arr[x][y].classList.remove('playerShip');
                board.arr[x][y].disabled = true;
            }
        })
        
    clrBtn.addEventListener('click', ()=>{
        game.player.returnShip();
        for(let x = 0; x < 10; x++)
            for (let y = 0; y < 10; y++) {
                board.arr[x][y].classList.remove('playerShip');
                board.arr[x][y].textContent = '';
                board.arr[x][y].disabled = false;
            }
        shipSelectArr[0].radio.click();
    })
}

// function to place ships on the board in the DOM while also synchronizing the logic
function placeShipOnBoard(x, y, currSelect){
    let currShip;
    if(board.arr[x][y].classList.toggle('playerShip')){ // If placing a ship
        currShip = game.player.takeShip(currSelect.len); 
        
        if(game.player.board.placeShip(currShip, {'x': x, 'y': y})){     //If placed a ship successfully
            currSelect.stack.push({'x': x, 'y': y}); // Add placement to the memory stack
            board.enableStack(currSelect.stack, currSelect.len === currSelect.stack.length); // Enable appropriate squares
        }
        else{ // If placement failed give back the ship
            board.arr[x][y].classList.toggle('playerShip');
            game.player.returnShip(currShip);
        }
    }
    else{ // If removing a ship
        game.player.returnShip(game.player.board.removeShip({'x': x, 'y': y}));
        currSelect.stack.pop();
        board.enableStack(currSelect.stack, currSelect.len === currSelect.stack.length);
    }
}

function startGame() {
    transitionClear();

    // Remove unnecessary buttons
    btnsDiv.removeChild(rndBtn);
    btnsDiv.removeChild(clrBtn);
    startBtn.textContent = 'Restart';

    let aiBoard = createBoard(extraBoard); // Ai's DOM board
    game.ai.generatePlacement(); // Generate random placements

    // Event listeners
    for(let x = 0; x < 10; x++)
        for (let y = 0; y < 10; y++) 
            aiBoard.arr[x][y].addEventListener('click', ()=>{turn(x, y, aiBoard)});
}

// initiates a turn (1 attack for each if no hits)
function turn(x, y, aiBoard){
    let res = game.player.attack(game.ai, {'x': x, 'y': y}); // Let player attack first
    if(!Array.isArray(res)){ // If missed
        aiBoard.arr[x][y].textContent = '✕';
        aiBoard.arr[x][y].disabled = true;

        res = game.ai.attack(game.player); // Ai's turn

        while(Array.isArray(res)){ // Let Ai play while he keeps hitting
            board.arr[res[0].x][res[0].y].textContent = '✕';
            board.arr[res[0].x][res[0].y].disabled = true;
            res = game.ai.attack(game.player);
        }   
        board.arr[res.x][res.y].textContent = '✕';
        board.arr[res.x][res.y].disabled = true;   
    }
    else{ // If hit
        aiBoard.arr[x][y].classList.add('aiShip') // Reveal ship
        res.forEach(coor=>{game // Mark surrounding as also checked
            aiBoard.arr[coor.x][coor.y].textContent = '✕';
            aiBoard.arr[coor.x][coor.y].disabled = true;
        })
    }
    if(game.isFinished()){
        startBtn.textContent = game.status;
        startBtn.style.color = game.status === 'won' ? 'green' : 'red';
        for(let x = 0; x < 10; x++)
            for (let y = 0; y < 10; y++) 
                aiBoard.arr[x][y].disabled = true;
    }
}

// Clear placing events and the extra div
function transitionClear(){   
    for(let x = 0; x < 10; x++)
        for (let y = 0; y < 10; y++) {    
            board.arr[x][y].disabled = true;
            board.arr[x][y].removeAttribute('onclick');
        }
    while(extraBoard.firstChild)
        extraBoard.removeChild(extraBoard.firstChild)
    extraBoard.className = '';
}

// Control buttons event listeners

startBtn.addEventListener('click', ()=>{
    if(game.status === 'placing'){    
        if(game.start())
            startGame();
    }
    else
        init();
})


