/*
DataStack is an implementation of a stack which pushes and pops form data from chrome storage.
- Auto-save data will be stored as a stack at the 'auto-save' key in the form object
- Example storage depiction: 'url' -> 'auto-save' -> [example_data0, example_data1,...]
*/
function DataStack() {
  this.pushData = function (url, formObj) {
    var stack = this;
    chrome.storage.local.get(url, function (items) {
      var data = items[url];
      if (data == undefined) {
        data = {};
        data['auto-save'] = [];
      }
      data['auto-save'].push(formObj);
      var dataObj = {};
      dataObj[url] = data;
      chrome.storage.local.set(dataObj);
    });
  };
  this.getData = function (url, callback) {
    chrome.storage.local.get(url, function (items) {
      var data = items[url];
      if (data == undefined) {
        console.log('Data is undefined for this URL.');
        callback(null);
        return;
      }
      var data_len = data['auto-save'].length;
      if (data_len == 0) {
        callback(null);
        return;
      }
      var output = data['auto-save'].pop();
      chrome.storage.local.set(items);
      callback(output);
      return;
    });
  };
}
