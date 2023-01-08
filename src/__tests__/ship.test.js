import ship from '../Logic/ship.js'

describe('ship tests', () => { 
    let shipTest;
    beforeAll(()=>{
        shipTest = ship(3);
    })
    describe('hits tests', ()=>{
        test('hit once, should not sink', () => { 
            expect(shipTest.hit()).toBeFalsy();
        })
        test('hit again, should still not sink', () => { 
            expect(shipTest.hit()).toBeFalsy();
        })
        test('hit again, should sink', () => { 
            expect(shipTest.hit()).toBeTruthy();
        })
    })
})
