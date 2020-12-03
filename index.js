//= new code added ==================================//
let originNext = null;
let originPrev = null;
let originClear = null;
let originClose = null;

let searchTick = null;
let eventsTick = null;

let customWatching = false;
let customWatched = false;

let angularModal = null;

const clickNext = () => {
  if (originNext) {
    console.log('Next clicked!');
    startEventsTick();

    return originNext.click();
  }
}

const clickPrev = () => {
  if (originPrev) {
    console.log('Prev clicked!');
    startEventsTick();

    return originPrev.click();
  }
}

const clickClear = () => {
  if (originClear) {
    console.log('Clear clicked!');
    startEventsTick();

    return originClear.click();
  }
}

const clickClose = () => {
  if (originClose) {
    console.log('Close clicked!');
    startEventsTick();

    return originClose.click();
  }
}

function hideButton(element) {
  if (element) {
    element.classList.add('hide-button');
    element.style.overflow = 'hidden';
  }
}

function restyleButton(element, style) {
  if (element) {
    element.classList.add(style);
  }
}

function seekAndStyle() {
  const oldNext = document.querySelector('button[ng-if="modal.showNext()"]');
  const oldPrev = document.querySelector('button[ng-if="modal.showPrev()"]');
  const oldClear = document.querySelector('button[ng-if="modal.showClear()"]');
  const oldCancel = document.querySelector('button[ng-click="modal.cancel()"]');
  const progressBar = document.querySelector(`div[ng-style="{'width': modal.percentComplete() + '%' }"]`);

  const isDoneExist = document.querySelector('button.done-button');

  const goldFilled = 'gold-filled';
  const goldEmpty = 'gold-empty';

  if (progressBar){
    progressBar.style.backgroundImage = 'linear-gradient(to bottom, #D4AB72 0, #B19164 100%)';
    progressBar.style.backgroundColor = '#D4AB72';
    progressBar.style.color = "#000";
  }

  if (oldNext && !oldNext.classList.contains(goldFilled)) {
    restyleButton(oldNext, goldFilled);
    originNext = oldNext;
  }


  if (oldPrev && !oldPrev.classList.contains(goldEmpty)) {
    restyleButton(oldPrev, goldEmpty);
    oldPrev.style.marginRight = '72px';
    originPrev = oldPrev;
  }

  if (oldClear && !oldClear.classList.contains(goldEmpty)) {
    restyleButton(oldClear, goldEmpty);
    originClear = oldClear;
  }

  seekAndHideClear();
  seekClose();

  if (angularModal.modal.completed() && !isDoneExist) {
    const buttonsWrapper = document.querySelector('div.modal-footer').children[0].children[0];

    done = document.createElement('button');

    done.innerHTML = 'Done';
    done.className = "btn pull-right ng-scope gold-filled done-button";
    done.setAttribute('type', 'button');
    done.onclick = () => clickClose();

    buttonsWrapper.appendChild(done);
  }
}

  function seekAndHideNext() {
    const oldNext = document.querySelector('button[ng-if="modal.showNext()"]');

    if (oldNext && !oldNext.classList.contains('hide-button')) {
      hideButton(oldNext);
      originNext = oldNext;
    }
  }

  function seekAndHidePrev() {
    const oldPrev = document.querySelector('button[ng-if="modal.showPrev()"]');

    if (oldPrev && !oldPrev.classList.contains('hide-button')) {
      hideButton(oldPrev);
      originPrev = oldPrev;
    }
  }

  function seekAndHideClear() {
    const oldClear = document.querySelector('button[ng-if="modal.showClear()"]');

    if (oldClear && !oldClear.classList.contains('hide-button')) {
      hideButton(oldClear);
      originClear = oldClear;
    }
  }

  function seekAndHideClose() {
    const oldClose = document.querySelector('button[ng-click="modal.cancel()"]');

    if (oldClose && !oldClose.classList.contains('hide-button')) {
      hideButton(oldClose);
      originClose = oldClose;
    }
  }

  function seekClose() {
    const oldClose = document.querySelector('button[ng-click="modal.cancel()"]');

    if (oldClose) {
      originClose = oldClose;
    }
  }

  function seekAndHide() {
    seekAndHideNext();
    seekAndHidePrev();
    seekAndHideClear();
    seekAndHideClose();
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
  // const total = angularModal.modal.invest_now_investment.states.length;
  const isProcessed = !angularModal.modal.processing && !angularModal.modal.isLoading;

  if (customWatching && !isProcessed) {
    customWatched = true;
  }

  if (customWatching && customWatched && isProcessed) {
    customWatched = false;
    customWatching = false;

    if (angularModal.modal.showNext() && angularModal.modal.showPrev()) {
      console.log("event =======> show Both");
      logEvent("show Both");
    } else if (angularModal.modal.showNext() && !angularModal.modal.showPrev()) {
      console.log("event =======> show Next");
      logEvent("show Next");
    } else {
      console.log("event =======> Final");
      logEvent("Final");
    }
    clearInterval(eventsTick);
  } else {
    console.log("page is in processing");
  }
}

function startEventsTick() {
  eventsTick = setInterval(checkBothButtons, 100);
  customWatching = true;
  customWatched = false;
}

function clearForm() {
  document.dispatchEvent(clearEvent);
}

function ready() {
  console.log("document.DOMContentLoaded");
  const storageItem = 'ls.invest_now.sandbox';

  localStorage.removeItem(storageItem);
}

document.addEventListener("DOMContentLoaded", ready);
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
    // document.dispatchEvent(clearEvent);
    console.log('window.onload');

    // buttonsTick = setInterval(seekAndHide, 100);
    buttonsTick = setInterval(seekAndStyle, 100);
    
    angularModalTick = setInterval(findAngularModal, 133);
    startEventsTick();
};

// Event listeners
document.addEventListener('fa.investnow.close', function(e){
    document.dispatchEvent(clearEvent);
    logEvent('Close');
    console.log("logEvent('Close');");
});

document.addEventListener('fa.investnow.open', function(e){
    document.dispatchEvent(clearEvent);
    document.dispatchEvent(autofillEvent);
    logEvent('Open');
    console.log("logEvent('Open');");
});

document.addEventListener('fa.investnow.success', function(e){
    logEvent('Success')
});