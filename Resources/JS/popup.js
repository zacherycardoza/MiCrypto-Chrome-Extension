//#region Variables
var etherPrice = document.getElementById("etherPrice");
var bitcoinPrice = document.getElementById("bitcoinPrice");
var stellarPrice = document.getElementById("stellarPrice");
var cardanoPrice = document.getElementById("cardanoPrice");
var supportedCryptoCurrencies = [{name: "Ethereum", symbol: "ETH"}, {name: "Bitcoin", symbol: "BTC"}, {name: "Stellar", symbol: "XLM"}, {name: "Cardano", symbol: "ADA"}];
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

(function ($) {
    function CreateTrackedCurrencyContainer(currency, fiatCurrency) {
        //#region new container
        var newCurrencyContainer = document.createElement("div");
        $(newCurrencyContainer).addClass("currencyContainer");
        $(newCurrencyContainer).attr("name", currency.name);
        //#endregion
        //#region logo
        var newCurrencyLogoContainer = document.createElement("div");
        $(newCurrencyLogoContainer).addClass("currencyLogoContainer");
        var logo = document.createElement("img");
        $(logo).addClass("currencyLogo");
        var srcString = "../Resources/IMG/" + currency.name + "Logo.png";
        $(logo).attr("src", srcString);
        $(logo).attr("alt", currency.name);
        newCurrencyLogoContainer.appendChild(logo);
        newCurrencyContainer.appendChild(newCurrencyLogoContainer);
        //#endregion
        //#region name
        var newCurrencyNameContainer = document.createElement("div");
        $(newCurrencyNameContainer).addClass("currencyNameContainer");
        var name = document.createElement("p");
        $(name).addClass("currencyName");
        $(name).html(currency.name);
        newCurrencyNameContainer.appendChild(name);
        newCurrencyContainer.appendChild(newCurrencyNameContainer);
        //#endregion
        //#region one unit label
        var newCurrencyOneUnitLabelContainer = document.createElement("div");
        $(newCurrencyOneUnitLabelContainer).addClass("currencyOneUnitLabelContainer");
        var oneUnitLabel = document.createElement("p");
        $(oneUnitLabel).addClass("currencyOneUnit");
        $(oneUnitLabel).html("1 " + currency.symbol);
        newCurrencyOneUnitLabelContainer.appendChild(oneUnitLabel);
        newCurrencyContainer.appendChild(newCurrencyOneUnitLabelContainer);
        //#endregion
        //#region one unit converted
        var newCurrencyOneUnitConvertedContainer = document.createElement("div");
        $(newCurrencyOneUnitConvertedContainer).addClass("currencyOneUnitConvertedContainer");
        var oneUnitConverted = document.createElement("p");
        $(oneUnitConverted).addClass("currencyOneUnitConverted");

        var requestOptions = {
            mode: 'cors'
          }; 
        var url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
        var key = "0eacabc3-5ebd-4093-8324-6c4b72a86ee4";
        var qString = "?CMC_PRO_API_KEY=" + key + "&start=1&limit=5&convert=USD";
        fetch((url + qString), requestOptions)
            .then(function(res) {
                res.json();
            })
            .then(function(data) {
                console.log(data);
                //$(oneUnitConverted).html((Math.round((data["Realtime Currency Exchange Rate"]["5. Exchange Rate"])*Math.pow(10,2))/Math.pow(10,2)).toFixed(2) + " " + fiatCurrency);
            })
            .catch(error => {
                console.log(error);
                $(".currencyOneUnitConverted").html("0000.00 " + fiatCurrency);
            });
        newCurrencyOneUnitConvertedContainer.appendChild(oneUnitConverted);
        newCurrencyContainer.appendChild(newCurrencyOneUnitConvertedContainer);
        //#endregion
        //#region symbol
        var newCurrencySymbolContainer = document.createElement("div");
        $(newCurrencySymbolContainer).addClass("currencySymbolContainer");
        var symbol = document.createElement("p");
        $(symbol).addClass("currencySymbol");
        $(symbol).html("( " + currency.symbol + " )");
        newCurrencySymbolContainer.appendChild(symbol);
        newCurrencyContainer.appendChild(newCurrencySymbolContainer);
        //#endregion
        //#region wallet label
        var newCurrencyWalletLabelContainer = document.createElement("div");
        $(newCurrencyWalletLabelContainer).addClass("currencyWalletLabelContainer");
        var walletLabel = document.createElement("p");
        $(walletLabel).addClass("currencyWalletLabel");
        $(walletLabel).html("0 " + currency.symbol);
        newCurrencyWalletLabelContainer.appendChild(walletLabel);
        newCurrencyContainer.appendChild(newCurrencyWalletLabelContainer);
        //#endregion
        //#region wallet converted
        var newCurrencyWalletConvertedContainer = document.createElement("div");
        $(newCurrencyWalletConvertedContainer).addClass("currencyWalletConvertedContainer");
        var walletConverted = document.createElement("p");
        $(walletConverted).addClass("currencyWalletConverted");
        $(walletConverted).html("0000.00 " + fiatCurrency);
        newCurrencyWalletConvertedContainer.appendChild(walletConverted);
        newCurrencyContainer.appendChild(newCurrencyWalletConvertedContainer);
        //#endregion
        document.getElementById("trackedCurrencyListContainer").appendChild(newCurrencyContainer);
    }

    $(document).ready(function () {
        supportedCryptoCurrencies.forEach(element => {
            console.log(element.name + ": " + localStorage.getItem(element.name));
            if ( localStorage.getItem(element.name) == "active" ) {
                CreateTrackedCurrencyContainer(element, localStorage.getItem("fiatCurrency"));
            }
        });     
    });
})(jQuery);
