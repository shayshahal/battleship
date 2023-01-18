import './board.css'
export const createBoard = (div) => {
    // Dom creation
    let arr = Array.from(Array(10), ()=> []);
        const boardDiv = div;
        boardDiv.classList.add('board');
        const nothing = document.createElement('div'); // Empty square at top left
        boardDiv.append(nothing)

        for (let i = 0; i < 10; i++) { // Indexes
            const index = document.createElement('div');
            index.textContent = i+1;
            boardDiv.append(index)
        }

        for (let i = 0; i < 10; i++) {
            // Indexes
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

    // Enable all squares that are not a ship
    const enableAll = () =>{
        for (let i = 0; i < 10; i++)
            for (let k = 0; k < 10; k++){    
                if(arr[i][k].className.includes("playerShip"))
                    arr[i][k].disabled = true;    
                else
                    arr[i][k].disabled = false;   
            }
    }

    // Enable squares based on previous user inputs
    const enableStack = (stack, isDone) => {
        if(!stack.length){  
            enableAll();
            return;
        }

        // disable all at first
        for (let i = 0; i < 10; i++) 
            for (let k = 0; k < 10; k++)
                arr[i][k].disabled = true;   

        arr[stack.at(-1).x][stack.at(-1).y].disabled = false; // Enable current input

        if(isDone) // If user has put all the parts of the ship, don't let him continue
            return;

        // Both happen if user only inputs 1 square
        if(stack[0].y === stack.at(-1).y){ // If user chose to go vertically
            if(stack.at(-1).x >= stack[0].x)
                arr[Math.min(stack.at(-1).x+1, 9)][stack.at(-1).y].disabled = false;
            if(stack.at(-1).x <= stack[0].x)
                arr[Math.max(stack.at(-1).x-1, 0)][stack.at(-1).y].disabled = false;
        }
        if(stack[0].x === stack.at(-1).x){ // If user chose to go horizontally
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

