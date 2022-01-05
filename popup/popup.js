$(function () {
  $('#undo').click(async function () {
    var tabId = await getCurrentTab();
    let res = await chrome.scripting.executeScript(
    {
      target: {tabId: tabId},
      func:  undoChanges
    });
    $(this).blur();
  });

  $('#save-template').click(async function () {
    var tabId = await getCurrentTab();
    await chrome.scripting.executeScript(
    {
      target: {tabId: tabId},
      func: saveTemplates
    });
    $(this).blur();
    window.close();
  });

  $('#restore-template').click(async function () {
    var obj = {};
    obj['isFromPopup'] = true;
    await chrome.runtime.sendMessage({type: "store-local", value: obj}, function(response) {
      let queryOptions = { active: true, lastFocusedWindow: true};
      chrome.tabs.query(queryOptions, function([tab]) {
        chrome.scripting.executeScript(
          {
            target: {tabId: tab.id},
            files: ['templates/restore-template.js'],
          },
          function() {
            window.close();
            console.log("Last error:", chrome.runtime.lastError);
          });
      });
    });
  });

  $('#edit-templates').click(async function () {
    chrome.tabs.create({'url': 'templates/templates.html'});
    window.close();
  });

  $('#clear').click(async function () {
    var tabId = await getCurrentTab();
    let res = await chrome.scripting.executeScript(
    {
      target: {tabId: tabId},
      func:  clearHistory,
    });
    $(this).blur();
    window.close();
  });
});

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true};
  let [tab] = await chrome.tabs.query(queryOptions);
  if (tab != undefined) {
    return tab.id;
  }
  else {
    throw "Tab Id is undefined";
  }
}

function undoChanges() {
  var $form = $('form');
  window.parser = new FormParser($form);
  var url = window.location.href; 
  var urlParser = new URLParser(url);
  var url = urlParser.removeFragment(); 
  window.parser.restore(url, function(restored) {
    if (restored) {
      chrome.runtime.sendMessage({type: "recovered", id: url}, function(response) {
        console.log("Recovered data for this form.");
      });
    }
    else {
      chrome.runtime.sendMessage({type: "no-data-to-recover", id: url}, function(response) {
        console.log("No data ro recover for this form.");
      });
    }
  });
}

function saveTemplates() {
  var $templateForm = $('form');
  window.parser = new FormParser($templateForm);
  var url = window.location.href;
  var domain = document.domain;
  var urlParser = new URLParser(url);
  var url = urlParser.removeFragment();
  window.parser.saveTemplate(url, domain);
  chrome.runtime.sendMessage({type: "saved", id: url}, function(response) {
    console.log("Saved template");
  });
}

function editTemplates() {
  chrome.tabs.create({'url': 'templates/templates.html'});
}

function clearHistory() {
  if (confirm("Are you sure you want to clear your history?") == true) {
    chrome.storage.local.clear();
    chrome.storage.sync.clear();
    chrome.runtime.sendMessage({type: "cleared", id: url}, function(response) {
      console.log("History cleared");
    });
  };
}