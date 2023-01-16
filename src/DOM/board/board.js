import './board.css'
export const createBoard = (div) => {
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
                if(arr[i][k].className.includes("ship"))
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

