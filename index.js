//= new code added ==================================//
let originNext = null;
let originPrev = null;
let buttonStartOver = null;

let searchTick = null;

let next = document.createElement("button");
next.innerHTML = "Next";
let prev = document.createElement("button");
prev.innerHTML = "Prev";
let startOver = document.createElement("button");
startOver.innerHTML = "StartOver";

const clickButtonNext = () => {
  return originNext.click();
}

const clickButtonPrev = () => {
  return originPrev.click();
}

function addCustomButton(origin, custom, click) {
  custom.onclick = click;
  origin.parentNode.insertBefore(custom, origin);
}

function hideButton(element) {
  element.classList.add('hide-button');
}

function searchOriginNext() {
  originNext = document.querySelector('button[ng-if="modal.showNext()"]');

  if (originNext){
    clearInterval(searchTick);
    hideButton(originNext);
    addCustomButton(originNext, next, clickButtonNext);
    searchTick = setInterval(searchOriginPrev, 200);
  }
}

function searchOriginPrev() {
  originPrev = document.querySelector('button[ng-if="modal.showPrev()"]');

  if (originPrev){
    clearInterval(searchTick);
    hideButton(originPrev);
    addCustomButton(originPrev, prev, clickButtonPrev);
  }
}

function searchTrigger() {
  const trigger = document.getElementById('fa-form-financial_advisor');

  if (trigger) {
    searchOriginNext();
  }
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
    "name": 'name',
    "amount": '432',
    "email": 'user@g.com',
};

var clearEvent = document.createEvent('Event');

clearEvent.initEvent('fa.investnow.clear', true, false);

// Invest Now button click
window.onload = function() {
    document.getElementById("invest-now-button").click();
    document.dispatchEvent(clearEvent);

    searchTick = setInterval(searchTrigger, 200);
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