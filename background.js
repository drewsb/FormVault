chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type == "saved") {
            chrome.notifications.create(null, {
                type: 'basic',
                iconUrl: 'popup/checked.png',
                title: 'FormVault',
                message: 'Template Successfully Saved!',
                priority: 2
            }, function (response) {
                console.log("Last error:", chrome.runtime.lastError);
                sendResponse();
            });
        }
        else if (request.type == "cleared") {
            chrome.notifications.create(null, {
                type: 'basic',
                iconUrl: 'popup/checked.png',
                title: 'FormVault',
                message: 'Template History Cleared',
                priority: 2
            }, function (response) {
                console.log("Last error:", chrome.runtime.lastError);
                sendResponse();
            });
        }
        else if (request.type == "restored") {
            chrome.notifications.create(null, {
                type: 'basic',
                iconUrl: 'popup/checked.png',
                title: 'FormVault',
                message: 'Template Successfully Restored!',
                priority: 2
            }, function (response) {
                console.log("Last error:", chrome.runtime.lastError);
                sendResponse();
            });
        }
        else if (request.type == "recovered") {
            chrome.notifications.create(null, {
                type: 'basic',
                iconUrl: 'popup/checked.png',
                title: 'FormVault',
                message: 'Form Recovered to Previous State!',
                priority: 2
            }, function (response) {
                console.log("Last error:", chrome.runtime.lastError);
                sendResponse();
            });
        }
        else if (request.type == "no-data-to-recover") {
            chrome.notifications.create(null, {
                type: 'basic',
                iconUrl: 'popup/icon.png',
                title: 'FormVault',
                message: 'There is no data to recover for this form',
                priority: 2
            }, function (response) {
                console.log("Last error:", chrome.runtime.lastError);
                sendResponse();
            });
        }
        else if (request.type == "no-data") {
            chrome.notifications.create(null, {
                type: 'basic',
                iconUrl: 'popup/icon.png',
                title: 'FormVault',
                message: 'No Template Data to Save',
                priority: 2
            }, function (response) {
                console.log("Last error:", chrome.runtime.lastError);
                sendResponse();
            });
        }
        else if (request.type == "store-local") {
            chrome.storage.local.set(request.value, function () {
                sendResponse();
            });
        }
        sendResponse();
    }
);