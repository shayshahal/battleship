import gameBoard from "./gameBoard"; 
export default player = () =>{

    let board = gameBoard();
    let moves = Array.from(Array(3),()=> {return new Array(3).fill(false)})
    
    // If theres no coor input let the computer play
    const attack = (enemy, coor = null) => enemy.board.receiveAttack(coor??generateAttack()); 

    const generateAttack =  () =>{
        let rndX = ~~(Math.random*10), rndY = ~~(Math.random*10);
        // Randomize coordinates until you hit one that wasn't attacked previously
        while(moves[rndX][rndY])
            rndX = ~~(Math.random*10), rndX = ~~(Math.random*10);
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
                        arr[coor.x+j][coor.y+k] = (j===0&&k===0)? len : -1;
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
        get board(){return board;}, 
        attack,
        generatePlacement
    }
}