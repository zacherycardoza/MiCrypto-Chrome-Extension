// Get Settings Information
var settingsInformation;
function saveSettings(settings) {
  localStorage.setItem("settingsInformation", JSON.stringify(settings));
}
(function ($) {
  $(document).ready(async function () {
    if (localStorage.getItem("settingsInformation") != null) {
      settingsInformation = JSON.parse(
        localStorage.getItem("settingsInformation")
      );
    } else {
      location.href = "../Pages/settings.html";
    }
  });
})(jQuery);

//#endregion

//#region settings button
(function ($) {
  $(document).ready(function () {
    $("#settingsButton")
      .hover(
        function () {
          $("#settingsIcon").attr("src", "../Resources/IMG/settingsHover.png");
        },
        function () {
          $("#settingsIcon").attr("src", "../Resources/IMG/settings.png");
        }
      )
      .click(function () {
        location.href = "../Pages/settings.html";
      });
  });
})(jQuery);
//#endregion

(function ($) {
  function CreateTrackedCurrencyContainer(currency) {
    //#region new container
    var newCurrencyContainer = document.createElement("div");
    $(newCurrencyContainer).addClass("currencyContainer");
    $(newCurrencyContainer).attr("name", currency.name);
    //#endregion
    var rowOne = document.createElement("div");
    var rowTwo = document.createElement("div");
    $(rowOne).addClass("rowOne");
    $(rowTwo).addClass("rowTwo");
    //#region logo
    var newCurrencyLogoContainer = document.createElement("div");
    $(newCurrencyLogoContainer).addClass("currencyLogoContainer");
    var logo = document.createElement("img");
    $(logo).addClass("currencyLogo");
    var srcString =
      currency.imageStringThumb == null
        ? "../Resources/IMG/CryptoLogos/" + currency.name + "Logo.png"
        : currency.imageStringThumb;
    $(logo).attr("src", srcString);
    $(logo).attr("alt", currency.name);
    newCurrencyLogoContainer.appendChild(logo);
    rowOne.appendChild(newCurrencyLogoContainer);
    //#endregion
    //#region name
    var newCurrencyNameContainer = document.createElement("div");
    $(newCurrencyNameContainer).addClass("currencyNameContainer");
    var name = document.createElement("p");
    $(name).addClass("currencyName");
    $(name).html(currency.name);
    newCurrencyNameContainer.appendChild(name);
    rowOne.appendChild(newCurrencyNameContainer);
    //#endregion
    //#region one unit converted
    var newCurrencyOneUnitConvertedContainer = document.createElement("div");
    $(newCurrencyOneUnitConvertedContainer).addClass(
      "currencyOneUnitConvertedContainer"
    );
    var oneUnitConverted = document.createElement("p");
    $(oneUnitConverted).addClass("currencyOneUnitConverted");
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${
        currency.apiId
      }&vs_currencies=${settingsInformation.activeFiatCurrency.toLowerCase()}`
    )
      .then((res) => {
        if (res.status == 200) {
          res.json().then((data) => {
            currency.lastPrice = currency.newPrice;
            console.log(data);
            currency.newPrice = (
              Math.round(
                data[`${currency.apiId}`][
                  `${settingsInformation.activeFiatCurrency.toLowerCase()}`
                ] * Math.pow(10, 2)
              ) / Math.pow(10, 2)
            ).toFixed(2);
            $(oneUnitConverted).html(
              currency.symbol +
                "  " +
                currency.newPrice +
                " " +
                settingsInformation.activeFiatCurrency
            );
            saveSettings(settingsInformation);
          });
        } else if (res.status == 404) {
          alert("not available");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    newCurrencyOneUnitConvertedContainer.appendChild(oneUnitConverted);
    rowTwo.appendChild(newCurrencyOneUnitConvertedContainer);
    //#endregion
    //#region wallet label
    var newCurrencyWalletLabelContainer = document.createElement("div");
    $(newCurrencyWalletLabelContainer).addClass("currencyWalletLabelContainer");
    var walletLabel = document.createElement("p");
    $(walletLabel).addClass("currencyWalletLabel");
    $(walletLabel).addClass("walletAmount");
    $(walletLabel).attr("Id", currency.name);
    $(walletLabel).attr("contenteditable", "true");
    $(walletLabel).html(currency.amountOwned);
    newCurrencyWalletLabelContainer.appendChild(walletLabel);
    var walletSymbolLabel = document.createElement("p");
    $(walletSymbolLabel).html(" " + currency.symbol);
    newCurrencyWalletLabelContainer.appendChild(walletSymbolLabel);
    rowOne.appendChild(newCurrencyWalletLabelContainer);
    //#endregion
    //#region wallet converted
    var newCurrencyWalletConvertedContainer = document.createElement("div");
    $(newCurrencyWalletConvertedContainer).addClass(
      "currencyWalletConvertedContainer"
    );
    var walletConverted = document.createElement("p");
    $(walletConverted).addClass("currencyWalletConverted");
    $(walletConverted).attr("Id", currency.name + "WalletConverted");
    var amountOwnedConverted = currency.amountOwned * currency.newPrice;
    amountOwnedConverted = (
      Math.round(amountOwnedConverted * Math.pow(10, 2)) / Math.pow(10, 2)
    ).toFixed(2);
    $(walletConverted).html(
      amountOwnedConverted + " " + settingsInformation.activeFiatCurrency
    );
    newCurrencyWalletConvertedContainer.appendChild(walletConverted);
    rowTwo.appendChild(newCurrencyWalletConvertedContainer);
    document.getElementById("walletTotal").innerHTML =
      settingsInformation.walletTotal +
      " " +
      settingsInformation.activeFiatCurrency;
    //#endregion
    newCurrencyContainer.appendChild(rowOne);
    newCurrencyContainer.appendChild(rowTwo);
    document
      .getElementById("trackedCurrencyListContainer")
      .appendChild(newCurrencyContainer);
  }

  $(document).ready(function () {
    settingsInformation.supportedCryptoCurrencies.forEach((element) => {
      if (element.active == "true") {
        CreateTrackedCurrencyContainer(element);
      }
    });

    $(".currencyWalletLabel")
      .on("input", async function () {
        var currency = settingsInformation.supportedCryptoCurrencies.filter(
          (currency) => currency.name == $(this).attr("Id")
        );
        if ($(this).html().length <= 0) {
          $(this).html("0");
        }
        currency[0].amountOwned = $(this).html();
        saveSettings(settingsInformation);

        var amountOwnedConverted = $(this).html() * currency[0].newPrice;
        var convertIdString = $(this).attr("Id") + "WalletConverted";
        amountOwnedConverted = (
          Math.round(amountOwnedConverted * Math.pow(10, 2)) / Math.pow(10, 2)
        ).toFixed(2);
        $(`#${convertIdString}`).html(
          amountOwnedConverted + " " + settingsInformation.activeFiatCurrency
        );
      })
      .on("input", async function () {
        var walletTotalAmount = 0;
        var activeCurrencies =
          settingsInformation.supportedCryptoCurrencies.filter(
            (currency) => currency.active == "true"
          );
        console.log(activeCurrencies);
        activeCurrencies.forEach((currency) => {
          walletTotalAmount += currency.amountOwned * currency.newPrice;
        });
        walletTotalAmount = (
          Math.round(walletTotalAmount * Math.pow(10, 2)) / Math.pow(10, 2)
        ).toFixed(2);
        document.getElementById("walletTotal").innerHTML =
          walletTotalAmount + " " + settingsInformation.activeFiatCurrency;
        settingsInformation.walletTotal = walletTotalAmount;
        saveSettings(settingsInformation);
      });
  });
})(jQuery);
