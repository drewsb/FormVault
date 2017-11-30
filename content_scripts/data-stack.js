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
                console.log("Updated data");
                console.log(dataObj)
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
                console.log("Popped data");
            });
            console.log(data)
            callback(output)
        });
    }
};
