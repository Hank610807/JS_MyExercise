// 初始宣告變數，作為全域使用利用於整個js都能讀取到
const btnStart = document.querySelector('button');
const timeNode = document.querySelector('#time');
const countNode = document.querySelector('#combo');
const animals = document.querySelectorAll('.cell');

let time, count;
const redToYellow = [];
// 規劃功能函式
// 利用class.List.add(), class.remove()去設定背景顏色,在cell的CSS中增加&.red 及 &.green
// 強制換到image: .src='img/on.png'
const gameStart = () => {
    // console.log('start');
    // step1: 一開始讓btnStart失去作用
    btnStart.removeEventListener('click', gameStart);
    btnStart.disabled = true;

    // step2: 校正歸零
    time = 60;
    count = 0;

    timeNode.textContent = time;
    countNode.textContent = count;

    // step3: 開始計時
    const timer = setInterval(() => {
        time--;
        timeNode.textContent = time;

        if (time == 0) {
            clearInterval(timer);
            // 讓 btnStart恢復,可以在玩
            btnStart.addEventListener('click', gameStart);
            btnStart.disabled = false;
        }
    }, 1000);

    // step4: 產生100個red事件,然後指定到9宮格內某個state.png空閒位置，且這100個 red出現時間點及曝光多久
    for (let i = 0; i < 100; i++) {
        // const atSpace = Math.floor(Math.random() * 9);        // 0 ~ 8
        // const atTime = Math.floor(Math.random() * 56000);     // 0 ~ 60 sec = > rand 0 ~ 55999 ms
        // const atShow = Math.floor(Math.random() * 3) + 2;      // 2 ~ 4 sec => 0 ~ 2 + 2

        // // step4-1: 在單一事件下，試圖觸發到畫面上，每個都要延遲觸發atTime
        // setTimeout(() => {
        //     showIt(atTime, i);
        // }, atTime);

        // const showObj = {
        //     space: Math.floor(Math.random() * 9),
        //     show: Math.floor(Math.random() * 3) + 2,
        //     id: i
        // }

        // step4-1: 在單一事件下，試圖觸發到畫面上，每個都要延遲觸發atTime
        // setTimeout(() => {
        //     // showIt(atTime, i);
        //     showIt(showObj);
        // }, Math.floor(Math.random() * 56000));

        setTimeout(() => {
            showIt({
                space: Math.floor(Math.random() * 9),
                show: Math.floor(Math.random() * 3) + 2,
                id: i
            });
        }, Math.floor(Math.random() * 56000));
    }
};

// const showIt = (atTime, idx) => {
//     console.log(`showIt #${idx}`, atTime);
// }

const showIt = (obj) => {
    // console.log(obj)
    // 負責將紅色顯示在畫面上
    // step1:試圖找到指定的圖片,替換為red,並控制幾秒後消失返回yellow,如果當下位置已是紅色,不要覆蓋,想辦法換個位置重新安出場
    // 使用contain()

    if (animals[obj.space].classList.contains('red') || animals[obj.space].classList.contains('green')) {
        // 己經是紅色或是綠色,想辦法換個地方,避免遊戲時間內無法出場
        obj.space = Math.floor(Math.random() * 9);

        // 如果畫面都是紅色,都找找獨到空間,大家都去找新位置,當下會發生無限回圈
        // showIt(obj);
        setTimeout(() => {
            showIt(obj);
        }, 100);

        return;
    } else {
        animals[obj.space].classList.add('red')
        animals[obj.space].src = 'img/on.png';
        // animals[obj.space].title = obj.id;
        animals[obj.space].dataset.playerId = obj.id;   //創照一個屬性 dataset

        // 記下當時timeour的定時器id,以利某時機可以清除
        redToYellow[obj.id] = setTimeout(() => {
            animals[obj.space].classList.remove('red')
            animals[obj.space].src = 'img/state.png';
            delete animals[obj.space].dataset.playerId;
        }, obj.show * 1000);
    }

}

const getCombo = (space) => {
    // console.log(space);

    if (animals[space].classList.contains('red')) {
        // 紅色計分,並讓red to green
        // console.log('is red');
        // count++;
        countNode.textContent = ++count;

        animals[space].classList.remove('red');
        animals[space].classList.add('green');
        animals[space].src = 'img/off.png';

        // 因為計分red to green了,原本這個red to yellow的定時器要清除
        clearTimeout(redToYellow[animals[space].dataset.playerId]);

        setTimeout(() => {
            animals[space].classList.remove('green');
            animals[space].src = 'img/state.png';
            delete animals[space].dataset.playerId;
        }, 1000);
    }

}

// 初始執行
btnStart.addEventListener('click', gameStart);
document.onkeydown = function (event) {
    console.log(event);
    switch (event.keyCode) {
        case 103: getCombo(0); break;
        case 104: getCombo(1); break;
        case 105: getCombo(2); break;
        case 100: getCombo(3); break;
        case 101: getCombo(4); break;
        case 102: getCombo(5); break;
        case 97: getCombo(6); break;
        case 98: getCombo(7); break;
        case 99: getCombo(8); break;
    }
}

animals.forEach((animals, index) => {
    animals.addEventListener('click', () => {
        getCombo(index);
    });
});