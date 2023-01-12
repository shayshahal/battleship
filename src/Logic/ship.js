export default ship = (len) => {
    let numOfTimesHit = 0;
    const hit = () => numOfTimesHit++;
    const isSunk = () => numOfTimesHit >= len;
    return {hit, isSunk, get len(){return len}}
}