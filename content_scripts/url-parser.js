/*
URLParser is a helper class with various functions to format URL's and extract info
*/

var URLParser = function (url) {
  this.url = url;
};

// Remove the fragment portion of URL (everything after the '#' character)
URLParser.prototype.removeFragment = function () {
  var index = this.url.indexOf('#');
  if (index == -1) {
    return this.url;
  }
  this.url = this.url.substring(0, this.url.indexOf('#'));
  return this.url;
};

// Remove the appended '-template' on a URL
URLParser.prototype.removeTemplate = function () {
  var index = this.url.indexOf('-template');
  if (index == -1) {
    return this.url;
  }
  this.url = this.url.substring(0, index);
  return this.url;
};

URLParser.prototype.extractHostname = function () {
  var hostname;
  if (this.url.indexOf('://') > -1) {
    hostname = this.url.split('/')[2];
  } else {
    hostname = this.url.split('/')[0];
  }

  // find & remove port number
  hostname = hostname.split(':')[0];
  // find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
};
