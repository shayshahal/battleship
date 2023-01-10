import gameBoard from "./gameBoard"; 
export default player = () =>{
    let board = gameBoard();
    let moves = Array.from(Array(3),()=> {return new Array(3).fill(false)})
    const attack = (enemy, coor = null) => enemy.board.receiveAttack(coor??generateAttack());
    const generateAttack =  () =>{
        let rndX = ~~(Math.random*10), rndY = ~~(Math.random*10);
        // Randomize coordinates until you hit one that wasn't attacked previously
        while(moves[rndX][rndY])
            rndX = ~~(Math.random*10), rndX = ~~(Math.random*10);
        return {x: rndX, y: rndY}
    }
    return {
        get board(){return board;}, 
        attack
    }
}