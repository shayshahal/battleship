import gameBoard from '../Logic/gameBoard.js'
import battleship from '../Logic/ship.js'
describe('gameBoard tests', () => { 
    let board, ship, ship2;
    beforeAll(()=> {
        board = gameBoard();
    })
    beforeEach(()=>{
        ship = battleship(2);
        ship2 = battleship(2);
    })
    describe('ship placing tests', () => { 
        test('should fail to place a outside of bounds', () => {
            let rndX = ~~(Math.random*20);
            let rndY = rndX - 10;
            expect(board.placeShip(ship, {x: rndX, y:rndY})).toBeFalsy();
        })
        test('should place a part of a ship successfully', () => { 
            expect(board.placeShip(ship, {x: 4, y:4})).toBeTruthy();
        });
        test('should fail to place a new ship on/near the previous one', () => {
            let offsetX = ~~(Math.random*3) - 1; 
            let offsetY = ~~(Math.random*3) - 1; 
            expect(board.placeShip(ship2, {x: 4 + offsetX, y:4 + offsetY})).toBeFalsy();
        })
        test('should fail to place a second part of the ship diagonally', () => {
            let offsetX = 1 - 2*~~(Math.random*2);
            let offsetY = 1 - 2*~~(Math.random*2);
            expect(board.placeShip(ship2, {x: 4 + offsetX, y:4 + offsetY})).toBeFalsy();
        })
        test('should place a second part of the ship near the first', () => {
            expect(board.placeShip(ship, {x: 4, y: 5})).toBeTruthy();
        });
        test('should place a new ship', () => {
            expect(board.placeShip(ship2, {x: 3, y:6})).toBeTruthy();
        });
    });
    describe('Receive attack tests', () => {
        
    })
})