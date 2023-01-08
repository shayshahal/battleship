import ship from '../Logic/ship.js'

describe('ship', () => { 
    let shipTest;
    beforeAll(()=>{
        shipTest = ship(2);
    })
    describe('hits tests', ()=>{
        test('hit once, should not sink', () => { 
            expect(shipTest.hit()).toBeFalsy();
        })
        test('hit again, should sink', () => { 
            shipTest.hit();
            expect(shipTest.hit()).toBeTruthy();
        })
    })
})
