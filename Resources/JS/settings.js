// Get Settings Information
var settingsInformation;
function saveSettings(settings) {
  localStorage.setItem("settingsInformation", JSON.stringify(settings));
}
(function ($) {
  $(document).ready(function () {
    if (localStorage.getItem("settingsInformation") != null) {
      settingsInformation = JSON.parse(
        localStorage.getItem("settingsInformation")
      );
    } else {
      settingsInformation = {
        walletTotal: 0,
        supportedCryptoCurrencies: [],
        supportedFiatCurrencies: [
          "CAD",
          "USD",
          "EUR",
          "GBP",
          "INR",
          "CNY",
          "KRW",
          "HKD",
          "TWD",
          "AUD",
        ],
        activeFiatCurrency: "USD",
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
          $("#settingsIcon").attr("src", "../Resources/IMG/settingsHover.png");
        },
        function () {
          $("#settingsIcon").attr("src", "../Resources/IMG/settings.png");
        }
      )
      .click(function () {
        location.href = "../Pages/popup.html";
      });
  });
})(jQuery);

// Creating supported Fiat currencies containers
(function ($) {
  function CreateSupportedFiatCurrencyContainer(currency) {
    //#region new container
    var newCurrencyContainer = document.createElement("div");
    $(newCurrencyContainer).addClass("supportedFiatCurrencyContainer");
    $(newCurrencyContainer).attr("name", currency);
    //#endregion
    var currencyLabel = document.createElement("p");
    $(currencyLabel).addClass("supportedFiatCurrency");
    $(currencyLabel).html(currency);
    newCurrencyContainer.appendChild(currencyLabel);
    //#endregion

    document
      .getElementById("supportedFiatCurrencyListContainer")
      .appendChild(newCurrencyContainer);
  }

  $(document).ready(function () {
    settingsInformation.supportedFiatCurrencies.forEach((element) => {
      CreateSupportedFiatCurrencyContainer(element);
    });
  });
})(jQuery);

// Setting active fiat currency
(function ($) {
  $(document).ready(function () {
    if (settingsInformation.activeFiatCurrency != null) {
      if (
        document.getElementsByName(settingsInformation.activeFiatCurrency)[0] !=
        null
      ) {
        var _ = document.getElementsByName(
          settingsInformation.activeFiatCurrency
        )[0];
        $(_).addClass("active");
      }
    }
  });
})(jQuery);

// Fiat currency click function
(function ($) {
  $(document).ready(function () {
    $(".supportedFiatCurrencyContainer").click(function () {
      if ($(this).attr("name") == settingsInformation.activeFiatCurrency) {
        return;
      } else {
        if (
          document.getElementsByName(
            settingsInformation.activeFiatCurrency
          )[0] != null
        ) {
          $(
            document.getElementsByName(
              settingsInformation.activeFiatCurrency
            )[0]
          ).removeClass("active");
        }
        settingsInformation.activeFiatCurrency = $(this).attr("name");
        saveSettings(settingsInformation);
        $(this).addClass("active");
      }
    });
  });
})(jQuery);

// Creating supported crypto currencies containers
(function ($) {
  function CreateSupportedCryptoCurrencyContainer(currency) {
    //#region new container
    var newCurrencyContainer = document.createElement("div");
    $(newCurrencyContainer).addClass("supportedCurrencyContainer");
    $(newCurrencyContainer).attr("name", currency.name);
    //#endregion
    //#region logo
    var logo = document.createElement("img");
    $(logo).addClass("currencyLogo");
    var srcString =
      currency.imageString == null
        ? "../Resources/IMG/CryptoLogos/" + currency.name + "Logo.png"
        : currency.imageString;
    $(logo).attr("src", srcString);
    $(logo).attr("alt", currency.name + " Logo");
    newCurrencyContainer.appendChild(logo);
    //#endregion
    var currencyLabel = document.createElement("h3");
    $(currencyLabel).addClass("currencyLabel");
    $(currencyLabel).html(currency.name);
    newCurrencyContainer.appendChild(currencyLabel);
    //#endregion

    if (currency.active == "true") {
      $(newCurrencyContainer).addClass("active");
    }
    document
      .getElementById("supportedCryptocurrencyListContainer")
      .appendChild(newCurrencyContainer);
  }
  function CreateAddNewCryptoCurrencyContainer() {
    //#region new container
    var addCurrencyContainer = document.createElement("div");
    $(addCurrencyContainer).addClass("supportedCurrencyContainer");
    $(addCurrencyContainer).attr("id", "addNewCurrency");
    //#endregion
    //#region logo
    var logo = document.createElement("img");
    $(logo).addClass("currencyLogo");
    $(logo).attr("src", "../Resources/IMG/CryptoLogos/AddNewCurrencyLogo.png");
    $(logo).attr("alt", "Add New Currency Logo");
    addCurrencyContainer.appendChild(logo);
    //#endregion
    var currencyLabel = document.createElement("h3");
    $(currencyLabel).addClass("currencyLabel");
    $(currencyLabel).html("Add Coins");
    addCurrencyContainer.appendChild(currencyLabel);
    //#endregion

    document
      .getElementById("supportedCryptocurrencyListContainer")
      .appendChild(addCurrencyContainer);
  }

  $(document).ready(function () {
    settingsInformation.supportedCryptoCurrencies.forEach((element) => {
      CreateSupportedCryptoCurrencyContainer(element);
    });
    CreateAddNewCryptoCurrencyContainer();

    // Add cryptocurrencies function : October 6th, 2021 Zachary Cardoza
    $("#addNewCurrency").on("click", function () {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $("#addCryptocurrencyContainer").css("display", "none");
      } else {
        $(this).addClass("active");
        $("#addCryptocurrencyContainer").css("display", "grid");
      }
    });
    $("#addCryptocurrencyButton").on("click", async function () {
      fetch(
        "https://api.coingecko.com/api/v3/coins/" +
          `${document
            .getElementById("addCryptocurrencyInput")
            .value.toLowerCase()}`
      )
        .then((res) => {
          if (res.status == 200) {
            res.json().then((data) => {
              console.log(data);
              var newCurrencyToAdd = {
                name: data["name"],
                symbol: data["symbol"].toUpperCase(),
                active: "true",
                amountOwned: 0.0,
                lastPrice: 0.0,
                newPrice:
                  data["market_data"]["current_price"][
                    `${settingsInformation.activeFiatCurrency.toLowerCase()}`
                  ],
                imageString: data["image"]["small"],
                apiId: data["id"],
              };
              settingsInformation.supportedCryptoCurrencies.push(
                newCurrencyToAdd
              );
              saveSettings(settingsInformation);
              CreateSupportedCryptoCurrencyContainer(newCurrencyToAdd);
              document.getElementById("addCryptocurrencyInput").value = "";
            });
          } else if (res.status == 404) {
            document.getElementById("addCryptocurrencyInput").placeholder =
              "Could Not Find Coin. Try Again.";
            document.getElementById("addCryptocurrencyInput").value = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
    $(".supportedCurrencyContainer").on("click", function () {
      if ($(this).attr("id") == null) {
        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
          settingsInformation.supportedCryptoCurrencies.find(
            (element) => element.name == $(this).attr("name")
          ).active = "false";
        } else {
          $(this).addClass("active");
          settingsInformation.supportedCryptoCurrencies.find(
            (element) => element.name == $(this).attr("name")
          ).active = "true";
        }
        saveSettings(settingsInformation);
      }
    });
  });
})(jQuery);
