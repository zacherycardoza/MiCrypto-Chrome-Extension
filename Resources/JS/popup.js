// Get Settings Information 
var settingsInformation;
function saveSettings(settings) {
    localStorage.setItem("settingsInformation", JSON.stringify(settings));
}
(function ($) {
    $(document).ready(function () {
        if ( localStorage.getItem("settingsInformation") != null) {
            settingsInformation = JSON.parse(localStorage.getItem("settingsInformation"));
            console.log(settingsInformation);
        }
        else {
            settingsInformation = {
                supportedCryptoCurrencies: [{name: "Ethereum", symbol: "ETH", active: "false", amountOwned: 0.151013, lastPrice: 0.00, newPrice: 0.0}, 
                                            {name: "Bitcoin", symbol: "BTC", active: "false", amountOwned: 0.008342, lastPrice: 0.00, newPrice: 0.0},
                                            {name: "Stellar", symbol: "XLM", active: "false", amountOwned: 54.434463, lastPrice: 0.00, newPrice: 0.0},
                                            {name: "Cardano", symbol: "ADA", active: "false", amountOwned: 0.00, lastPrice: 0.00, newPrice: 0.0},
                                            {name: "BinanceCoin", symbol: "BNB", active: "false", amountOwned: 0.00, lastPrice: 0.00, newPrice: 0.0},
                                            {name: "Tether", symbol: "USDT", active: "false", amountOwned: 0.00, lastPrice: 0.00, newPrice: 0.0},
                                            {name: "Dogecoin", symbol: "DOGE", active: "false", amountOwned: 0.00, lastPrice: 0.00, newPrice: 0.0},
                                            {name: "Maker", symbol: "MKR", active: "false", amountOwned: 0.00, lastPrice: 0.00, newPrice: 0.0},
                                            {name: "Sushi", symbol: "SUSHI", active: "false", amountOwned: 0.00, lastPrice: 0.00, newPrice: 0.0},
                                            {name: "ChainLink", symbol: "LINK", active: "false", amountOwned: 0.00, lastPrice: 0.00, newPrice: 0.0},
                                            {name: "Ripple", symbol: "XRP", active: "false", amountOwned: 0.00, lastPrice: 0.00, newPrice: 0.0}],
                supportedFiatCurrencies: ["CAD", "USD", "EUR", "GBP", "INR", "CNY", "KRW", "HKD", "TWD", "AUD"],
                activeFiatCurrency: "USD"
            };
            saveSettings(settingsInformation);
        }
    });
})(jQuery);

//#endregion

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
    var alphaVantageAPIKey = "21NUI9FB9KOIO6TM";
    function CreateTrackedCurrencyContainer(currency) {
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
        var srcString = "../Resources/IMG/CryptoLogos/" + currency.name + "Logo.png";
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
        fetch("https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=" + currency.symbol + "&to_currency=" + settingsInformation.activeFiatCurrency + "&apikey=" + alphaVantageAPIKey
        )
        .then(response => { response.json()
        .then(data => {
            currency.lastPrice = currency.newPrice;
            currency.newPrice = (Math.round((data["Realtime Currency Exchange Rate"]["5. Exchange Rate"])*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
            $(oneUnitConverted).html(currency.newPrice + " " + settingsInformation.activeFiatCurrency);
            saveSettings(settingsInformation);
        })
        })
        .catch(err => {
            console.error(err);
        });
        newCurrencyOneUnitConvertedContainer.appendChild(oneUnitConverted);
        newCurrencyContainer.appendChild(newCurrencyOneUnitConvertedContainer);
        //#endregion
        //#region symbol
        var newCurrencySymbolContainer = document.createElement("div");
        $(newCurrencySymbolContainer).addClass("currencySymbolContainer");
        var symbol = document.createElement("p");
        $(symbol).addClass("currencySymbol");
        $(symbol).html(currency.symbol);
        newCurrencySymbolContainer.appendChild(symbol);
        newCurrencyContainer.appendChild(newCurrencySymbolContainer);
        //#endregion
        //#region wallet label
        var newCurrencyWalletLabelContainer = document.createElement("div");
        $(newCurrencyWalletLabelContainer).addClass("currencyWalletLabelContainer");
        var walletLabel = document.createElement("p");
        $(walletLabel).addClass("currencyWalletLabel");
        $(walletLabel).html(currency.amountOwned + " " + currency.symbol);
        newCurrencyWalletLabelContainer.appendChild(walletLabel);
        newCurrencyContainer.appendChild(newCurrencyWalletLabelContainer);
        //#endregion
        //#region wallet converted
        var newCurrencyWalletConvertedContainer = document.createElement("div");
        $(newCurrencyWalletConvertedContainer).addClass("currencyWalletConvertedContainer");
        var walletConverted = document.createElement("p");
        $(walletConverted).addClass("currencyWalletConverted");
        var amountOwnedConverted = currency.amountOwned * currency.newPrice;
        amountOwnedConverted = (Math.round((amountOwnedConverted)*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
        $(walletConverted).html(amountOwnedConverted + " " + settingsInformation.activeFiatCurrency);
        newCurrencyWalletConvertedContainer.appendChild(walletConverted);
        newCurrencyContainer.appendChild(newCurrencyWalletConvertedContainer);
        //#endregion
        document.getElementById("trackedCurrencyListContainer").appendChild(newCurrencyContainer);
    }
  
    $(document).ready(function () {
        settingsInformation.supportedCryptoCurrencies.forEach(element => {
            if ( element.active == "true") {
                CreateTrackedCurrencyContainer(element);
            }
        });     
    });
})(jQuery);
