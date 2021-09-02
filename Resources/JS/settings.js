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
                supportedCryptoCurrencies: [{name: "Ethereum", symbol: "ETH", active: "false", amountOwned: 0.00, lastPrice: 0.00, newPrice: 0.0}, 
                                            {name: "Bitcoin", symbol: "BTC", active: "false", amountOwned: 0.00, lastPrice: 0.00, newPrice: 0.0},
                                            {name: "Stellar", symbol: "XLM", active: "false", amountOwned: 0.00, lastPrice: 0.00, newPrice: 0.0},
                                            {name: "Cardano", symbol: "ADA", active: "false", amountOwned: 0.00, lastPrice: 0.00, newPrice: 0.0},
                                            {name: "Dogecoin", symbol: "DOGE", active: "false", amountOwned: 0.00, lastPrice: 0.00, newPrice: 0.0},
                                            {name: "Ripple", symbol: "XRP", active: "false", amountOwned: 0.00, lastPrice: 0.00, newPrice: 0.0}],
                supportedFiatCurrencies: ["CAD", "USD", "EUR", "GBP", "INR", "CNY"],
                activeFiatCurrency: "USD"
            };
            saveSettings(settingsInformation);
        }
    });
})(jQuery);

// Settings Button hover and click functions
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
                    location.href="../Pages/popup.html"; }
                );        
    });
})(jQuery);

// Setting active fiat currency 
(function ($) {
    $(document).ready(function () {
        if ( settingsInformation.activeFiatCurrency != null ) {
            if ( document.getElementsByName(settingsInformation.activeFiatCurrency)[0] != null) {
                var _ = document.getElementsByName(settingsInformation.activeFiatCurrency)[0];
                $(_).addClass("active");
            }
        }
    });
})(jQuery);

// Fiat currency click function
(function ($) {
    $(document).ready(function () {
        $(".supportedFiatCurrencyContainer").click(function () {
            if ( $(this).attr("name") == settingsInformation.activeFiatCurrency ) {
                return;
            }
            else {
                if ( document.getElementsByName(settingsInformation.activeFiatCurrency)[0] != null ) {
                    $(document.getElementsByName(settingsInformation.activeFiatCurrency)[0]).removeClass("active");
                }
                settingsInformation.activeFiatCurrency = $(this).attr("name");
                saveSettings(settingsInformation);
                $(this).addClass("active");
            }
        });
    });
})(jQuery);

// Setting active crypto currencies 
(function ($) {
    $(document).ready(function () {
        if ( settingsInformation.supportedCryptoCurrencies != null ) {}
        settingsInformation.supportedCryptoCurrencies.forEach(element => {
            if ( element.active == "true" ) {
                var _ = document.getElementsByName(element.name)[0];
                $(_).addClass("active");
            }
        });
    });
})(jQuery);

// Toggling cryptocurrencies function
(function ($) {
    $(document).ready(function () {
        $(".supportedCurrencyContainer").click(function () {
            if ( $(this).hasClass("active") ) {
                $(this).removeClass("active");
                settingsInformation.supportedCryptoCurrencies.find(element => element.name == $(this).attr("name")).active = "false";
            }
            else {
                $(this).addClass("active");
                settingsInformation.supportedCryptoCurrencies.find(element => element.name == $(this).attr("name")).active = "true";
            }
            saveSettings(settingsInformation);
        });
    });
})(jQuery);