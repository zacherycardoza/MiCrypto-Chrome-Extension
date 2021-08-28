// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");
var refreshButton = document.getElementById("refreshButton");
var etherPrice = document.getElementById("etherPrice");
var bitcoinPrice = document.getElementById("bitcoinPrice");
var stellarPrice = document.getElementById("stellarPrice");
var cardanoPrice = document.getElementById("cardanoPrice");

//#region not my code
chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});
// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    var [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageBackgroundColor,
        });
    });
    function setPageBackgroundColor() {
        chrome.storage.sync.get("color", ({ color }) => {
        document.body.style.backgroundColor = color;
        });
    };
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
        console.log(data);
        console.log(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
        etherPrice.innerHTML = "ETH: " + data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
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
        console.log(data);
        console.log(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
        bitcoinPrice.innerHTML = "BTC: " + data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
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
        console.log(data);
        console.log(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
        stellarPrice.innerHTML = "XLM: " + data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
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
        console.log(data);
        console.log(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
        cardanoPrice.innerHTML = "ADA: " + data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
    });
}
//#endregion

refreshButton.addEventListener("click", getAndSetEtherPrice);
getAndSetEtherPrice();
setInterval(getAndSetEtherPrice, 60005);
getAndSetBitcoinPrice();
setInterval(getAndSetBitcoinPrice, 60005);
getAndSetStellarPrice();
setInterval(getAndSetStellarPrice, 60005);
getAndSetCardanoPrice();
setInterval(getAndSetCardanoPrice, 60005);
