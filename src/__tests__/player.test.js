import player from "../Logic/player";

describe('player tests', () => {
    let p, p2;
    beforeAll(()=>{
        p = player();
    })
    test('should initialize player', () => {
        expect(p).toBeInstanceOf(Object)
        expect(p.board).toBeInstanceOf(Object)
    })
    describe('ship taking tests', () => {
        p2 = player();
        test('should fail to place too many of the same ship', ()=>{
            p2.board.placeShip(p2.takeShip(1),{x: 5, y: 5})
            p2.board.placeShip(p2.takeShip(1),{x: 0, y: 0})
            p2.board.placeShip(p2.takeShip(1),{x: 9, y: 9})
            p2.board.placeShip(p2.takeShip(1),{x: 0, y: 9})
            expect(p2.takeShip(1)).toBeFalsy();
        })
        test("should be able to take a piece that's been emptied after you put it back", () =>{
            p2.returnShip(p2.board.removeShip({x: 0, y: 9}));
            expect(p2.takeShip(1)).toBeTruthy();
        })
    })
    test('should attack enemy and succeed and then fail', () => {
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
            expect(arr.flat().reduce((res, s)=> res += (s===-1)?0:s, 0)).toBe(50)
            expect(p.isReady()).toBeTruthy();
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