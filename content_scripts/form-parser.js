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
    parser.fillForm(data)
  });
};

FormParser.prototype.initializeTemplate = function (url) {
  if(url == undefined) {
    console.log("Invalid url")
    return
  }
  parser = this;
  chrome.storage.sync.get(url + '-template', function(items) {
    var item_len = Object.keys(items).length;
    if(items == undefined || item_len == 0) {
      console.log("No saved template for url.")
      return
    }
    var data = items[url + '-template']
    parser.fillForm(data);
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

FormParser.prototype.fillForm = function(data) {
  if(data == null) {
    console.log("No saved data for this url.")
    return;
  }
  console.log(data)
  valueInputs = ["input[type='text']", 'select', 'textarea'];
  checkInputs = ["input:radio", 'input:checkbox'];

  valueInputs.forEach(function(tag) {
    this.$form.find(tag).val(function (index, value) {
      return data[$(this).attr('name')];
    });
  })
  this.$form.find('input:radio').each(function (index, elem) {
    console.log(elem)
    if(elem.name in data & elem.value == data[elem.name]) {
      $(this).prop('checked', true)
    }
  });
  this.$form.find('input:checkbox').each(function (index, elem) {
    console.log(elem)
    if(elem.name in data & elem.value == data[elem.name]) {
      $(this).prop('checked', true)
    }
    else {
      $(this).prop('checked', false)
    }
  });
}

