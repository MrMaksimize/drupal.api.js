// The drupal namespace.
var drupal = drupal || {};

drupal.tools = /*jQuery ||*/ {
  type: function( obj ) {
    return obj == null ?
      String( obj ) :
      class2type[ toString.call(obj) ] || "object";
  },
  isFunction: function(obj) {
    return drupal.tools.type(obj) === "function";
  },
  extend: function() {
    var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;
    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }
    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
      target = {};
    }
    // extend jQuery itself if only one argument is passed
    if ( length === i ) {
      target = this;
      --i;
    }
    for ( ; i < length; i++ ) {
      // Only deal with non-null/undefined values
      if ( (options = arguments[ i ]) != null ) {
        // Extend the base object
        for ( name in options ) {
          src = target[ name ];
          copy = options[ name ];
          // Prevent never-ending loop
          if ( target === copy ) {
            continue;
          }
          // Recurse if we're merging plain objects or arrays
          if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
            if ( copyIsArray ) {
              copyIsArray = false;
              clone = src && jQuery.isArray(src) ? src : [];
            }
            else {
              clone = src && jQuery.isPlainObject(src) ? src : {};
            }
            // Never move original objects, clone them
            target[ name ] = jQuery.extend( deep, clone, copy );

            // Don't bring in undefined values
          }
          else if ( copy !== undefined ) {
            target[ name ] = copy;
          }
        }
      }
    }
    // Return the modified object
    return target;
  },
  param: function(a, traditional) {
    var s = [],
      add = function( key, value ) {
        // If value is a function, invoke it and return its value
        value = jQuery.isFunction( value ) ? value() : value;
        s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
      };

    // Set traditional to true for jQuery <= 1.3.2 behavior.
    if ( traditional === undefined ) {
      traditional = jQuery.ajaxSettings.traditional;
    }

    // If an array was passed in, assume that it is an array of form elements.
    if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
      // Serialize the form elements
      jQuery.each( a, function() {
        add( this.name, this.value );
      });

    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for ( var prefix in a ) {
        buildParams( prefix, a[ prefix ], traditional, add );
      }
    }

    // Return the resulting serialization
    return s.join( "&" ).replace( r20, "+" );
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