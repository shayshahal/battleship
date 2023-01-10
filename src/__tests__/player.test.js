import player from "../Logic/player";
import gameBoard from "../Logic/gameBoard";
import ship from "../Logic/ship";

describe('player tests', () => {
    let p
    beforeAll(()=>{
        p = player();
    })
    test('should initialize player', () => {
        expect(p.board).toBeInstanceOf(gameBoard)
        expect(p.board).toStrictEqual(gameBoard())
        expect(p.enemy).toBeNull();
    })
    test('should attack enemy and succeed and then fail', () => {
        let p2 = player();
        p2.board.placeShip(ship(1),{x: 5, y: 5})
        expect(p.attack(p2, {x: 5, y: 5})).toBeTruthy()
        expect(p.attack(p2, {x: 4, y: 5})).toBeFalsy();
    })
})