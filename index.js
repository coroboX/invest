//= new code added ==================================//
let buttonNext = null;
let searchTick = null;
let buttonTest = document.createElement("button");
buttonTest.innerHTML = "Custom Button"

function addCustomButton() {
  buttonNext.classList.add('button-next');
  buttonNext.parentNode.insertBefore(buttonTest, buttonNext);
}

function hideButton(element) {
  element.classList.add('hide-button');
  // element.style.width = "0px";
  // element.style.height = "0px";
  // element.style.opacity = 0;
}

function searchButtonNext() {
  buttonNext = document.querySelector('button[ng-if]');

  if (buttonNext){
    clearInterval(searchTick);
    hideButton(buttonNext);
    addCustomButton();
  }
  console.log(buttonNext, searchTick);

}


//= end of new code added ==================================//

function logEvent(eventName) {
  if (window.Android) {
      Android.logEvent(eventName);
  }

  if (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.iosListener
  ) {
      window.webkit.messageHandlers.iosListener.postMessage(eventName);
  }

  window.parent.postMessage(eventName, '*')
}

var autofillEvent = document.createEvent('Event');
autofillEvent.initEvent('fa.investnow.autofill', true, false);

autofillEvent.investor = {
    "type": 'person',
    "name": '{{ $user->full_name }}',
    "amount": '{{ $tier->value }}',
    "email": '{{ $user->email }}',
};

var clearEvent = document.createEvent('Event');

clearEvent.initEvent('fa.investnow.clear', true, false);

// Invest Now button click
window.onload = function() {
    document.getElementById("invest-now-button").click();
    document.dispatchEvent(clearEvent);

    searchTick = setInterval(searchButtonNext, 200);
};

// Event listeners
document.addEventListener('fa.investnow.close', function(e){
    document.dispatchEvent(clearEvent);
    logEvent('Close');
});

document.addEventListener('fa.investnow.open', function(e){
    document.dispatchEvent(clearEvent);
    document.dispatchEvent(autofillEvent);
    logEvent('Open');
});

document.addEventListener('fa.investnow.success', function(e){
    logEvent('Success')
});