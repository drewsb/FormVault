/*
Form Parser is a class with various functions used to save and restore form data.
Stores form selector and a DataStack instance as field variables
*/
var FormParser = function ($form) {
  this.$form = $form;
  this.dataStack = new DataStack();
  this.templateService = new TemplateService();
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
    attMap['class'] = $('input[name="' + name + '"]').attr('class');
    attMap['value'] = data[id]['value'];
    formObj[data[id]['name']] = attMap;
  });
  removeUserInfo(formObj);
  return formObj;
};

FormParser.prototype.parse = function (url) {
  if (url == undefined) {
    return;
  }
  var data = this.$form.serializeArray();
  var formObj = createFormObj(data);
  return this.dataStack.pushData(url, formObj);
};

FormParser.prototype.restore = function (url, callback) {
  if (url == undefined) {
    console.warn('Invalid URL.');
    callback(false);
    return;
  }
  this.dataStack.getData(url, function (data) {
    if (data == null || data == undefined || data.length == 0) {
      callback(false);
      return;
    }
    else {
      parser.fillForm(data);
      callback(true);
      return;
    }
  });
};

FormParser.prototype.initializeTemplate = function (url, domain) {
  if (url == undefined) {
    console.warn('Invalid url');
    return;
  }
  console.log(url);
  var parser = this;
  this.templateService.getTemplateData(url, domain, function (data) {
    parser.fillForm(data);
  });
};

// Save template form data to the site's url concatenated with '-template'.
// Allows for quicker data retrieval
FormParser.prototype.saveTemplate = function (url, domain) {
  if (url == undefined) {
    console.warn('Invalid url');
    return;
  }
  var data = this.$form.serializeArray();
  console.log(data);
  console.log(this.$form);
  if(data.length == 0) {
    chrome.runtime.sendMessage({type: "no-data", id: url}, () => {});
    return;
  }
  var formObj = createFormObj(data);
  var urlObj = {};
  urlObj[url + '-template'] = formObj;
  var domainObj = {};
  domainObj[domain + '-domain'] = formObj;
  chrome.storage.sync.set(urlObj, function () {
    if (chrome.runtime.lastError) {
      console.warn(chrome.runtime.lastError);
      alert('Error: ' + chrome.runtime.lastError.message);
    }
  });
  chrome.storage.sync.set(domainObj, function () {
    if (chrome.runtime.lastError) {
      console.warn(chrome.runtime.lastError);
      alert('Error: ' + chrome.runtime.lastError.message);
    }
  });
  return data;
};

// Fills form by setting input tags to their correct values
// Currently works for text, radio buttons, checkboxes, select dropdowns, and text areas
FormParser.prototype.fillForm = function (data) {
  if (data == null) {
    console.log('No saved data for this url.');
    return;
  }
  var valueInputs = ["input[type='text']","input[type='email']", 'select', 'textarea'];
  var formToFill = this.$form;
  valueInputs.forEach(function (tag) {
    formToFill.find(tag).each(function (index, elem) {
      if ($(this).attr('name') in data) {
        $(this).removeClass();
        $(this).addClass(data[$(this).attr('name')]['class']);
        $(this).val(data[$(this).attr('name')]['value']);
      }
    });
  });
  formToFill.find('input:radio').each(function (index, elem) {
    if (elem.name in data && elem.value == data[elem.name]['value']) {
      $(this).prop('checked', true);
    }
  });
  formToFill.find('input:checkbox').each(function (index, elem) {
    if (elem.name in data && elem.value == data[elem.name]['value']) {
      $(this).prop('checked', true);
    } else {
      $(this).prop('checked', false);
    }
  });
};

