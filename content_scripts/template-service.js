/*
TemplateService provides read operations for template form data from chrome sync storage.
*/

function TemplateService() {

  // Retrieve all template form data for a specific url or domain.
  this.getTemplateData = function (url, domain, callback) {
    chrome.storage.sync.get(url + '-template', function (items) {
      var data;
      var item_len = Object.keys(items).length;
      if (items != undefined && item_len > 0) {
        data = items[url + '-template'];
        callback(data);
      } else {
        chrome.storage.sync.get(domain + '-domain', function (domain_items) {
          var item_len = Object.keys(domain_items).length;
          if (domain_items == undefined || item_len == 0) {
            console.warn('No saved template for url.');
          }
          data = domain_items[domain + '-domain'];
          callback(data);
        });
      }
    });
  };

  // Retrieve all template urls in chrome sync storage
  this.getTemplateUrls = function (callback) {
    chrome.storage.sync.get(null, function (items) {
      var allUrls = [];
      Object.keys(items).forEach(function (k) {
        if (k.indexOf('-domain') == -1) {
          allUrls.push(k);
        }
      });
      callback(allUrls);
    });
  };
}