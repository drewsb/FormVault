var URLParser = function (url) {
  this.url= url;
};

URLParser.prototype.removeFragment = function() {
  var index = this.url.indexOf('#')
  if(index == -1){
  	return this.url
  }
  this.url = this.url.substring(0, this.url.indexOf('#'));
  console.log(this.url)
  return this.url;
}