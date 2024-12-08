

// console.log(123);

dayjs.locale('zh-tw');
dayjs.extend(dayjs_plugin_isSameOrBefore);
dayjs.extend(dayjs_plugin_isBetween);

// 宣告全域變數
let
    apiPath = './db.json',
    booked = [],
    nationalHoliday = [],
    pallet = {},
    myCalendar,    //創造服務的原生函式,他有些方法可以提供的
    tableData = {
        totalPrice: 0,
        normalCount: 0,
        holidayCount: 0,
        pallet: {
            aArea: { title: '河畔 × A 區', sellCount: 0, sellInfo: '<div></div>', sumPrice: 0, orderCount: 0 },
            bArea: { title: '山間 × B 區', sellCount: 0, sellInfo: '<div></div>', sumPrice: 0, orderCount: 0 },
            cArea: { title: '平原 × C 區', sellCount: 0, sellInfo: '<div></div>', sumPrice: 0, orderCount: 0 },
            dArea: { title: '車屋 × D 區', sellCount: 0, sellInfo: '<div></div>', sumPrice: 0, orderCount: 0 }
        }
    };


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
// let theDay = dayjs();

const init = () => {
    fetch('./db.json', { method: 'Get' })
        .then(res => res.json())
        .then(json => {
            // console.log(json)
            // booked = json.booked;
            // pallet = jason.pallet;
            // nantionalHolidy = json.nantionalHolidy;
            // json是個物件,用解構子去把資料存到相對應的變數去
            // { booked, booked, nantionalHolidy } = json
            ({ booked, pallet, nationalHoliday } = json);    // 因為上列會發生error的解法

            myCalendar = runCalendarService();
            myCalendar.print();     //調用print的函式

            // 規劃DOM事件
            document.querySelector('a[href="#nextCtrl"]').onclick = (e) => {
                e.preventDefault();     // 取消browser的#nextCtrl
                // theDay = theDay.add(1, 'month')
                // runCalendarService();
                myCalendar.add();
            }
            document.querySelector('a[href="#prevCtrl"]').addEventListener('click', (e) => {
                e.preventDefault();     // 取消browser的#prevCtrl
                // theDay = theDay.add(-1, 'month')
                // runCalendarService();
                myCalendar.sub();
            });

            const nodeSelects = document.querySelectorAll('select');

            nodeSelects.forEach(nodeSelect => {
                nodeSelect.onchange = (e) => {
                    // console.log(e);
                    tableData.totalPrice = 0;
                    nodeSelects.forEach(item => {    // 4組相加
                        // console.log(item.value);
                        tableData.totalPrice += parseInt(item.value) * tableData.pallet[item.name].sumPrice

                        tableData.pallet[item.name].orderCount = parseInt(item.value);
                    });



                    document.querySelector('#selectPallet h3').textContent = `$${tableData.totalPrice} / ${tableData.normalCount}晚平日，${tableData.holidayCount}晚假日`;
                }
            });

            myCalendar.tableReferesh();
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
    let
        calendarLeft = {
            title: 'Left Calendar',
            listBox: '',
            thisDate: theDay,
        },
        calendarRight = {
            title: 'Right Calendar',
            listBox: '',
            thisDate: theDay.add(1, 'month'),
        }

    const
        today = dayjs(),
        // calendarLeft = {
        //     title: 'Left Calendar',
        //     listBox: '',
        //     thisDate: theDay,
        // },
        // calendarRight = {
        //     title: 'Right Calendar',
        //     listBox: '',
        //     thisDate: theDay.add(1, 'month'),
        // },
        userChooseDays = [null, null],
        // defaultTableData = {
        //     ...tableData,
        //     pallet: {
        //         ...tableData.pallet,
        //         aArea: {...pallet.aArea},
        //         bArea: {...pallet.bArea},
        //         cArea: {...pallet.cArea},
        //         dArea: {...pallet.dArea}
        //     }
        // },       // to look Note.txt(解構與組構方式)
        IintdefaultTableStr = JSON.stringify(tableData);

    changeMoth = (num) => {
        theDay = theDay.add(num, 'month');
        calendarLeft = {
            title: '',
            listBox: '',
            thisDate: theDay,
        }

        calendarRight = {
            title: '',
            listBox: '',
            thisDate: theDay.add(1, 'month'),
        }
    },
        chooseList = (node) => {
            // console.log(node.dataset.date);

            if (!userChooseDays[0] && !userChooseDays[1]) {            // 狀控一
                node.classList.add('selectHead');
                userChooseDays[0] = node;
            } else if (userChooseDays[0] && !userChooseDays[1]) {// 狀控二
                node.classList.add('selectFoot');
                userChooseDays[1] = node;

                const snd2fst = dayjs(userChooseDays[1].dataset.date).isSameOrBefore(userChooseDays[0].dataset.date);
                if (snd2fst) {
                    // 1, 2 做對調(class name修正, 陣列位置對調)
                    // userChooseDays[0].classList.remove('selectHead')
                    // userChooseDays[0].classList.add('selectFoot')
                    // userChooseDays[1].classList.remove('selectFoot')
                    // userChooseDays[1].classList.add('selectHead')
                    userChooseDays[0].classList.replace('selectHead', 'selectFoot')
                    userChooseDays[1].classList.replace('selectFoot', 'selectHead')

                    [userChooseDays[0], userChooseDays[1]] = [userChooseDays[1], userChooseDays[0]]
                }

                //補上 selectConnect
                document.querySelectorAll('li.selectDay').forEach(item => {

                    const isBetween = dayjs(item.dataset.date).isBetween(
                        userChooseDays[0].dataset.date,
                        userChooseDays[1].dataset.date
                    );

                    if (isBetween) item.classList.add('selectConnect');
                });

                tableMaker();
                // } else if (userChooseDays[0] && userChooseDays[1]) {// 狀控三
            } else {
                userChooseDays[0].classList.remove('selectHead');
                node.classList.add('selectHead');
                userChooseDays[0] = node;

                userChooseDays[1].classList.remove('selectFoot');
                userChooseDays[1] = null;

                //取消原本的selectConnect
                document.querySelectorAll('li.selectDay').forEach(item => item.classList.remove('selectConnect'));
            }

            // console.log(userChooseDays);
            // console.log(userChooseDays[1]);
        },
        listMaker = (obj) => { //調整萬年曆物件,調整完畢後,返回修改後的物件
            // obj.title = 'loki test';
            const firstDay = obj.thisDate.date(1).day();
            // const firstDay=obj.thisDate.startOf('month').day();  // 該月第一天禮拜幾
            const totalDay = obj.thisDate.daysInMonth();    // 該月有機天
            const bookObj = booked
            // 若firstDay為0時, 等同i < 7
            for (let i = 1; i < (firstDay || 7); i++) {
                obj.listBox += '<li class="JsCal"></li>';
            }

            for (let i = 1; i <= totalDay; i++) {
                let classStr = 'JsCal';

                const tempDay = obj.thisDate.date(i);
                //假日判定,包含國定假日
                const tempDayStr = tempDay.format('YYYY-MM-DD');

                // obj.thisDate.date(i)     //每次回圈的數字轉換成為當月指定日期的time object.
                // if (obj.thisDate.date(i).isSameOrBefore(today)) classStr += ' delDay'; //過期
                if (tempDay.isSameOrBefore(today)) classStr += ' delDay'; //過期
                else {
                    //yesterday = dayjs.add(-1, "day")
                    // //假日判定,包含國定假日
                    // const tempDayStr = tempDay.format('YYYY-MM-DD');

                    const isNationHoliday = nationalHoliday.includes(tempDayStr);
                    if (((firstDay + i) % 7 < 2) || isNationHoliday) classStr += ' holiday';

                    //滿帳
                    // const checkBookDate = booked.find((bookObj) => {
                    //     return bookObj.date === tempDayStr;
                    // });

                    const checkBookObject = booked.find((bookObj) => bookObj.date === tempDayStr);
                    // if (checkBookObject) { 
                    //     //有找到, 
                    //     //pallet.count = checkBookObject.setllout.a
                    //     const palletTotal = pallet.count;
                    //     const sellTotal = Object.values(checkBookObject.sellout).reduce((prev, cur)=>prev + cur, 0);

                    //     if (palletTotal === sellTotal) {
                    //         classStr += ' fullDay';
                    //     }
                    // }

                    if (
                        checkBookObject
                        &&
                        (pallet.count === Object.values(checkBookObject.sellout).reduce((prev, cur) => prev + cur, 0))
                    ) classStr += ' fullDay';

                    classStr += ' selectDay';
                }

                obj.listBox += `<li class="${classStr}" data-date="${tempDayStr}">${i}</li>`;

                // obj.thisDate.date(i)     //每次回圈的數字轉換成為當月指定日期的time object.
                // if (obj.thisDate.date(i).isSameOrBefore(today)) classStr += ' delDay'; //過期
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
            // console.log('create list of aclendar');
            // console.log(calendarLeft, calendarRight);
            // const temp = listMaker(calendarLeft);
            // console.log(temp, calendarLeft);
            // console.log(listMaker(calendarLeft).listBox);
            // console.log(listMaker(calendarRight).listBox);
            // const newCalLeft = listMaker(calendarLeft);
            // const newCalRight = listMaker(calendarRight);

            // document.querySelector('.leftDayList').innerHTML = newCalLeft.listBox;
            // document.querySelector('.rightDayList').innerHTML = newCalRight.listBox;

            // document.querySelector('.leftBar>h4').innerHTML = newCalLeft.title;
            // document.querySelector('.rightBar>h4').innerHTML = newCalRight.title;

            listMaker(calendarLeft);
            listMaker(calendarRight);
            document.querySelector('.leftDayList').innerHTML = calendarLeft.listBox;
            document.querySelector('.rightDayList').innerHTML = calendarRight.listBox;
            document.querySelector('.leftBar>h4').innerHTML = calendarLeft.title;
            document.querySelector('.rightBar>h4').innerHTML = calendarRight.title;

            //畫面更新後,考慮這些持有selectDay
            document.querySelectorAll('.selectDay').forEach((item) => {
                item.onclick = () => myCalendar.choose(item);
            });
        },
        tableMaker = () => {
            //   console.log('負責翻新 tableData');
            // tableData = {...tableData, ...defaultTableData};
            tableData = JSON.parse(IintdefaultTableStr);

            // 1.修正sellCount
            for (const key in tableData.pallet) {
                tableData.pallet[key].sellCount = pallet[key].total;
            }

            // 2.去得知User選擇AB日期
            document.querySelectorAll('li.selectHead', 'li.selectConnect').forEach(item => {
                // console.log(item.dataset.date);

                for (const key in tableData.pallet) {    //獲取四個pallet名字
                    // const hsOrder = booked.find(bookItem => {
                    //     // console.log(bookItem.date);
                    //     return bookItem.date === item.dataset.date;
                    // });

                    const hsOrder = booked.find(bookItem => bookItem.date === item.dataset.date);

                    // 2-1. 如果後端有當日的訂單,更新房況的剩餘數
                    if (hsOrder) {
                        // console.log(hsOrder);
                        // 在連續的日子可賣出的房數必須是這些剩餘房況的最小值
                        tableData.pallet[key].sellCount = Math.min(tableData.pallet[key].sellCount, pallet[key].total - hsOrder.sellCount[key]);
                    }

                    // 2-2
                    if (tableData.pallet[key].sellCount) {
                        // 提供日期跟價格
                        console.log(item.dataset.dat);

                        const dayPrice = item.classList.contains('holiday') ? pallet[key].holidayPrice : pallet[key].normalPrice;
                        // const dayPrice = pallet[key][item.classList.contains('holiday') ? 'holidayPrice' : 'normalPrice'];

                        // console.log(item.dataset.date, dayPrice);
                        tableData.pallet[key].sellInfo += `<div>${item.dataset.date} (${dayPrice})</div>`;
                        tableData.pallet[key].sumPrice += dayPrice;
                    } else {    // 筆記無的bug
                        tableData.pallet[key].sellInfo = '<div>已售完</div>';
                        tableData.pallet[key].sumPrice = 0;
                    }
                }

                // 2-3
                // item.classList.contains('holiday') ? tableData.holidayCount++ : tableData.normalCount++;
                tableData[item.classList.contains('holiday') ? 'holidayCount' : 'normalCount']++;
            });

            // console.log(tableData);
            tablePrint();
        },
        tablePrint = () => {
            // console.log('開始渲染右邊表格, tableData做成HTML');
            // document.querySelectorAll('form select').forEach(nodeSelect =>{
            document.querySelectorAll('#selectPallet select').forEach(nodeSelect => {
                const palletName = nodeSelect.name;

                //td>select>option ?個
                const countOption = tableData.pallet[palletName].sellCount;

                let optStr = "";
                for (let i; i < countOption; i++) {
                    optStr += `<option value="${i}">${i}</option>`;
                }

                nodeSelect.innerHTML = optStr;
                // console.log(palletName);
                // if (countOption === 0) node.disabled = true;
                nodeSelect.disabled = countOption === 0;      //鎖住select下功能

                //select> td> 上個td(sellInfo位置)
                const tdSellInfo = nodeSelect.parentElement.previousElementSibling;
                tdSellInfo.innerHTML = tableData.pallet[palletName].sellInfo;

                //td(selectlInfo) ~ td > label > span
                // tdSellInfo.previousElementSibling.children.item(1).children.item(0).innerHTML = 99;
                const tdRemain = tdSellInfo.previousElementSibling.querySelector('span');
                tdRemain.textContent = countOption;

                document.querySelector('#selectPallet h3').textContent = `$${tableData.totalPrice} / ${tableData.normalCount}晚平日，${tableData.holidayCount}晚假日`;
            })
        }

    // listPrint();
    return {
        print: () => listPrint(),
        add: () => {
            // console.log('right');
            changeMoth(1);
            listPrint();
        },
        sub: () => {
            // console.log('left');
            changeMoth(-1);
            listPrint();
        },
        choose: (item) => {
            // 第二次選擇不是同一天
            // console.log(item)
            if (item.classList.contains('selectHead') && !userChooseDays[1]) return;
            chooseList(item);
        },
        tableReferesh: () => tablePrint()
    }
}


init();

// Note:
// loki = data || 'default value',
// loki = data ?? '查無資料', data若無資料,loki回得到'查無資料'

