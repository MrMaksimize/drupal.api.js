// The drupal namespace.
var drupal = drupal || {};

drupal.tools = jQuery || {
  type: function( obj ) {
    // Populate the class2type map
  var class2type = {};
  var result;
  drupal.tools.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
  });
  if (obj == null){
    result = String( obj );
  }
  else{
    result = class2type[ toString.call(obj) ] || "object";
  }
  /*return obj == null ?
    String( obj ) :
    class2type[ toString.call(obj) ] || "object";*/
  },
  isFunction: function(obj) {
    return drupal.tools.type(obj) === "function";
  },
  isArray: function( obj ) {
    return drupal.tools.type(obj) === "array";
  },
  isPlainObject: function( obj ) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
      return false;
    }
    try {
      // Not own constructor property must be Object
      if ( obj.constructor &&
        !hasOwn.call(obj, "constructor") &&
        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
      }
    } catch ( e ) {
      // IE8,9 Will throw exceptions on certain host objects #9897
      return false;
    }
    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    var key;
    for ( key in obj ) {}
    return key === undefined || hasOwn.call( obj, key );
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
    if ( typeof target !== "object" && !drupal.tools.isFunction(target) ) {
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
          if ( deep && copy && ( drupal.tools.isPlainObject(copy) || (copyIsArray = drupal.tools.isArray(copy)) ) ) {
            if ( copyIsArray ) {
              copyIsArray = false;
              clone = src && drupal.tools.isArray(src) ? src : [];
            }
            else {
              clone = src && drupal.tools.isPlainObject(src) ? src : {};
            }
            // Never move original objects, clone them
            target[ name ] = drupal.tools.extend( deep, clone, copy );

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
  each: function( object, callback, args ) {
    var name, i = 0,
      length = object.length,
      isObj = length === undefined || jQuery.isFunction( object );
    if ( args ) {
      if ( isObj ) {
        for ( name in object ) {
          if ( callback.apply( object[ name ], args ) === false ) {
            break;
          }
        }
      } else {
        for ( ; i < length; ) {
          if ( callback.apply( object[ i++ ], args ) === false ) {
            break;
          }
        }
      }
    // A special, fast, case for the most common use of each
    } else {
      if ( isObj ) {
        for ( name in object ) {
          if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
            break;
          }
        }
      } else {
        for ( ; i < length; ) {
          if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
            break;
          }
        }
      }
    }
    return object;
  },
  buildParams: function( prefix, obj, traditional, add ) {
  if ( drupal.tools.isArray( obj ) ) {
    // Serialize array item.
    drupal.tools.each( obj, function( i, v ) {
      if ( traditional || rbracket.test( prefix ) ) {
        // Treat each array item as a scalar.
        add( prefix, v );
      }
      else {
        // If array item is non-scalar (array or object), encode its
        // numeric index to resolve deserialization ambiguity issues.
        // Note that rack (as of 1.0.0) can't currently deserialize
        // nested arrays properly, and attempting to do so may cause
        // a server error. Possible fixes are to modify rack's
        // deserialization algorithm or to provide an option or flag
        // to force array serialization to be shallow.
        drupal.tools.buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
      }
    });
  }
  else if ( !traditional && obj != null && typeof obj === "object" ) {
    // Serialize object item.
    for ( var name in obj ) {
      drupal.tools.buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
    }
  }
  else {
    // Serialize scalar item.
    add( prefix, obj );
  }
},
  param: function(a, traditional) {
    var s = [],
      add = function( key, value ) {
        // If value is a function, invoke it and return its value
        value = drupal.tools.isFunction( value ) ? value() : value;
        s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
      };

    // Set traditional to true for jQuery <= 1.3.2 behavior.
    /*if ( traditional === undefined ) {
      traditional = jQuery.ajaxSettings.traditional;
    }*/

    // If an array was passed in, assume that it is an array of form elements.
    if ( drupal.tools.isArray( a ) || ( a.jquery && !drupal.tools.isPlainObject( a ) ) ) {
      // Serialize the form elements
      drupal.tools.each( a, function() {
        add( drupal.tools.name, drupal.tools.value );
      });

    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for ( var prefix in a ) {
        drupal.tools.buildParams( prefix, a[ prefix ], traditional, add );
      }
    }

    // Return the resulting serialization
    var r20 = /%20/g;
    return s.join( "&" ).replace( r20, "+" );
  },
  ajax: function(request) {
    //initialize request object
    x1 = new XMLHttpRequest();
    x1.onreadystatechange = function(){
      if (x1.readyState == 4){
        if (x1.status == 200){
          request.success(JSON.parse(x1.responseText), x1.statusText);
        }
        else{
          request.error(x1, 'error', x1.statusText);
        }
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