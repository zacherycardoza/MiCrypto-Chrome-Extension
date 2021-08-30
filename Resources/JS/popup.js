//#region Variables
let changeColor = document.getElementById("changeColor");
var refreshButton = document.getElementById("refreshButton");
var etherPrice = document.getElementById("etherPrice");
var bitcoinPrice = document.getElementById("bitcoinPrice");
var stellarPrice = document.getElementById("stellarPrice");
var cardanoPrice = document.getElementById("cardanoPrice");
//#endregion

//#region API Calls
function getAndSetEtherPrice() {
    fetch("https://alpha-vantage.p.rapidapi.com/query?from_currency=ETH&function=CURRENCY_EXCHANGE_RATE&to_currency=CAD", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
            "x-rapidapi-key": "daa6fdf9ddmshcfb2f10f553a81bp1e0540jsn39f1bb665b13"
            }
    })
    .then(res => res.json())
    .then(data => {
        etherPrice.innerHTML = "ETH: $" + (Math.round((data["Realtime Currency Exchange Rate"]["5. Exchange Rate"])*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
    });
}
function getAndSetBitcoinPrice() {
    fetch("https://alpha-vantage.p.rapidapi.com/query?from_currency=BTC&function=CURRENCY_EXCHANGE_RATE&to_currency=CAD", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
            "x-rapidapi-key": "daa6fdf9ddmshcfb2f10f553a81bp1e0540jsn39f1bb665b13"
            }
    })
    .then(res => res.json())
    .then(data => {
        bitcoinPrice.innerHTML = "BTC: $" + (Math.round((data["Realtime Currency Exchange Rate"]["5. Exchange Rate"])*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
    });
}
function getAndSetStellarPrice() {
    fetch("https://alpha-vantage.p.rapidapi.com/query?from_currency=XLM&function=CURRENCY_EXCHANGE_RATE&to_currency=CAD", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
            "x-rapidapi-key": "daa6fdf9ddmshcfb2f10f553a81bp1e0540jsn39f1bb665b13"
            }
    })
    .then(res => res.json())
    .then(data => {
        stellarPrice.innerHTML = "XLM: $" + (Math.round((data["Realtime Currency Exchange Rate"]["5. Exchange Rate"])*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
    });
}
function getAndSetCardanoPrice() {
    fetch("https://alpha-vantage.p.rapidapi.com/query?from_currency=ADA&function=CURRENCY_EXCHANGE_RATE&to_currency=CAD", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
            "x-rapidapi-key": "daa6fdf9ddmshcfb2f10f553a81bp1e0540jsn39f1bb665b13"
            }
    })
    .then(res => res.json())
    .then(data => {
        cardanoPrice.innerHTML = "ADA: $" + (Math.round((data["Realtime Currency Exchange Rate"]["5. Exchange Rate"])*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
    });
}
//#endregion

function refreshPrices() {
    getAndSetEtherPrice();
    getAndSetBitcoinPrice();
    getAndSetStellarPrice();
    getAndSetCardanoPrice();
}

(function ($) {
    $(document).ready(function () {
        $("#settingsButton")
            .hover(
                function () {
                    $("#settingsIcon").attr("src", "../Resources/IMG/settingsHover.png"); },
                function () {
                    $("#settingsIcon").attr("src", "../Resources/IMG/settings.png"); }
                )
            .click(
                function () {
                    location.href="../Pages/settings.html"; }
                );        
    });
})(jQuery);

