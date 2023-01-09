export default ship = (len) => {
    const length = len;
    let numOfTimesHit = 0;
    const hit = () => numOfTimesHit++;
    const isSunk = () => numOfTimesHit >= length;
    return {hit, isSunk}
}