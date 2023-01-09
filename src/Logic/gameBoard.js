export default gameBoard = () =>{
    // Initialize board
    let board = Array.from(Array(10), ()=> {
        return Array.from(Array(10), ()=>{return {ship: null, checked: false}})
    });
    // Initialize counter that tracks how many ships are alive on the board, index+1 = length of ship
    let counter = [4, 3, 2, 1];
    const checkValidity = (ship, coor) => {
        // Check if out of bounds
        if(coor.x > 9 || coor.x < 0 || coor.y > 9 || coor.y < 0)
            return false;
        // Runs on adjacent coordinates
        for (let i = -1; i < 2; i++) {
            for (let k = -1; k < 2; k++){
                const curr = board[coor.x+i][coor.y+k];
                // If spot is out of bounds or
                if(curr){
                    /* Checks if 
                        1.coordinates are not already occupied or diagonally adjacent to an occupied spot.
                        2.coordinates are adjacent to another ship
                    */
                    if((((i === 0 && k === 0) || (i !== 0 && k !== 0)) && curr.ship) || curr.ship !== ship)
                        return false;
                }
            }        
        }
        return true;
    }
    const removeShip = (coor) => board[coor.x, coor.y].ship = null;
    const placeShip = (ship, coor) => {
        if(checkValidity(ship, coor)){
            board[coor.x, coor.y].ship = ship;
            return true;
        }
        return false;
    }
    const isDestroyed = () => counter.every(s=> !s);
    
    const receiveAttack = (coor) =>{
        if(board[coor.x, coor.y].ship){
            board[coor.x, coor.y].ship.hit();
        }

        return false
    }
    return {placeShip, removeShip, receiveAttack, isDestroyed}
}