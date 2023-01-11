export default gameBoard = () =>{
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

    const removeShip = (coor) => board[coor.x][coor.y].ship = null;
    
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
                    if(!outOfBounds({x: coor.x+i, y: coor.y+k}))
                    {
                        board[coor.x+i][coor.y+k].checked = true;
                        checks.push({x: coor.x+i, y: coor.y + k});
                    }
            if(board[coor.x][coor.y].ship.isSunk())
            {   
                counter++;
                // If ship is sunk, you can also be sure that all horizontal and vertical adjacent squares are also checked 
                if(!outOfBounds({x: coor.x, y: coor.y + 1}))
                    checks.push({x: coor.x, y: coor.y + 1});
                if(!outOfBounds({x: coor.x, y: coor.y - 1}))
                    checks.push({x: coor.x, y: coor.y - 1});
                if(!outOfBounds({x: coor.x - 1, y: coor.y}))
                    checks.push({x: coor.x - 1, y: coor.y});
                if(!outOfBounds({x: coor.x + 1, y: coor.y}))
                    checks.push({x: coor.x + 1, y: coor.y});
            }
            checks.unshift({x: coor.x, y: coor.y});
            return checks;
        }
        return false;
    }
    return {placeShip, removeShip, receiveAttack, isDestroyed}
}