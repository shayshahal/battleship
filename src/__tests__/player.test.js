import player from "../Logic/player";
import ship from "../Logic/ship";

describe('player tests', () => {
    let p
    beforeAll(()=>{
        p = player();
    })
    test('should initialize player', () => {
        expect(p).toBeInstanceOf(Object)
        expect(p.board).toBeInstanceOf(Object)
    })
    test('should attack enemy and succeed and then fail', () => {
        let p2 = player();
        p2.board.placeShip(ship(1),{x: 5, y: 5})
        expect(p.attack(p2, {x: 5, y: 5})).toBeTruthy()
        expect(p.attack(p2, {x: 4, y: 5})).toBeFalsy();
    })
    describe('random ship placements', () => {
        let arr;
        beforeAll(()=>{
            arr = p.generatePlacement();
        })
        test('should generate an array', () =>{ 
            expect(arr).toBeInstanceOf(Array)
        });
        
        test("should generate right amount of ships", ()=> {
            expect(arr.flat().reduce((res, s)=> res += s, 0)).toBe(20)
        });

        test("should generate same ship on the same row/column", ()=> {
            let rnd = ~~(Math.random*4) + 1;
            let count = 0;
            let saved = [];
            expect(arr.some((a, y)=> {
                a.some((s, x)=> {
                    if(s === rnd){   
                        count++;
                        saved = [x, y]
                    }
                    return ((s === rnd) && (count === 2) && ((saved[0] !== x) || (saved[1] !== y)))
                })        
            })).toBeFalsy();
        });
    });
})