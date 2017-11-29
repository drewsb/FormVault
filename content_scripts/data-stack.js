/*
    Not being used yet.
*/

var DataStack = (function(){
    var setData = function(key,obj){
        var values = JSON.stringify(obj);
        chrome.storage.sync.setItem(key,values);
    }

    var getData = function(key){
        if(chrome.storage.synx.getItem(key) != null){
        return JSON.parse(chrome.storage.sync.getItem(key));
        } else{
            return false;
        }
    }

    var updateData = function(key,newData){
        if(chrome.storage.sync.getItem(key) != null){
            var oldData = JSON.parse(chrome.storage.sync.getItem(key));
            for(keyObj in newData){
                oldData[keyObj] = newData[keyObj];
            }
            var values = JSON.stringify(oldData);
            chrome.storage.sync.setItem(key,values);
        } else{
            return false;
        }
    }

    return {set:setData,get:getData,update:updateData}
})();
