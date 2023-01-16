import {newPlayer} from "./player";

export const game = () =>{
    let status = 'placing';
    let player = newPlayer();
    let ai = newPlayer();

    const start = () =>{
        if(!player.isReady()){
            return false;
        }
        status = 'playing'
        return true;
    }

    const isFinished = () =>{
        if(ai.board.isDestroyed()){
            status = 'won';
            return true;
        }
        if(player.board.isDestroyed()){
            status = 'lost';
            return false;
        }
        return false;
    }

    return {
        get status(){return status}, 
        get player(){return player}, 
        get ai(){return ai},
        start,
        isFinished
    }
}