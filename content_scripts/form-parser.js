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
        obj[attr]['value'] = '';
      }
    })
  });
}

var createFormObj = function (data) {
  var formObj = {}
  Object.keys(data).forEach(function(id) {
    var attMap = {};
    var name = data[id]['name'];
    attMap['class'] = $('#' + name).attr('class')
    attMap['value'] = data[id]['value']
    formObj[data[id]['name']] = attMap
  });
  removeUserInfo(formObj);
  return formObj;
}

FormParser.prototype.parse = function (url, markup) {
  if(url == undefined) {
    return
  }
  var data = this.$form.serializeArray();
  var formObj = createFormObj(data);
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
  var formObj = createFormObj(data);
  var urlObj = {};
  urlObj[url + '-template'] = formObj;
  chrome.storage.sync.set(urlObj, function() {
    chrome.storage.sync.get(url + '-template', function(items) {
      console.log("Saving template");
    });
  });
  return this.$form.serializeArray()
}

FormParser.prototype.fillForm = function(data) {
  if(data == null) {
    console.log("No saved data for this url.")
    return;
  }
  valueInputs = ["input[type='text']", 'select', 'textarea'];
  valueInputs.forEach(function(tag) {
    this.$form.find(tag).each(function (index, elem) {
      $(this).removeClass();
      $(this).addClass(data[$(this).attr('name')]['class'])
      $(this).val(data[$(this).attr('name')]['value']);
    });
  });
  this.$form.find('input:radio').each(function (index, elem) {
    if(elem.name in data & elem.value == data[elem.name]['value']) {
      $(this).prop('checked', true)
    }
  });
  this.$form.find('input:checkbox').each(function (index, elem) {
    if(elem.name in data & elem.value == data[elem.name]['value']) {
      $(this).prop('checked', true)
    }
    else {
      $(this).prop('checked', false)
    }
  });
}

