/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/DOM/board/board.js

const createBoard = (div) => {
    let arr = Array.from(Array(10), ()=> []);
        const boardDiv = div;
        boardDiv.classList.add('board');
        const nothing = document.createElement('div');
        boardDiv.append(nothing)
        for (let i = 0; i < 10; i++) {
            const index = document.createElement('div');
            index.textContent = i+1;
            boardDiv.append(index)
        }
        for (let i = 0; i < 10; i++) {
            const index = document.createElement('div');
            index.textContent = String.fromCharCode(('A'.charCodeAt() + i));
            boardDiv.append(index);
            for (let k = 0; k < 10; k++) {
                const square = document.createElement('button');
                square.classList.add('boardSquare');
                arr[i][k] = square;
                boardDiv.append(square);
            }
        }

    const enableAll = () =>{
        for (let i = 0; i < 10; i++)
            for (let k = 0; k < 10; k++){    
                if(arr[i][k].className.includes("playerShip"))
                    arr[i][k].disabled = true;    
                else
                    arr[i][k].disabled = false;   
            }
    }

    const enableStack = (stack, isDone) => {
        if(!stack.length){   
            enableAll();
            return;
        }
        for (let i = 0; i < 10; i++)
            for (let k = 0; k < 10; k++)
                arr[i][k].disabled = true;   

        arr[stack.at(-1).x][stack.at(-1).y].disabled = false;
        if(isDone)
            return;
        if(stack[0].y === stack.at(-1).y){
            if(stack.at(-1).x >= stack[0].x)
                arr[Math.min(stack.at(-1).x+1, 9)][stack.at(-1).y].disabled = false;
            if(stack.at(-1).x <= stack[0].x)
                arr[Math.max(stack.at(-1).x-1, 0)][stack.at(-1).y].disabled = false;
        }
        if(stack[0].x === stack.at(-1).x){
            if(stack.at(-1).y >= stack[0].y)
                arr[stack.at(-1).x][Math.min(stack.at(-1).y+1, 9)].disabled = false;
            if(stack.at(-1).y <= stack[0].y)
                arr[stack.at(-1).x][Math.max(stack.at(-1).y-1, 0)].disabled = false;
        }
    }

    return {
        enableAll,
        enableStack,
        get arr(){return arr}
    }
}


;// CONCATENATED MODULE: ./src/Logic/gameBoard.js
const gameBoard = () =>{
    // Initialize board
    let board = Array.from(Array(10), ()=> {
        return Array.from(Array(10), ()=>{return {ship: null, checked: false}})
    });
    // Initialize counter that tracks how many ships are alive on the board
    let counter = 0;
    const checkValidity = (ship, coor) => {
        // Check if out of bounds
        if(outOfBounds(coor))
            return false;
        // Runs on adjacent coordinates
        for (let i = -1; i < 2; i++) {
            for (let k = -1; k < 2; k++){
                const curr = board[coor.x+i] ? board[coor.x+i][coor.y+k] : null;
                // If spot is out of bounds or
                if(curr && curr.ship){
                    /* Checks if 
                        1.coordinates are not already occupied or diagonally adjacent to an occupied spot.
                        2.coordinates are adjacent to a different ship
                    */
                    if(((i === 0 && k === 0) || (i !== 0 && k !== 0)) || curr.ship !== ship)
                        return false;
                }
            }        
        }
        return true;
    }
    const outOfBounds = (coor) => (coor.x > 9 || coor.x < 0 || coor.y > 9 || coor.y < 0);

    const removeShip = (coor) => {
        if(outOfBounds(coor))
            return false;
        let res = board[coor.x][coor.y].ship;
        board[coor.x][coor.y].ship = null;
        return res;
    };
    
    const placeShip = (ship, coor) => {
        if(ship && checkValidity(ship, coor)){
            board[coor.x][coor.y].ship = ship;
            return true;
        }
        return false;
    }
    const isDestroyed = () => counter === 10;
    
    const receiveAttack = (coor) =>{
        board[coor.x][coor.y].checked = true;
        if(board[coor.x][coor.y].ship){
            let checks = []; // matrix of checked squares squares
            board[coor.x][coor.y].ship.hit();
            // If hit, all diagonal adjacencies are also known to not be occupied
            for(let i = -1; i < 3; i += 2)
                for(let k = -1; k < 3; k += 2)
                    if(!outOfBounds({x: coor.x+i, y: coor.y+k})){
                        board[coor.x+i][coor.y+k].checked = true;
                        checks.push({x: coor.x+i, y: coor.y + k});
                    }
            if(board[coor.x][coor.y].ship.isSunk()){   
                counter++;
                // If ship is sunk, you can also be sure that all horizontal and vertical adjacent squares are also checked 
                if(!outOfBounds({x: coor.x, y: coor.y + 1}) && !board[coor.x][coor.y+1].ship)
                    checks.push({x: coor.x, y: coor.y + 1});
                if(!outOfBounds({x: coor.x, y: coor.y - 1}) && !board[coor.x][coor.y-1].ship)
                    checks.push({x: coor.x, y: coor.y - 1});
                if(!outOfBounds({x: coor.x - 1, y: coor.y}) && !board[coor.x-1][coor.y].ship)
                    checks.push({x: coor.x - 1, y: coor.y});
                if(!outOfBounds({x: coor.x + 1, y: coor.y}) && !board[coor.x+1][coor.y].ship)
                    checks.push({x: coor.x + 1, y: coor.y});
            }
            checks.unshift(coor);
            return checks;
        }
        return coor;
    }
    const clear = () =>{
        let arr = [];
        for (let i = 0; i < 10; i++) {
            for (let k = 0; k < 10; k++) {
                if(board[i][k].ship)
                    arr.push(board[i][k].ship)
                board[i][k].ship = null;
                board[i][k].checked = null;
            }
        }
        counter = 0;
        return arr;
    }
    
    return {placeShip, removeShip, receiveAttack, isDestroyed, clear}
}
;// CONCATENATED MODULE: ./src/Logic/ship.js
const ship = (len) => {
    let numOfTimesHit = 0;
    const hit = () => numOfTimesHit++;
    const isSunk = () => numOfTimesHit >= len;
    return {hit, isSunk, get len(){return len}}
}
;// CONCATENATED MODULE: ./src/Logic/player.js
 

const newPlayer = () =>{

    let board = gameBoard();
    let moves = Array.from(Array(10),()=> {return new Array(10).fill(false)});
    let prevAndFuture = {prev: null, future: []};
    // Initialize ships to be taken 
    let ships = new Map();  
    for(let i = 0; i < 4; i++)
        ships.set(ship(1), 1);
    for(let i = 0; i < 3; i++)
        ships.set(ship(2), 2);
    for(let i = 0; i < 2; i++)
        ships.set(ship(3), 3);
    ships.set(ship(4), 4);

    // If theres no coor input let the computer play
    const attack = (enemy, coor = null) => {
        let res = enemy.board.receiveAttack(coor??generateAttack())
        if(Array.isArray(res)){    
            for (let i = 1; i < res.length; i++) 
                moves[res[i].x][res[i].y] = true;   
        }   
        if(!coor && Array.isArray(res) && prevAndFuture.future.length === 0){
            prevAndFuture.prev = res[0]
            prevAndFuture.future = [];
            if(res[0].y+1 <= 9)
                prevAndFuture.future.push({x: res[0].x, y: res[0].y+1})
            if(res[0].y-1 >= 0)
                prevAndFuture.future.push({x: res[0].x, y: res[0].y-1})
            if(res[0].x+1 <= 9)
                prevAndFuture.future.push({x: res[0].x+1, y: res[0].y})
            if(res[0].x-1 >= 0)
                prevAndFuture.future.push({x: res[0].x-1, y: res[0].y}) 
        }
        else if(!coor && Array.isArray(res) && prevAndFuture.future.length !== 0){
            let dir = res[0].x === prevAndFuture.prev.x ? 'x' : 'y';
            if(dir === 'x'){
                if(res[0].x+1 <= 9)
                    prevAndFuture.future.push({x: res[0].x+1, y: res[0].y})
                if(res[0].x-1 >= 0)
                    prevAndFuture.future.push({x: res[0].x-1, y: res[0].y}) 
            }
            else{
                if(res[0].y+1 <= 9)
                    prevAndFuture.future.push({x: res[0].x, y: res[0].y+1})
                if(res[0].y-1 >= 0)
                    prevAndFuture.future.push({x: res[0].x, y: res[0].y-1})                
            }
        }
        return res;
    }; 
    
    const takeShip = (len) =>{
        for(const [k, v] of ships){
            if(k.len === len && v !== 0){    
                ships.set(k, v-1);
                return k;
            }
        }
        return null;
    }

    const returnShip = (ship = null) => {
        if(ship) 
            ships.set(ship, ships.get(ship)+1)
        else
            board.clear().forEach(s=>ships.set(s, s.len))
    };

    //Checks if game is ready to start
    const isReady = ()=> {
        for(const v of ships.values())
            if(v !== 0)
                return false;
        return true;
    }

    const generateAttack =  () =>{
        let move = prevAndFuture.future.pop();
        let rndX = move ? move.x : ~~(Math.random()*10), rndY = move ? move.y : ~~(Math.random()*10);
        // Randomize coordinates until you hit one that wasn't attacked previously
        while(moves[rndX][rndY]){    
            move = prevAndFuture.future.pop();
            rndX = move ? move.x : ~~(Math.random()*10), rndY = move ? move.y : ~~(Math.random()*10);
        }
        moves[rndX][rndY] = true;
        return {x: rndX, y: rndY}
    }
    // n - ships to place, arr - the entire board marked by which kind of ship is on a spot
    const generatePlacement = (n = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4], arr = Array.from(Array(10), ()=> new Array(10).fill(0))) =>{
        // If n equals 0 it means we are done with placing ships :)
        if(n.length === 0)  
            return arr;

        let len = n.pop();
        let coor = {x: ~~(Math.random()*10), y: ~~(Math.random()*10)}; // Get random coordinates
        if(arr[coor.x][coor.y] !== 0) // If coordinate already occupied, try again
            return generatePlacement([...n, len], arr);

        const inBounds = (x, y) => (x >= 0 && x <= 9 && y >= 0 && y <= 9); // Bounds check

        if(len === 1) // Special case for len === 1 because the diagonals do not fill all of the surroundings
        {
            for(let j = -1; j < 2; j++)
                for(let k = -1; k < 2; k++)
                    if(inBounds(coor.x + j, coor.y+k))
                    {    
                        if(j === 0&& k === 0)
                        {
                            board.placeShip(takeShip(len),{x: coor.x + j, y: coor.y + k});
                            arr[coor.x+j][coor.y+k] = len;
                        }
                        else
                            arr[coor.x+j][coor.y+k] = -1;      
                    }
            return generatePlacement(n, arr);
        }
        let vector = checkVector(coor, len, arr); // call checkVector to randomly decide which direction to go

        // If vector is empty, that means theres no place for the ship we want to place, therefore try again
        if(vector === undefined) 
            return generatePlacement([...n, len], arr);
        
        // All of this last section is putting the result and also not allowing ships around it
        // Mark the place at the start on the opposite direction of the vector 
        if(inBounds(coor.x - 1*vector.x, coor.y - 1*vector.y))
            arr[coor.x - 1*vector.x][coor.y - 1*vector.y] = -1;
            
        for (let i = 0; i < len; i++)
        {    
            board.placeShip(takeShip(len),{x: coor.x + i*vector.x, y: coor.y + i*vector.y});
            arr[coor.x + i*vector.x][coor.y + i*vector.y] = len;
            // Diagonals adjacencies 
            for(let j = -1; j < 2; j += 2)
                for(let k = -1; k < 2; k += 2)
                    if(inBounds(coor.x + j + i*vector.x, coor.y + k + i*vector.y))
                        arr[coor.x + j + i*vector.x][coor.y + k + i*vector.y] = -1;
        }
        // Mark the place at the end on the same direction of the vector 
        if(inBounds(coor.x + len*vector.x, coor.y + len*vector.y))
            arr[coor.x + len*vector.x][coor.y + len*vector.y] = -1;

        return generatePlacement(n, arr);
    }

    const checkVector = (coor, len, arr) =>{
        let options = [];
        // lr - left/right, ud - up/down
        let checkDirection = (lr, ud) =>{
            for (let i = 0; i < len; i++) {
                let spot = arr[coor.x + (i*lr)]?arr[coor.x + (i*lr)][coor.y + (i*ud)]:null;
                if(spot !== 0)
                    return;
            }
            options.push({x: lr, y: ud})
        }
        // All directions check;
        checkDirection(0, 1)
        checkDirection(0, -1)
        checkDirection(-1, 0)
        checkDirection(1, 0)

        return options[~~(Math.random() * options.length)]; // Get a random direction from the available options
    }
    return {
        get board(){return board}, 
        get ships(){return ships},
        attack,
        takeShip,
        generatePlacement, 
        returnShip,
        isReady
    }
}
;// CONCATENATED MODULE: ./src/Logic/game.js


const newGame = () =>{
    let status = 'placing';
    let player = newPlayer();
    let ai = newPlayer();

    const start = () =>{
        if(!player.isReady()){
            return false;
        }
        status = 'playing'
        return true;
    }

    const isFinished = () =>{
        if(ai.board.isDestroyed()){
            status = 'won';
            return true;
        }
        if(player.board.isDestroyed()){
            status = 'lost';
            return true;
        }
        return false;
    }

    return {
        get status(){return status}, 
        get player(){return player}, 
        get ai(){return ai},
        start,
        isFinished
    }
}
;// CONCATENATED MODULE: ./src/DOM/shipSelection/shipSelect.js

const div = document.getElementById('extra-space');

function createSelection(){
    while(div.firstChild)
        div.removeChild(div.firstChild);
    div.classList.add('ships');    
    let arr = [];
    for (let i = 4; i > 0; i--) 
        for(let k = 0; k <= 4-i; k++)
            arr.push({radio: createShip(i), len: i, stack: []});  
    return arr;
}

function createShip(len){
    const label = document.createElement('label');
    label.for = 'ship' + len;
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = len;
    radio.name = 'ship';
    label.append(radio);
    for(let i = 0; i < len; i++){
        const square = document.createElement('div');
        square.classList.add('shipPiece')
        square.classList.add('playerShip');
        label.append(square);
    }
    div.append(label);
    return label;
}
;// CONCATENATED MODULE: ./src/DOM/index.js





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



/******/ })()
;
//# sourceMappingURL=main.8126f8ac799d08424c38.js.map