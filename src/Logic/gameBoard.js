export const gameBoard = () =>{
    // Initialize board
    let board = Array.from(Array(10), ()=> {
        return Array.from(Array(10), ()=>{})
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
                if(curr){
                    /* Checks if 
                        1.coordinates are not already occupied or diagonally adjacent to an occupied spot.
                        2.coordinates are adjacent to a different ship
                    */
                    if(((i === 0 && k === 0) || (i !== 0 && k !== 0)) || curr !== ship)
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
        let res = board[coor.x][coor.y];
        board[coor.x][coor.y] = null;
        return res; // Return the ship that was removed in order to put it back in the player's hands
    };
    
    const placeShip = (ship, coor) => {
        if(ship && checkValidity(ship, coor)){
            board[coor.x][coor.y] = ship;
            return true;
        }
        return false;
    }
    const isDestroyed = () => counter === 10;
    
    const receiveAttack = (coor) =>{
        if(board[coor.x][coor.y]){
            let checks = []; // matrix of checked squares squares
            board[coor.x][coor.y].hit();
            // If hit, all diagonal adjacencies are also known to not be occupied
            for(let i = -1; i < 3; i += 2)
                for(let k = -1; k < 3; k += 2)
                    if(!outOfBounds({x: coor.x+i, y: coor.y+k}))
                        checks.push({x: coor.x+i, y: coor.y + k});
                    
            if(board[coor.x][coor.y].isSunk()){   
                counter++;
                // If ship is sunk, you can also be sure that all horizontal and vertical adjacent squares are also checked 
                if(!outOfBounds({x: coor.x, y: coor.y + 1}) && !board[coor.x][coor.y+1])
                    checks.push({x: coor.x, y: coor.y + 1});
                if(!outOfBounds({x: coor.x, y: coor.y - 1}) && !board[coor.x][coor.y-1])
                    checks.push({x: coor.x, y: coor.y - 1});
                if(!outOfBounds({x: coor.x - 1, y: coor.y}) && !board[coor.x-1][coor.y])
                    checks.push({x: coor.x - 1, y: coor.y});
                if(!outOfBounds({x: coor.x + 1, y: coor.y}) && !board[coor.x+1][coor.y])
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
                if(board[i][k]) // If there's a ship, store it to put it back in the player's hands
                    arr.push(board[i][k])
                board[i][k] = null;
            }
        }
        counter = 0;
        return arr;
    }
    
    return {placeShip, removeShip, receiveAttack, isDestroyed, clear}
}