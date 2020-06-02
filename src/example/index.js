let queryStringLib = require('query-string')

let userData = {
    "first_name": "Satoshi",
    "last_name": "Nakamoto",
    "email": "email@gmail.com",
    "mobileNumber": "+19692154942",
    "dob": "1994-11-26",
    "address": {
        "addressLine1": "170 Pine St",
        "addressLine2": "San Francisco",
        "city": "San Francisco",
        "state": "CA",
        "postCode": "94111",
        "countryCode": "US"
    }
};
let walletAddressesData = {
    networks : {
        'erc20' : {address : '0xfF21f4F75ea2BbEf96bC999fEB5Efec98bB3f6F4'},
        'bep2' : {address : 'bnb1dv5ps9vpj6clar79gkd0jrfmg8c0knrd6m090h', addressAdditionalData : '123456'}
    },
    coins : {
        'BTC' : {address : 'bc1qlah8pucrmw8l3evszn8a7ay62gpyg00rzl7p2m'},
        'DAI' : {address : '0xfF21f4F75ea2BbEf96bC999fEB5Efec98bB3f6F4'},
        'BNB' : {address : 'bnb1dv5ps9vpj6clar79gkd0jrfmg8c0knrd6m090h', addressAdditionalData : '123456'}
    }
};
let queryStrings = {};
queryStrings.userData = JSON.stringify(userData);
queryStrings.walletAddressesData = JSON.stringify(walletAddressesData);
console.log(queryStringLib.stringify(queryStrings))