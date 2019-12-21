window.oldInputValue=''
function complete() {
  var comp = this.innerHTML
  var traduction = this.nextSibling.innerHTML
  var newValueArray1 = document.getElementById('input1').value.split(" ")
  var newValueArray2 = document.getElementById('input2').value.split(" ")
  newValueArray1[newValueArray1.length - 1] = comp + " "
  newValueArray2[newValueArray2.length - 1] = traduction + " "
  document.getElementById('input1').value = newValueArray1.join(" ")
  document.getElementById('input2').value = newValueArray2.join(" ")
  clearSuggestionDiv()
}

window.storeOldInputValue = function() {
  window.oldInputValue = document.getElementById('input1').value
}

function clearSuggestionDiv() {
  document.getElementById('suggDiv').innerHTML = ""
}

window.autocomplete = function(text1, event) {
  mirrorInput2(text1)
  var text = text1.split(" ")[text1.split(" ").length - 1]
  text = text.toLowerCase()
  clearSuggestionDiv()
  var englishComp
  var candidates = []
  var candidatesEng = []
  for (var i = 0; i < window.nsibidi.length; i++) {
    var english = window.nsibidi[i][0]
    var nChar = window.nsibidi[i][1]
    if (english.includes(text)) {
      englishComp = nChar
      candidates.push(nChar)
      candidatesEng.push(english)
      var suggestionElement = createSuggestionElement(english, nChar)
      document.getElementById('suggDiv').appendChild(suggestionElement)
    }
  }
}

function mirrorInput2(text1) {
  var lastChar = text1[text1.length - 1]
  if (text1.length > window.oldInputValue.length) {
    document.getElementById('input2').value += lastChar
  } else {
    if (text1.length == 0) {
      document.getElementById('input2').value = text1
      return
    }
    var isNsiChar = window.oldInputValue[window.oldInputValue.length - 1].charCodeAt(0) > 1000
    if (isNsiChar) {
      document.getElementById('input2').value = removeLastWord(document.getElementById('input2').value)
    } else {
      document.getElementById('input2').value = document.getElementById('input2').value.substring(0, document.getElementById('input2').value.length - 1)
    }
  }
}

async function  onPasteInput1() {
  var clipboardContent  = await navigator.clipboard.readText();
  var cursorPosition = doGetCaretPosition(document.getElementById('input1'))
  String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
  };
  document.getElementById('input2').value = document.getElementById('input2').value.splice(cursorPosition,0,clipboardContent)
}
window.onPasteInput1=onPasteInput1
function doGetCaretPosition(oField) {

  // Initialize
  var iCaretPos = 0;

  // IE Support
  if (document.selection) {

    // Set focus on the element
    oField.focus();

    // To get cursor position, get empty selection range
    var oSel = document.selection.createRange();

    // Move selection start to 0 position
    oSel.moveStart('character', -oField.value.length);

    // The caret position is selection length
    iCaretPos = oSel.text.length;
  }

  // Firefox support
  else if (oField.selectionStart || oField.selectionStart == '0')
    iCaretPos = oField.selectionDirection == 'backward' ? oField.selectionStart : oField.selectionEnd;

  // Return results
  return iCaretPos;
}

function removeLastWord(text) {
  var array = text.split(" ")
  var index = array.length - 1
  array.splice(index, 1)
  return array.join(" ") + " "
}

var createSuggestionElement = function(english, nsibidiChar) {
  var div = document.createElement("div")
  div.className = "suggItem alert-info"
  var buttonNsiChar = document.createElement("span")
  buttonNsiChar.className = "nsiChar"
  var spanEng = document.createElement("span")
  spanEng.className = "spanEng"
  buttonNsiChar.innerHTML = nsibidiChar
  spanEng.innerText = english
  div.appendChild(buttonNsiChar)
  div.appendChild(spanEng)
  div.onclick = complete.bind(buttonNsiChar)
  return div
}.bind(window)
