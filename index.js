//= new code added ==================================//
let originNext = null;
let originPrev = null;
let originClear = null;

let searchTick = null;
let eventsTick = null;

let customWatching = false;
let customWatched = false;

let angularModal = {};

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

function hideButton(element) {
    element.classList.add('hide-button');
    element.style.overflow = 'hidden';
}

function seekAndHide() {
  const oldNext = document.querySelector('button[ng-if="modal.showNext()"]');
  const oldPrev = document.querySelector('button[ng-if="modal.showPrev()"]');
  const oldClear = document.querySelector('button[ng-if="modal.showClear()"]');
  const oldClose = document.querySelector('button[ng-click="modal.cancel()"]');
  const progressBar = document.querySelector(`div[ng-style="{'width': modal.percentComplete() + '%' }"]`);
  const popover = document.querySelector(`div[tooltip-animation-class="fade"]`);
  const link = document.querySelector(`a[href="http://www.fundamerica.com"]`);

  if (progressBar) {
    progressBar.style.backgroundImage = 'linear-gradient(to bottom, #D4AB72 0, #B19164 100%)';
    progressBar.style.backgroundColor = '#D4AB72';
    progressBar.style.color = "#000";
  }
  
  if (popover) {
    popover.style.backgroundColor = '#D4AB72';
  }
  
  if (link) {
    link.style.color = "#D4AB72";
  }

    if (oldNext && !oldNext.classList.contains('hide-button')) {
      hideButton(oldNext);
      originNext = oldNext;
      angularModal.modal = {
        ...angularModal?.modal,
        showNext: () => !!originNext,
      }
    }

    if (oldPrev && !oldPrev.classList.contains('hide-button')) {
      hideButton(oldPrev);
      originPrev = oldPrev;
      angularModal.modal = {
        ...angularModal?.modal,
        showPrev: () => !!originPrev,
      }
    }

    if (oldClear && !oldClear.classList.contains('hide-button')) {
      hideButton(oldClear);
      originClear = oldClear;
    }

    if (oldClose && !oldClose.classList.contains('hide-button')) {
      hideButton(oldClose);
    }
}


function findAngularModal() {
  let modalElement = document.querySelector('.invest-now-modal');
  
  if (!modalElement) {
    angularModal.modal = {
      processing: true,
      isLoading: true,
      showNext: () => false,
      showPrev: () => false,
    }
  } else {
    // angularModal = angular.element(modalElement).scope();
    checkModalState();

    clearInterval(angularModalTick);
    console.log('modal is found', modalElement, angularModal);
  }
}

function checkBothButtons() {
  if (angularModal === {}) {
    console.log("not ready");
    return;
  }

  checkModalState();

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

function checkModalState() {
  const spinner = document.querySelector('.loading-spinner');

  angularModal.modal = {
      processing: !spinner?.classList.contains('ng-hide') || spinner?.classList.length > 2,
      isLoading: originNext?.childElementCount || originPrev?.childElementCount,
      showNext: () => !!originNext,
      showPrev: () => !!originPrev,
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
    "name": 'Test1 User1',
    "amount": '250',
    "email": 'vixem21903@etoymail.com',
};

var clearEvent = document.createEvent('Event');
clearEvent.initEvent('fa.investnow.clear', true, false);

// Invest Now button click
window.onload = function() {
    document.getElementById("invest-now-button").click();
    // document.dispatchEvent(clearEvent);
    console.log('window.onload');

    buttonsTick = setInterval(seekAndHide, 100);
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