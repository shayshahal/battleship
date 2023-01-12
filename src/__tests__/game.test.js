import game from "../Logic/game";

describe('game loop tests', () => {
    let newGame;
    beforeAll(()=>{
        newGame = game();
    });
    test('should start with placing status', () => {
        expect(newGame.status).toMatch('placing')
    });
    test('player and ai should exist', ()=>{
        expect(newGame.player).toBeInstanceOf(Object);
        expect(newGame.ai).toBeInstanceOf(Object);
    })
    test('should try to start game and fail', () => {
        expect(newGame.start()).toBeFalsy();
        expect(newGame.status).toMatch('placing');
    })
    let arr, arr2;
    test('should try to start game and succeed', () => {
        arr = newGame.ai.generatePlacement();
        arr2 = newGame.player.generatePlacement();
        expect(newGame.start()).toBeTruthy();
        expect(newGame.status).toMatch("playing");
    })
    test('should finish game and change status to win', () => {
        for (let i = 0; i < 10; i++) 
            for (let k = 0; k < 10; k++)
                if(arr[i][k] > 0)
                    newGame.player.attack(newGame.ai, {x: i, y: k});
        expect(newGame.isFinished()).toBeTruthy();
        expect(newGame.status).toBe("won");
    })
    
})