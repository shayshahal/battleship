import './board.css'
export default function createBoard(){
    const boardDiv = document.getElementById('player-board');
    const boardArr = Array.from(Array(10), ()=> []);
    boardDiv.classList.add('board');
    const nothing = document.createElement('div');
    boardDiv.append(nothing)
    for (let i = 0; i < 10; i++) {
        const index = document.createElement('div');
        index.textContent = i;
        boardDiv.append(index)
    }
    for (let i = 0; i < 10; i++) {
        const index = document.createElement('div');
        index.textContent = String.fromCharCode(('A'.charCodeAt() + i));
        boardDiv.append(index);
        for (let k = 0; k < 10; k++) {
            const square = document.createElement('button');
            square.classList.add('boardSquare');
            boardArr[i][k] = square;
            boardDiv.append(square);
        }
    }
    return boardArr;
}