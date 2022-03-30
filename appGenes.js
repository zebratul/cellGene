
//таблица
$('.table').on('click', 'td', function () {
    console.log($(this).attr('data-column')," = y");
    console.log($(this).attr('data-row')," = x");
    })
let columns = 17, rows = 17;
function createGrid(columns, rows) {
    let table = $('.table');

    for (let i = 0; i < rows; i++) {
        let row = $('<tr>');
        table.append(row)
        for (let j = 0; j < columns; j++) {
            let cell = $('<td>')
            cell.attr('data-row', i);
            cell.attr('data-column', j)
            row.append(cell);
        }
    }
}
createGrid(columns, rows);

//рандомайзер старта
document.getElementById('1').addEventListener('click', () => {
    let whiteOut = document.querySelectorAll (`td`);
    whiteOut.forEach(Element => {
        Element.style.backgroundColor = 'white';
    });
    let x = Math.floor(Math.random() * rows);
    let y = Math.floor(Math.random() * columns);
    allCells[0].locX = x;
    allCells[0].locY = y;
    allCells[0].visual();
});

//рандом от до
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};
//цвета для мутаций
const colours = [`coral`, `cadetblue`, `darkseagreen`, `plum`, `tan`];

//cells objects
const allCells = [];
const baseCell = {
    //блюпринт для клеток.
    locX: 5,
    locY: 7,
    //написать проверку и подсчёт свободных мест:
    crowdCheck: function(target){
        let acc = 0;
        for (let i = -1; i < 2; i++){     
            if (allCells.find(obj => obj.locX === target.locX-1 && obj.locY === target.locY+i)) {
                acc++;
                };
            if (allCells.find(obj => obj.locX === target.locX+1 && obj.locY === target.locY+i)) {
                acc++;
                }
        };
        if (allCells.find(obj => obj.locX === target.locX && obj.locY === target.locY+1)) {
            acc++;
        }
        if (allCells.find(obj => obj.locX === target.locX && obj.locY === target.locY-1)) {
            acc++;
        }            
        return acc;
    },
    //переписать проверку на нормальную?

    //отрисовка клеток:
    visual: function(){
        let tds = document.querySelector(`td[data-row="${this.locX}"][data-column="${this.locY}"]`);
        tds.style.backgroundColor = `${this.colour}`;
    },
    reproducable: true,
    gen: 0,
    colour: colours[randomNumber(0, 5)],

    //размнож:
    reproduce: function (){     
        const newCell = Object.create(baseCell);
        if (this.crowdCheck(this) < 3 && this.reproducable === true) {
            newCell.locX = this.locX;
            newCell.locY = this.locY;      
            newCell.gen = this.gen+1;     
            i = 0;
            while (allCells.find(obj => obj.locX === newCell.locX && obj.locY === newCell.locY) && i < 4) { //генерим новые координаты пока не попадём на пустые
                Math.round(Math.random()) * 2 - 1 > 0 ? newCell.locX = this.locX+Math.round(Math.random()) * 2 - 1 : newCell.locY = this.locY+Math.round(Math.random()) * 2 - 1; //отползаем по случайной координате на 1 клетку в случайную сторону 
                i ++;
            }
            } else {
                return;
            };  

            if (newCell.locX === 0 || newCell.locY === 0 || newCell.locX === columns-1 || newCell.locY === rows-1){
                newCell.reproducable = false;
            } else {newCell.reproducable = true;}; //делаем клетки на крайних ячейках неразмножаемыеми чтобы они не лезли за пределы таблицы. Не знаю как сделать нормально. 
            
            if (randomNumber(1,10) > 8) { 
                newCell.colour = this.mutate();
            } else {newCell.colour = this.colour}; //шанс на смену цвета
            
            allCells.push(newCell); //сохраняем в коллекцию живых клеток
            newCell.visual(); //отрисовывем текущий цвет
    },

    //мутация, пока что только цвет
    mutate: function(){
        let c = this.colour;
        let r = randomNumber(0, 5);
        c = colours[r];
        return c;

    },

    //удаление из коллекции живых:
    death: function(){
        if (this.crowdCheck(this) > 2 || this.locX > columns || this.locY > rows) {
            console.log("gen: ", this.gen, this.locX, this.locY, "marked for death. Current index:", allCells.findIndex(item => item.gen === this.gen));
            let tds = document.querySelector(`td[data-row="${this.locX}"][data-column="${this.locY}"]`);
            tds.style.backgroundColor = 'white'; //красим клетку в белый
            allCells.splice(allCells.findIndex(item => item.gen === this.gen), 1); //удаляем из аррея
        };
    },
}
baseCell.reproduce(); //спавним стартовую
console.log(allCells);

//start or stop time.
let timeBool = false;
function time() {
    //call reproduce function of every cell
    let i = 0;
    let i2 = 0;
    let l = allCells.length;

    while (i < l) {
        allCells[i].reproduce();
        console.log(allCells);
        console.log(allCells.length);
        i++;
    };
    //call death function of every cell

    while (i2 < l) {
        allCells[i2].death(); //эта хрень иногда выдаёт ошибку «allCells[i2] is undefined». почему? трогает пустой элемент, удаляя его из под себя же? подумать как пофиксить  
        i2++;
    };
    //todo: сделать автоматическую с ожиданием 1000 ms 
};

document.getElementById('2').addEventListener('click', () => { //вызываем обходы по коллекции на размножение и смерти
    timeBool = timeBool ? false : true;
    console.log(timeBool);
    time();
});

//ручное размножение послежнего элемента
document.getElementById('3').addEventListener('click', () => {
        allCells[allCells.length-1].reproduce();
        console.log(allCells);
        console.log(allCells[allCells.length-1].crowdCheck(allCells[allCells.length-1]));
});


