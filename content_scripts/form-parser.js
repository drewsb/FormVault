var FormParser = function ($form) {
  // Save the $form body as a state
  this.$form = $form;
  this.dataStack = new DataStack();
};

var removeUserInfo = function(obj) {
  var possibleTokens = ['pass', 'pswd', 'pswrd'];
  Object.keys(obj).forEach(function(attr) {
    possibleTokens.forEach(function (tok) {
      if(attr.toLowerCase().includes(tok)) {
        obj[attr] = '';
      }
    })
  });
}

FormParser.prototype.parse = function (url, markup) {
  if(url == undefined) {
    return
  }
  var data = this.$form.serializeArray();
  var formObj = {}
  Object.keys(data).forEach(function(id) {
    formObj[data[id]['name']] = data[id]['value']
  });
  removeUserInfo(formObj);
  return this.dataStack.pushData(url, formObj);
};

FormParser.prototype.restore = function (url) {
  if(url == undefined) {
    console.log("Invalid URL.")
    return
  }
  parser = this;
  this.dataStack.getData(url, function(data) {
    if(data == null) {
      console.log("No saved data for this url.")
      return;
    }
    parser.$form.find('input').val(function (index, value) {
      return data[$(this).attr('name')];
    });
    parser.$form.find('select').val(function (index, value) {
      return data[$(this).attr('name')];
    });
    parser.$form.find('textarea').val(function (index, value) {
      return data[$(this).attr('name')];
    });
  });
};

FormParser.prototype.initializeTemplate = function (url) {
  if(url == undefined) {
    console.log("Invalid url")
    return
  }
  parser = this;
  var data = chrome.storage.sync.get(url + '-template', function(items) {
    var item_len = Object.keys(items).length;
    if(items == undefined || item_len == 0) {
      console.log("No saved template for url.")
      return
    }
    console.log("Initializing template" + url);
    console.log(items)
    parser.$form.find('input').val(function (index, value) {
      console.log(this)
      return items[url + '-template'][$(this).attr('name')];
    });
    parser.$form.find('select').val(function (index, value) {
      return items[url + '-template'][$(this).attr('name')];
    });
  })
};

FormParser.prototype.saveTemplate = function(url) {
  if(url == undefined) {
    console.log("Invalid url")
    return
  }
  var data = this.$form.serializeArray();
  var formObj = {}
  Object.keys(data).forEach(function(id) {
    formObj[data[id]['name']] = data[id]['value']
  });
  removeUserInfo(formObj);
  var urlObj = {};
  urlObj[url + '-template'] = formObj;
  chrome.storage.sync.set(urlObj, function() {
    chrome.storage.sync.get(url + '-template', function(items) {
      console.log("Saving template");
      console.log(items)
    });
  });
  return this.$form.serializeArray()
}

