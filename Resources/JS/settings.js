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
          $("#settingsIcon").attr("src", "../Resources/IMG/mainHover.png");
        },
        function () {
          $("#settingsIcon").attr("src", "../Resources/IMG/main.png");
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
      currency.imageStringSmall == null
        ? "../Resources/IMG/CryptoLogos/" + currency.name + "Logo.png"
        : currency.imageStringSmall;
    $(logo).attr("src", srcString);
    $(logo).attr("alt", currency.name + " Logo");
    newCurrencyContainer.appendChild(logo);
    //#endregion
    //#region label
    var currencyLabel = document.createElement("p");
    $(currencyLabel).addClass("currencyLabel");
    $(currencyLabel).html(currency.name);
    newCurrencyContainer.appendChild(currencyLabel);
    //#endregion
    //#region symbol
    var currencySymbol = document.createElement("p");
    $(currencySymbol).addClass("currencySymbol");
    $(currencySymbol).html(currency.symbol);
    newCurrencyContainer.appendChild(currencySymbol);
    //#endregion
    //#region toggle
    var toggleContainer = document.createElement("label");
    $(toggleContainer).addClass("switch");
    var checkBox = document.createElement("input");
    $(checkBox).addClass("toggler");
    $(checkBox).attr("type", "checkbox");
    $(checkBox).attr("name", currency.name);
    if (currency.active == "true") {
      checkBox.checked = true;
    } else {
      checkBox.checked = false;
    }
    toggleContainer.appendChild(checkBox);
    var sliderSpan = document.createElement("span");
    $(sliderSpan).addClass("slider");
    $(sliderSpan).addClass("round");
    $(sliderSpan).addClass("currencyTrackToggle");
    toggleContainer.appendChild(sliderSpan);
    newCurrencyContainer.appendChild(toggleContainer);
    //#endregion
    //#region delete button
    var currencyDeleteButton = document.createElement("button");
    $(currencyDeleteButton).addClass("currencyDeleteButton");
    $(currencyDeleteButton).attr("name", currency.name);
    $(currencyDeleteButton).html("Delete");
    newCurrencyContainer.appendChild(currencyDeleteButton);
    //#endregion

    if (currency.active == "true") {
      $(newCurrencyContainer).addClass("active");
    }
    document
      .getElementById("supportedCryptocurrencyListContainer")
      .appendChild(newCurrencyContainer);
  }

  $(document).ready(function () {
    settingsInformation.supportedCryptoCurrencies.forEach((element) => {
      CreateSupportedCryptoCurrencyContainer(element);
    });

    // Add cryptocurrencies function : October 6th, 2021 Zachary Cardoza
    $("#addCryptocurrencyButton").on("click", async function () {
      // check if coin is already being tracked and returns out if so
      var existingCurrency = settingsInformation.supportedCryptoCurrencies.find(
        (element) =>
          element.apiId ==
          document.getElementById("addCryptocurrencyInput").value.toLowerCase()
      );
      if (existingCurrency != null) {
        document.getElementById("addCryptocurrencyInput").placeholder =
          "Coin Is Already Being Tracked.";
        document.getElementById("addCryptocurrencyInput").value = "";
        document.getElementById("suggestion-container").innerHTML = "";
        return;
      }

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
                imageStringThumb: data["image"]["thumb"],
                imageStringSmall: data["image"]["small"],
                apiId: data["id"],
              };
              settingsInformation.supportedCryptoCurrencies.push(
                newCurrencyToAdd
              );
              saveSettings(settingsInformation);
              CreateSupportedCryptoCurrencyContainer(newCurrencyToAdd);
              document.getElementById("addCryptocurrencyInput").value = "";
              document.getElementById("suggestion-container").innerHTML = "";
            });
          } else if (res.status == 404) {
            document.getElementById("addCryptocurrencyInput").placeholder =
              "Could Not Find Coin. Try Again.";
            document.getElementById("addCryptocurrencyInput").value = "";
            document.getElementById("suggestion-container").innerHTML = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
    $(".toggler").on("click", async function () {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        settingsInformation.supportedCryptoCurrencies.find(
          (element) => element.name == $(this).attr("name")
        ).active = "false";
        this.checked = false;
      } else {
        $(this).addClass("active");
        settingsInformation.supportedCryptoCurrencies.find(
          (element) => element.name == $(this).attr("name")
        ).active = "true";
        this.checked = true;
      }
      saveSettings(settingsInformation);
    });
    $(".currencyDeleteButton").on("click", async function () {
      var currency = settingsInformation.supportedCryptoCurrencies.find(
        (element) => element.name == $(this).attr("name")
      );
      const index =
        settingsInformation.supportedCryptoCurrencies.indexOf(currency);
      if (index > -1) {
        settingsInformation.supportedCryptoCurrencies.splice(index, 1);
      }
      this.parentElement.remove();
      saveSettings(settingsInformation);
    });
  });
})(jQuery);

export default CreateSupportedCryptoCurrencyContainer(currency);
