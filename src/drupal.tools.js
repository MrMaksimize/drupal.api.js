// The drupal namespace.
var drupal = drupal || {};

drupal.tools = /*jQuery ||*/ {
  extend: function() {

  },
  param: function() {

  },
  ajax: function(request) {
    console.log(request);
    //initialize request object
    x1 = new XMLHttpRequest();
    console.log(x1);
    //x1.responseType = request.dataType;
    x1.onreadystatechange = function(){
      if (x1.readyState == 4){
        request.success(JSON.parse(x1.responseText), x1.statusText);
      }
    }
    x1.onerror = function(){
      request.error(x1, null, null);
    }
    x1.open(request.type, request.url, true);
    x1.setRequestHeader("Content-type","application/" + request.dataType);
    x1.setRequestHeader("Accept", "application/" + request.dataType);
    if (request['data']){
      x1.send(JSON.stringify(request['data']));
    }
    else{
      x1.send();
    }
  }
};

//@todo - json stringification and parsing needs to be defined here because some browsers don't support it.
//how to do this  - http://www.sitepoint.com/javascript-json-serialization/
//@todo - if browser x-testing fails, look at using this - https://github.com/ilinsky/xmlhttprequest