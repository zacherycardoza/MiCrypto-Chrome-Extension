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
let currentWordIndex = 0;
let insertText = false;

fetch(`https://api.coingecko.com/api/v3/coins/list`)
  .then((res) => {
    if (res.status == 200) {
      res.json().then((data) => {
        var temp = data.filter((element) => element["id"].length <= 20);
        wordsArray = temp.map((element) => element["id"]);

        console.log(wordsArray);
      });
    } else if (res.status == 404) {
      alert("not available");
    }
  })
  .catch((err) => {
    console.log(err);
  });

textInputEl.addEventListener("input", (e) => {
  if (e.data != " ") {
    insertText = true;
  }
  if (insertText == false) {
    textInputEl.value = "";
  }

  let inputValue = e.target.value;
  suggestedWordsArray = filterArray(wordsArray, inputValue);
  suggestedWord = suggestedWordsArray[0];

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

textInputEl.addEventListener("keydown", (e) => {
  textInputEl.placeholder = "Add New Crypto Currency";
  if (e.keyCode == ENTER_KEYCODE) {
    if (textInputEl.value.length == 0) return;
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
    inputContainerEl.classList.add("animate");
    removeClassAfterAnimationCompletes(inputContainerEl, "animate");
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
      textInputEl.value = suggestedWordsArray[currentWordIndex];
      suggestionEl.innerHTML = "";
    }
  }
});

removeClassAfterAnimationCompletes(inputContainerEl, "animate");

function removeClassAfterAnimationCompletes(el, className) {
  try {
    let elStyles = window.getComputedStyle(inputContainerEl);
    setTimeout(function () {
      el.classList.remove(className);
    }, +elStyles.animationDuration.replace("s", "") * 1000);
  } catch {
    return;
  }
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
