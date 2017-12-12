/*
DataStack is an implementation of a stack which pushes and pops form data from chrome storage.
- Auto-save data will be stored as a stack at the 'auto-save' key in the form object
- Example storage depiction: 'url' -> 'auto-save' -> [example_data1, example_data2,...]
*/
function DataStack() {
    this.pushData = function(url, formObj){
        stack = this;
        chrome.storage.local.get(url, function(items) {
            data = items[url]
            if(data == undefined){
                data = {}
                data['auto-save'] = []
            }
            data['auto-save'].push(formObj)
            var dataObj = {};
            dataObj[url] = data
            chrome.storage.local.set(dataObj, function() {
            });
        });
    }
    this.getData = function(url, callback) {
        chrome.storage.local.get(url, function(items) {
            data = items[url]
            if(data == undefined) {
                console.log("Undefined")
                return null
            }
            var data_len = data['auto-save'].length;
            if(data_len == 0) {
                return null
            }
            var output = data['auto-save'].pop();
            chrome.storage.local.set(items, function() {
            });
            callback(output)
        });
    }
};
