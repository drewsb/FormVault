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
    let res = await chrome.scripting.executeScript(
    {
      target: {tabId: tabId},
      func: saveTemplates
    });
    $(this).blur();
    window.close();
  });

  $('#restore-template').click(async function () {
    var tabId = await getCurrentTab();
    let res = await chrome.scripting.executeScript(
      {
        target: {tabId: tabId},
        files: ['templates/restore-template.js'],
      });
    window.close();
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
  var url = window.location.href; 
  var urlParser = new URLParser(window.location.href);
  var url = urlParser.removeFragment(); 
  window.parser.restore(url);
}

function saveTemplates() {
  var url = window.location.href;
  var domain = document.domain;
  var urlParser = new URLParser(window.location.href);
  var url = urlParser.removeFragment();
  window.parser.saveTemplate(url, domain);
}

function editTemplates() {
  chrome.tabs.create({'url': 'templates/templates.html'});
}

function clearHistory() {
  if (confirm("Are you sure you want to clear your history?") == true) {
    chrome.storage.local.clear();
    chrome.storage.sync.clear();
    console.log("History Cleared");
  };
}