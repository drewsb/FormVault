/*
Form Parser is a class with various functions used to save and restore form data.
Stores form selector and Data Stack as field variables
*/
var FormParser = function ($form) {
  this.$form = $form;
  this.dataStack = new DataStack();
};

// Removes elements with the password attribute
var removeUserInfo = function (obj) {
  var possibleTokens = ['pass', 'pswd', 'pswrd'];
  Object.keys(obj).forEach(function (attr) {
    possibleTokens.forEach(function (tok) {
      if (attr.toLowerCase().includes(tok)) {
        obj[attr]['value'] = '';
      }
    });
  });
};

// Creates a mapping of element names to their values and classes within a form
var createFormObj = function (data) {
  var formObj = {};
  Object.keys(data).forEach(function (id) {
    var attMap = {};
    var name = data[id]['name'];
    attMap['class'] = $('#' + name).attr('class');
    attMap['value'] = data[id]['value'];
    formObj[data[id]['name']] = attMap;
  });
  removeUserInfo(formObj);
  return formObj;
};

FormParser.prototype.parse = function (url, markup) {
  if (url == undefined) {
    return;
  }
  var data = this.$form.serializeArray();
  var formObj = createFormObj(data);
  return this.dataStack.pushData(url, formObj);
};

FormParser.prototype.restore = function (url) {
  if (url == undefined) {
    console.log('Invalid URL.');
    return;
  }
  var parser = this;
  this.dataStack.getData(url, function (data) {
    parser.fillForm(data);
  });
};

FormParser.prototype.initializeTemplate = function (url) {
  if (url == undefined) {
    console.log('Invalid url');
    return;
  }
  var parser = this;
  chrome.storage.sync.get(url + '-template', function (items) {
    var item_len = Object.keys(items).length;
    if (items == undefined || item_len == 0) {
      console.log('No saved template for url.');
      return;
    }
    var data = items[url + '-template'];
    parser.fillForm(data);
  });
};

//Save template form data to the site's url concatenated with '-template'.
//Allows for quicker data retrieval
FormParser.prototype.saveTemplate = function (url) {
  if (url == undefined) {
    console.log('Invalid url');
    return;
  }
  var data = this.$form.serializeArray();
  var formObj = createFormObj(data);
  var urlObj = {};
  urlObj[url + '-template'] = formObj;
  chrome.storage.sync.set(urlObj, function () {
    chrome.storage.sync.get(url + '-template', function (items) {
      console.log('Saving template');
    });
  });
  return this.$form.serializeArray();
};

// Fills form by setting input tags to their correct values
// Currently works for text, radio buttons, checkboxes, select dropdowns, and text areas
FormParser.prototype.fillForm = function (data) {
  if (data == null) {
    console.log('No saved data for this url.');
    return;
  }
  var valueInputs = ["input[type='text']", 'select', 'textarea'];
  valueInputs.forEach(function (tag) {
    this.$form.find(tag).each(function (index, elem) {
      $(this).removeClass();
      $(this).addClass(data[$(this).attr('name')]['class']);
      $(this).val(data[$(this).attr('name')]['value']);
    });
  });
  this.$form.find('input:radio').each(function (index, elem) {
    if (elem.name in data && elem.value == data[elem.name]['value']) {
      $(this).prop('checked', true);
    }
  });
  this.$form.find('input:checkbox').each(function (index, elem) {
    if (elem.name in data && elem.value == data[elem.name]['value']) {
      $(this).prop('checked', true);
    } else {
      $(this).prop('checked', false);
    }
  });
};

