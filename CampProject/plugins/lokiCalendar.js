

// console.log(123);
// 宣告全域變數
let
    apiPath = './db.json',
    booked = [],
    nantionalHolidy = [],
    pallet = {};

// 串接後台
// fetch('http://127.0.0.1:5500/CampProject/db.json', {method: 'Get'}).then((res) =>{
//     // console.log(res);
//     return res.json()
// }).then((json) =>{
//     console.log(json)
// });

// fetch('http://127.0.0.1:5500/CampProject/db.json', { method: 'Get' })
//     .then(
//         res => res.json()
//     )
//     .then(json => {
//         console.log(json)
//     });

const init = () => {
    fetch('./db.json', { method: 'Get' })
        .then(
            res => res.json()
        )
        .then(json => {
            // console.log(json)
            // booked = json.booked;
            // pallet = jason.pallet;
            // nantionalHolidy = json.nantionalHolidy;
            // json是個物件,用解構子去把資料存到相對應的變數去
            // { booked, booked, nantionalHolidy } = json
            ({ booked, booked, nantionalHolidy } = json)    // 因為上列會發生error的解法

            runCalendarService();
        });
}

// const runCalendarService = () => {
//     // console.log('start design calender');
//     const today = dayjs();

//     const listMaker = () => {
//         console.log('create list of aclendar');
//     }

//     // console.log(today);
//     listMaker();
// }

const runCalendarService = () => {
    // console.log('start design calender');
    let theDay = dayjs();

    const
        today = dayjs(),
        calendarLeft = {
            title: 'Left Calendar',
            listBox: '',
            thisDate: theDay,
        },
        calendarRight = {
            title: 'Right Calendar',
            listBox: '',
            thisDate: theDay.add(1, 'month'),
        },

        listMaker = (obj) => { //調整萬年曆物件,調整完畢後,返回修改後的物件
            // obj.title = 'loki test';
            const firstDay = obj.thisDate.date(1).day();
            // const firstDay=obj.thisDate.startOf('month').day();  // 該月第一天禮拜幾
            const totalDay = obj.thisDate.daysInMonth();    // 該月有機天

            // 若firstDay為0時, 等同i < 7
            for (let i = 1; i < (firstDay || 7); i++) {
                obj.listBox += '<li class="JsCal"></li>';
            }

            for (let i = 1; i <= totalDay; i++) {
                obj.listBox += `<li class="JsCal">${i}</li>`;
            }

            // // method 1:
            // obj.title = `${obj.thisDate.year()}年${obj.thisDate.month() + 1}月`

            // // method 2:
            // const monthIndexToString = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            // obj.title = `${monthIndexToString[obj.thisDate.month()]} ${obj.thisDate.year()}`

            // method 3:
            const twMonth = window.dayjs_locale_zh_tw.months;
            obj.title = `${twMonth[obj.thisDate.month()]} ${obj.thisDate.year()}`;

            // console.log(firstDay, totalDay)
            return obj;
        },

        listPrint = () => { // 輸出到DOM
            console.log('create list of aclendar');
            // console.log(calendarLeft, calendarRight);
            // const temp = listMaker(calendarLeft);
            // console.log(temp, calendarLeft);
            // console.log(listMaker(calendarLeft).listBox);
            // console.log(listMaker(calendarRight).listBox);

            document.querySelector('.leftDayList').innerHTML = listMaker(calendarLeft).listBox;
            document.querySelector('.rightDayList').innerHTML = listMaker(calendarRight).listBox;

            document.querySelector('.leftBar>h4').innerHTML = listMaker(calendarLeft).title;
            document.querySelector('.rightBar>h4').innerHTML = listMaker(calendarRight).title;
        }

    listPrint();
}


init();

// Note: 
// loki = data || 'default value', 
// loki = data ?? '查無資料', data若無資料,loki回得到'查無資料'

