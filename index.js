//= new code added ==================================//
let originNext = null;
let originPrev = null;
let originClear = null;

let searchTick = null;

let angularModal = null;

const clickNext = () => {
  if (originNext) {
    console.log('Next clicked!');
    return originNext.click();
  }
}

const clickPrev = () => {
  if (originPrev) {
    console.log('Prev clicked!');
    return originPrev.click();
  }
}

const clickClear = () => {
  if (originClear) {
    console.log('Clear clicked!');
    return originClear.click();
  }
}

function hideButton(element) {
  element.classList.add('hide-button');
}

function seekAndHide() {
  const oldNext = document.querySelector('button[ng-if="modal.showNext()"]');
  const oldPrev = document.querySelector('button[ng-if="modal.showPrev()"]');
  const oldClear = document.querySelector('button[ng-if="modal.showClear()"]');

  if (oldNext && !oldNext.classList.contains('hide-button')) {
    hideButton(oldNext);
    originNext = oldNext;
  }

  if (oldPrev && !oldPrev.classList.contains('hide-button')) {
    hideButton(oldPrev);
    originPrev = oldPrev;
  }

  if (oldClear && !oldClear.classList.contains('hide-button')) {
    hideButton(oldClear);
    originClear = oldClear;
  }
}


function findAngularModal() {
  let modalElement = document.querySelector('.modal');

  if (modalElement) {
    angularModal = angular.element(modalElement).scope();
    clearInterval(angularModalTick);
    console.log('modal is found');
  }
}

function checkBothButtons() {
  if (!angularModal) {
    console.log("not ready");
    return;
  }

  const current = angularModal.modal.getStateIndex();
  const total = angularModal.modal.invest_now_investment.states.length;
  const isProcessed = !angularModal.modal.processing && !angularModal.modal.isLoading;

  if (isProcessed) {
    if (current === 0) {
      console.log("show only Next");
    } else if (current < total - 1) {
      console.log("show Both");
    } else {
      console.log("Final!");
    }
  } else {
    console.log("page is in processing");
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

    buttonsTick = setInterval(seekAndHide, 100);
    angularModalTick = setInterval(findAngularModal, 133);
    let eventsTick = setInterval(checkBothButtons, 500);
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