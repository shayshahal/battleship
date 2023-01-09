import gameBoard from '../Logic/gameBoard.js'
import battleship from '../Logic/ship.js'

let board, shipArr = new Array(4);

    board = gameBoard();
    for (let i = 0; i < 4; i++) {
        shipArr[i] = Array.from(Array(4-i), () => battleship(i+1)); 
    }


describe('gameBoard tests', () => { 
    
    describe('ship placing/removing tests', () => { 
        test('should fail to place a outside of bounds', () => {
            let rndX = ~~(Math.random*20);
            let rndY = rndX - 10;
            expect(board.placeShip(shipArr[0][0], {x: rndX, y:rndY})).toBeFalsy();
        })

        test('should place a part of a ship successfully', () => { 
            expect(board.placeShip(shipArr[1][0], {x: 6, y:4})).toBeTruthy();
        });
        test('should fail to place a second part of the ship on the same spot', () => {
            expect(board.placeShip(shipArr[1][0], {x: 6, y:4})).toBeFalsy();
        })
        test('should place a part of a ship successfully on the same spot after removal', () => {
            board.removeShip({x: 6, y:4});   
            expect(board.placeShip(shipArr[1][0], {x: 6, y:4})).toBeTruthy();
        });
        test('should fail to place a second part of the ship diagonally', () => {
            let offsetX = 1 - (2*(~~(Math.random*2)));
            let offsetY = 1 - (2*(~~(Math.random*2)));
            expect(board.placeShip(shipArr[1][0], {x: 6 + offsetX, y:4 + offsetY})).toBeFalsy();
        })

        test('should fail to place a new ship on/near the previous one', () => {
            let offsetX = ~~(Math.random*3) - 1; 
            let offsetY = ~~(Math.random*3) - 1; 
            expect(board.placeShip(shipArr[0][1], {x: 6 + offsetX, y:4 + offsetY})).toBeFalsy();
        })
        
        test('should place a second part of the ship near the first', () => {
            expect(board.placeShip(shipArr[1][0], {x: 7, y: 4})).toBeTruthy();
        });

        test('should place a new ship', () => {
            expect(board.placeShip(shipArr[0][0], {x: 0, y:0})).toBeTruthy();
        });
    });
    describe('Receive attack tests', () => {
        // Initialize board for check
        board.placeShip(shipArr[0][1], {x:9, y:0})
        board.placeShip(shipArr[0][2], {x:0, y:2})
        board.placeShip(shipArr[0][3], {x:9, y:2})
        for(let i = 0; i < 2; i++)
            board.placeShip(shipArr[1][1], {x:6+i, y:0});
        for(let i = 0; i < 2; i++)
            board.placeShip(shipArr[1][2], {x:6+i, y:2});
        for (let i = 0; i < 3; i++) 
            board.placeShip(shipArr[2][0], {x:2+i, y:0});
        for (let i = 0; i < 3; i++) 
            board.placeShip(shipArr[2][1], {x:2, y:2});
        for (let i = 0; i < 4; i++) 
            board.placeShip(shipArr[3][0], {x:0+i, y:4});
        
        test('should attack ship successfully', () => {
            expect(board.receiveAttack({x: 0, y: 0})).toBeTruthy();
        });

        test('should miss ship and fail', () => {
            expect(board.receiveAttack({x: 0, y: 1})).toBeFalsy();
        });
    })
    describe('is board destroyed tests', () => {
        test('check if game is done, should be false', () => { 
            expect(board.isDestroyed()).toBeFalsy() 
        })

        test('check if game is done again, should still be false', () => {           
            // Destroy all board but one
            board.receiveAttack({x: 9, y: 0});
            board.receiveAttack({x: 0, y: 2});
            board.receiveAttack({x: 9, y: 2});
            for (let i = 0; i < 2; i++)
                board.receiveAttack({x: 6+i, y: 0});
            for (let i = 0; i < 2; i++)
                board.receiveAttack({x: 6+i, y: 2});
            for (let i = 0; i < 2; i++)
                board.receiveAttack({x: 6+i, y: 4});
            for (let i = 0; i < 3; i++)
                board.receiveAttack({x: 2+i, y: 0});
            for (let i = 0; i < 3; i++)
                board.receiveAttack({x: 2+i, y: 2});
            for (let i = 0; i < 3; i++)
                board.receiveAttack({x: 0+i, y: 4});

            expect(board.isDestroyed()).toBeFalsy()
        })
        
        test('check if game is done again, should be true', () => { 
            
        // Destroy the last part of the big piece
            board.receiveAttack({x: 3, y: 4});
            expect(board.isDestroyed()).toBeTruthy()
        })
    })
})
