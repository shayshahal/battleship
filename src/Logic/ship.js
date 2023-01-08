export default ship = (len) => {
    let numOfTimesHit = 0;
    const hit = () => {numOfTimesHit++; return isSunk()};
    const isSunk = () => numOfTimesHit >= len;
    return {hit}
}