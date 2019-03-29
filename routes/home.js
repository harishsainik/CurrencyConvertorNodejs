const express = require('express');
const path = require('path');
const axios = require('axios');
const router = express.Router();


router.get('/', (req,res) => {
    res.redirect('/index.html');
});

const getExchangeRate = async(fromCurrency, toCurrency) => {
    try{
        const response = await axios.get('http://www.apilayer.net/api/live?access_key=162a89c8c4b8db3adfa7592bb114fe6d&format=1');
        const rate = response.data.quotes;
        const euro = 1/rate['USD'+fromCurrency];
        const exchangeRate = euro * rate['USD'+toCurrency];
        return exchangeRate;
    }catch( error){
        console.log(error);
        throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
    }
    
}


const getCountries = async (currencyCode) => {
    try{
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
        return response.data.map(country => country.name);
    }catch(error){
        throw new Error(`Unable to get countries that use ${currencyCode}`);
    }   
}

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    console.log(`${fromCurrency}, ${toCurrency}, ${amount}`);
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    const countries = await getCountries(toCurrency);
    const convertedAmount = (amount * exchangeRate).toFixed(2);
    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these
    in the following countries: ${countries}`;
}

router.post('/result', (req,res) => {
    var {fromCurrency, toCurrency, amount} = req.body;
    //validate and request apis and return result/error
    if (!fromCurrency || !toCurrency || !amount){
       return res.send("Error! Please provide all values");
    }
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();
    convertCurrency(fromCurrency, toCurrency, amount)
    .then((message) => {
        res.send(message);
    }).catch((error) => {
        res.send(error.message)
    });
});    

module.exports = router;