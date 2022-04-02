
//таблица
$('.table').on('click', 'td', function () {
    console.log($(this).attr('data-row'),"= x");
    console.log($(this).attr('data-column'),"= y");
});

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
    let x = randomNumber(0, rows);
    let y = randomNumber(0, columns);
    allCells[0].locX = x;
    allCells[0].locY = y;
    allCells.splice(1); //удаляем все клетки из аррея, кроме стартовой
    console.log(allCells);
    allCells[0].visual();
});

//рандом от до
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

/* возвращает случайное число, представляющее позицию клетки */
function getRandomLocation() {
    return Math.round(Math.random()) * 2 - 1
}

/* проверяем, не находится ли клетка на границах таблицы */
function isOnTableEdge(cell, rows, cols) {
    /* проверяем правую и левую границы */
    if (newCell.locX === 0 || newCell.locX === cols - 1) {
        return true;
    }
    /* проверяем верхнюю и нижнюю границы */
    if (newCell.locY === 0 || newCell.locX === rows - 1) {
        return true;
    }

    return false;
}

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
    reproduce: function () {     
        const newCell = Object.create(baseCell);
        if (this.crowdCheck(this) < 3 && this.reproducable === true) {
            newCell.locX = this.locX;
            newCell.locY = this.locY;      
            newCell.gen = this.gen+1;     
            newCell.dying = false;
            let i = 0;
            while (allCells.find(obj => obj.locX === newCell.locX && obj.locY === newCell.locY) && i < 4) { //генерим новые координаты пока не попадём на пустые
                //отползаем по случайной координате на 1 клетку в случайную сторону 
                /* овоч: 
                    - тернарники это круто, но не в ущерб читаемости кода. с первого раза было трудновато понять, что тут происходит 
                    - старайся избегать повторений. если у тебя одно и то же выражение используется несколько раз, лучше всегда выносить в отдельную переменную или функцию.
                */
                if (getRandomLocation() > 0) {
                    newCell.locX = this.locX + getRandomLocation();
                } else {
                    newCell.locY = this.locY + getRandomLocation();
                }
                i++;
            };
        } else {
            return;
        };  

        //делаем клетки на крайних ячейках неразмножаемыеми чтобы они не лезли за пределы таблицы. Не знаю как сделать нормально.
        /* овоч: выносим проверку в отдельную функцию, которая возвращает булево значение, и затем присваиваем противоположное
            - обрати внимание, что мы здесь используем оператор "отрицания" для того, чтобы изменить значение на противоположное.
            - если функция нам вернет true (клетка на краю) - мы изменяем на false и присваиваем. ну и ровно наоборот
        */
        newCell.reproducable = !isOnTableEdge(newCell, rows, columns);
            
        //шанс на смену цвета
        /* овоч:
            - магическое число. почему 8?
            - а вот здесь тернарник будет смотреться уместней и красивей
        */
        const mutationChance = randomNumber(1, 10) > 8;
        newCell.colour = mutationChance ? this.mutate() : this.colour;

            
        allCells.push(newCell); //сохраняем в коллекцию живых клеток
        newCell.visual(); //отрисовывем текущий цвет
    },

    //мутация, пока что только цвет
    mutate: function() {
        /*
        овоч: немного странно вообще, слишком переусложнено.
         - зачем сохранять в переменную текущий цвет, если его все равно не используем?
         - зачем потом менять значение этой переменной на рандомный цвет и возвращать?

        let c = this.colour;
        let r = randomNumber(0, 5);
        c = colours[r];
        return c;
        */
        return colours[randomNumber(0, 5)];
    },

    //удаление из коллекции живых:
    dying: false,
    death: function(){
        if (this.crowdCheck(this) > 2 || this.locX > columns || this.locY > rows) {
            this.dying = true;
            let tds = document.querySelector(`td[data-row="${this.locX}"][data-column="${this.locY}"]`);
            tds.style.backgroundColor = 'white'; //красим клетку в белый
            //удаляем из аррея
            /* овоч: проверка item.dying === true излишня. коллбек и так вернет по дефолту то значение, которое true */
            allCells.splice(allCells.findIndex(item => item.dying), 1);
        };
    },
}
baseCell.reproduce(); //спавним стартовую
console.log(allCells);

function timeReproduce() {
    //call reproduce function of every cell
    let i = 0;
    let l = allCells.length;
    while (i < l) {
        allCells[i].reproduce();
        i++;
    };
    console.log("живые клетки:", allCells);
    //todo: сделать автоматическую с ожиданием 1000 ms 
};

function timeDeath() {
    //call death function of every cell
    let j = allCells.length-1;
    while (j > 0) {
        allCells[j].death();
        j--;
    };
};

document.getElementById('2').addEventListener('click', () => { //вызываем обходы по коллекции на размножение и смерти
    // timeBool = timeBool ? false : true;
    // console.log(timeBool);
    let i = 0;
    while (i < 1) {
        setTimeout(function() {
            timeReproduce();
        }, 1);
        setTimeout(function() {
            timeDeath();
        }, 500);
        i++;
    };
});

//ручное размножение послежнего элемента
document.getElementById('3').addEventListener('click', () => {
        allCells[allCells.length-1].reproduce();
        console.log(allCells);
        console.log(allCells[allCells.length-1].crowdCheck(allCells[allCells.length-1]));
});


