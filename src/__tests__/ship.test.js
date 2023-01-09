import ship from '../Logic/ship.js'

describe('ship tests', () => { 
    let shipTest;
    beforeAll(()=>{
        shipTest = ship(3);
    })
    describe('hits tests', ()=>{
        shipTest.hit()
        test('hit once, should not sink', () => { 
            expect(shipTest.isSunk()).toBeFalsy();
        })
        shipTest.hit()
        test('hit again, should still not sink', () => { 
            expect(shipTest.isSunk()).toBeFalsy();
        })
        shipTest.hit()
        test('hit again, should sink', () => { 
            expect(shipTest.isSunk()).toBeTruthy();
        })
    })
})
