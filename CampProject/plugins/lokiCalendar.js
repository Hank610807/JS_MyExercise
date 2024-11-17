// console.log(123);
// 宣告全域變數
let
    apiPath = './db.json',
    booked = [],
    nantionalHolidy = [],
    pallet = {};

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
            // { booked, booked, nantionalHolidy } = json
            ({ booked, booked, nantionalHolidy } = json)    // 因為上列會發生error的解法

            runCalenderService();
        });
}

const runCalenderService = () =>{
    console.log('start design calender');
}

init();