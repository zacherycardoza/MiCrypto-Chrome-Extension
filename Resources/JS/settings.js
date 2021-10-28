//#region consts, lets, vars
const inputContainerEl = document.querySelector(".input-container");
const textInputEl = document.querySelector("input#addCryptocurrencyInput");
const suggestionEl = document.querySelector(".suggestion-container");

const ENTER_KEYCODE = 13;
const TAB_KEYCODE = 9;
const BACKSPACE_KEYCODE = 8;
const UP_ARROW_KEYCODE = 38;
const DOWN_ARROW_KEYCODE = 40;
const SPACE_KEYCODE = 32;

let wordsArray = [];
let suggestedWord = "";
let suggestedWordsArray = [];
let suggestedTopHundredWordsArray = [];
let currentWordIndex = 0;
let insertText = false;

var settingsInformation;
var topHundred;
//#endregion

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
    settingsInformation.supportedCryptoCurrencies.forEach((element) => {
      CreateSupportedCryptoCurrencyContainer(element);
    });
    settingsInformation.supportedFiatCurrencies.forEach((element) => {
      CreateSupportedFiatCurrencyContainer(element);
    });
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
      console.log(document.getElementById("addCryptocurrencyInput").value);
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
              suggestionEl.innerHTML = "";
            });
          } else if (res.status == 404) {
            existingCurrency =
              settingsInformation.supportedCryptoCurrencies.find(
                (element) => element.apiId == suggestedWord
              );
            if (existingCurrency != null) {
              document.getElementById("addCryptocurrencyInput").placeholder =
                "Coin Is Already Being Tracked.";
              document.getElementById("addCryptocurrencyInput").value = "";
              suggestionEl.innerHTML = "";
              return;
            }
            fetch(`https://api.coingecko.com/api/v3/coins/${suggestedWord}`)
              .then((res) => {
                if (res.status == 200) {
                  res.json().then((data) => {
                    // check if coin is already being tracked and returns out if so
                    existingCurrency =
                      settingsInformation.supportedCryptoCurrencies.find(
                        (element) =>
                          element.apiId ==
                          document
                            .getElementById("suggestion-container")
                            .innerHTML.toLowerCase()
                      );
                    if (existingCurrency != null) {
                      document.getElementById(
                        "addCryptocurrencyInput"
                      ).placeholder = "Coin Is Already Being Tracked.";
                      document.getElementById("addCryptocurrencyInput").value =
                        "";
                      document.getElementById(
                        "suggestion-container"
                      ).innerHTML = "";
                      return;
                    }
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
                    document.getElementById("addCryptocurrencyInput").value =
                      "";
                    document.getElementById("suggestion-container").innerHTML =
                      "";
                  });
                }
              })
              .catch((err) => console.log(err));
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
    $("#addCryptocurrencyInput").on("input", (e) => {
      if (e.data != " ") {
        insertText = true;
      }
      if (insertText == false) {
        textInputEl.value = "";
      }

      let inputValue = e.target.value;

      suggestedTopHundredWordsArray = filterArray(topHundred, inputValue, true);
      suggestedWordsArray = filterArray(wordsArray, inputValue, true);
      suggestedWord =
        suggestedTopHundredWordsArray[0] != undefined
          ? suggestedTopHundredWordsArray[0]
          : suggestedWordsArray[0];

      if (suggestedWord != undefined) {
        suggestionEl.innerHTML = suggestedWord;
      }

      if (inputValue.length == 0 || suggestedWordsArray.length == 0) {
        suggestionEl.innerHTML = "";
      }

      if (textInputEl.value.length == 0) {
        insertText = false;
      }
    });
    $("#addCryptocurrencyInput").on("keydown", (e) => {
      textInputEl.placeholder = "Enter Currency Name Here";
      if (e.keyCode == ENTER_KEYCODE) {
        if (textInputEl.value.length == 0) return;
        document.getElementById("addCryptocurrencyButton").click();
        let inputValue = textInputEl.value;
        let words = inputValue.split(" ");
        for (let i in words) {
          if (words[i].length != 0) {
            wordsArray.push(words[i]);
            textInputEl.value = "";
            suggestionEl.innerHTML = "";
          }
        }
        wordsArray = removeDuplicatesFromArray(wordsArray);
      }

      if (textInputEl.value.length != 0) {
        if (e.keyCode == UP_ARROW_KEYCODE) {
          if (currentWordIndex == 0) return;
          currentWordIndex--;
          suggestionEl.innerHTML = suggestedWordsArray[currentWordIndex];
        }

        if (e.keyCode == DOWN_ARROW_KEYCODE) {
          if (currentWordIndex == suggestedWordsArray.length - 1) return;
          currentWordIndex++;
          suggestionEl.innerHTML = suggestedWordsArray[currentWordIndex];
        }

        if (e.keyCode == BACKSPACE_KEYCODE) {
          currentWordIndex = 0;
        }
      }

      if (suggestedWord != undefined && suggestedWord != "") {
        if (e.keyCode == TAB_KEYCODE) {
          e.preventDefault();
          textInputEl.value =
            suggestedTopHundredWordsArray[0] != undefined
              ? suggestedTopHundredWordsArray[0]
              : suggestedWordsArray[currentWordIndex];
          suggestionEl.innerHTML = "";
        }
      }
    });
  });
})(jQuery);

//#region API Fetchs for autocomplete
fetch(`https://api.coingecko.com/api/v3/coins/list`)
  .then((res) => {
    if (res.status == 200) {
      res.json().then((data) => {
        var temp = data.filter((element) => element["id"].length <= 20);
        wordsArray = temp.map((element) => element["id"]);
      });
    } else if (res.status == 404) {
      alert("not available");
    }
  })
  .catch((err) => {
    console.log(err);
  });

fetch(
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
)
  .then((res) => {
    res.json().then((data) => {
      topHundred = data.map((element) => element["id"]);
    });
  })
  .catch((err) => {
    console.log(err);
  });
//#endregion
function saveSettings(settings) {
  localStorage.setItem("settingsInformation", JSON.stringify(settings));
}
function filterArray(array, item, reverse = false) {
  if (reverse) {
    return array
      .filter((word) => compareTwoStrings(word, item))
      .sort((a, b) => a.length - b.length);
  } else {
    return array
      .filter((word) => compareTwoStrings(word, item))
      .sort((a, b) => b.length - a.length);
  }
}
function removeDuplicatesFromArray(array) {
  return [...new Set(array.map((i) => i))];
}
function compareTwoStrings(string, subString) {
  let temp = string.split("", subString.length).join("");
  if (subString == temp) return subString;
}
function fetchApi(url) {
  fetch(url)
    .then((response) =>
      response.ok ? response.json() : Promise.reject({ err: response.status })
    )
    .then((data) => handleData(data))
    .catch((error) => console.log("Request Failed:", error));
}
