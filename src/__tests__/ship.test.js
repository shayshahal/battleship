import ship from '../Logic/ship.js'



describe('ship tests', () => { 
    describe('hits tests', ()=>{
        let shipTest;
        beforeAll(()=>{
            shipTest = ship(3);
        })
        beforeEach(()=>{
            shipTest.hit();
        })
        test('hit once, should not sink', () => { 
            expect(shipTest.isSunk()).toBeFalsy();
        })
        test('hit again, should still not sink', () => { 
            expect(shipTest.isSunk()).toBeFalsy();
        })
        test('hit again, should sink', () => { 
            expect(shipTest.isSunk()).toBeTruthy();
        })
    })
})
