import './shipSelect.css'
const div = document.getElementById('extra-space');

export default function createSelection(){
    while(div.firstChild)
        div.removeChild(div.firstChild);
    div.classList.add('ships');    
    let arr = [];
    for (let i = 4; i > 0; i--) 
        for(let k = 0; k <= 4-i; k++)
            arr.push({radio: createShip(i), len: i, stack: []});  
    return arr;
}

function createShip(len){
    const label = document.createElement('label');
    label.for = 'ship' + len;
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = len;
    radio.name = 'ship';
    label.append(radio);
    for(let i = 0; i < len; i++){
        const square = document.createElement('div');
        square.classList.add('shipPiece')
        square.classList.add('playerShip');
        label.append(square);
    }
    div.append(label);
    return label;
}