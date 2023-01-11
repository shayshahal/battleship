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
    const generatePlacement = (n = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4], arr = Array.from(Array(10), ()=> new Array(10).fill(0))) =>{
        if(n.length === 0)
            return arr;
        let len = n.pop();
        let coor = {x: ~~(Math.random()*10), y: ~~(Math.random()*10)};
        let vector = checkVector(coor, len, arr);
        if(!vector)
            return generatePlacement([...n, len], arr);
        for (let i = 0; i < len; i++)
            arr[coor.x + i*vector.x][coor.y + i*vector.y] = len;
        return generatePlacement(n, arr);
    }
    const checkVector = (coor, len, arr) =>{
        let options = [];
        let checkDirection = (lr, ud) =>{
            for (let i = 0; i < len; i++) {
                let spot = arr[coor.x + (i*l)]?arr[coor.x + (i*lr)][coor.y + (i*ud)]:null;
                let lookFurther = arr[coor.x+1 + (i*l)]?arr[coor.x+1 + (i*lr)][coor.y + (i*ud)]:0;
                if(!spot || lookFurther !== 0)
                    return;
            }
            options.push({x: lr, y: ud})
        }
        checkDirection(0, 1)
        checkDirection(0, -1)
        checkDirection(-1, 0)
        checkDirection(1, 0)
        return options[~~(Math.random) * options.length];
    }
    return {
        get board(){return board;}, 
        attack,
        generatePlacement
    }
}