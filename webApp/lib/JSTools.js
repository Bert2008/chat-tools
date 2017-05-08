/**
 * Created by Bert P Chen on 2017/3/25.
 */
(function(w){
    /*
     * clone object function
     * @param paramters is cloned
     * @returns {new object}
     */

// Save a reference to some core methods
    var  slice             = [].slice,
        splice            = [].splice,
        push              = [].push,
        toString          = Object.prototype.toString,
        getPrototypeOf    = Object.getPrototypeOf;
    function isWindow(obj){
        return obj === obj.window;
    }
    function type(obj){
        if ( obj == null ) {
            return String( obj );
        }
        return typeof obj === "object" || typeof obj === "function" ?
            toString.call(obj)  || "object" :
            typeof obj;
    }
    function isFunction(obj){
        return type(obj)==='function';
    }
    function isArray(obj){
        return type(obj)==='array';
    }
    function isDate(value) {
        return toString.call(value) === '[object Date]';
    }
    function isPlainObject ( obj ) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if ( !obj || type(obj) !== "object" || obj.nodeType || isWindow( obj ) ) {
            return false;
        }

        try {
            // Not own constructor property must be Object
            if ( obj.constructor &&
                !core_hasOwn.call(obj, "constructor") &&
                !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
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

        return key === undefined || core_hasOwn.call( obj, key );
    };
    function isEmptyObject ( obj ) {
        var name;
        for ( name in obj ) {
            return false;
        }
        return true;
    };
    function isPlainObject( obj ) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if ( !obj || type(obj) !== "object" || obj.nodeType || isWindow( obj ) ) {
            return false;
        }

        try {
            // Not own constructor property must be Object
            if ( obj.constructor &&
                !core_hasOwn.call(obj, "constructor") &&
                !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
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

        return key === undefined || core_hasOwn.call( obj, key );
    };
    var clone = function (paramters) {
        var cloneParamters;
        if (paramters === null)return null;
        if (paramters instanceof Array) {
            cloneParamters = [];
            paramters.forEach(function (item) {
                cloneParamters.push(clone(item))
            });
            return cloneParamters;
        }
        if (paramters instanceof Date) {
            cloneParamters = new Date(paramters.toString());
            return cloneParamters;
        }
        if (paramters instanceof RegExp) {
            cloneParamters = new RegExp(paramters.toString());
            return cloneParamters;
        }
        if (typeof paramters === 'function') {
            cloneParamters = eval(paramters.toString());
            return cloneParamters;
        }
        if (typeof paramters === 'Object') {
            cloneParamters = {};
            for (var itemName in paramters) {
                cloneParamters[itemName] = clone(paramters[itemName]);
            }
            return cloneParamters;
        } else {
            cloneParamters = paramters;
            return cloneParamters;
        }
    }
    var extend = function () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        if(typeof arguments[0] === 'boolen'){
            deep = arguments[0];
            target = arguments[1];
            i=2;
        }
        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && isFunction(target) ) {
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
                    if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = isArray(copy)))){
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = extend( deep, clone, copy );

                        // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    }
    function equals(o1, o2) {
        if (o1 === o2) return true;
        if (o1 === null || o2 === null) return false;
        // eslint-disable-next-line no-self-compare
        if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
        var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
        if (t1 === t2 && t1 === 'object') {
            if (isArray(o1)) {
                if (!isArray(o2)) return false;
                if ((length = o1.length) === o2.length) {
                    for (key = 0; key < length; key++) {
                        if (!equals(o1[key], o2[key])) return false;
                    }
                    return true;
                }
            } else if (isDate(o1)) {
                if (!isDate(o2)) return false;
                return equals(o1.getTime(), o2.getTime());
            } else if (isRegExp(o1)) {
                if (!isRegExp(o2)) return false;
                return o1.toString() === o2.toString();
            } else {
                if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) ||
                    isArray(o2) || isDate(o2) || isRegExp(o2)) return false;
                keySet = createMap();
                for (key in o1) {
                    if (key.charAt(0) === '$' || isFunction(o1[key])) continue;
                    if (!equals(o1[key], o2[key])) return false;
                    keySet[key] = true;
                }
                for (key in o2) {
                    if (!(key in keySet) &&
                        key.charAt(0) !== '$' &&
                        isDefined(o2[key]) &&
                        !isFunction(o2[key])) return false;
                }
                return true;
            }
        }
        return false;
    }
    function baseExtend(dst, objs, deep) {
        for (var i = 0, ii = objs.length; i < ii; ++i) {
            var obj = objs[i];
            if (!isObject(obj) && !isFunction(obj)) continue;
            var keys = Object.keys(obj);
            for (var j = 0, jj = keys.length; j < jj; j++) {
                var key = keys[j];
                var src = obj[key];

                if (deep && isObject(src)) {
                    if (isDate(src)) {
                        dst[key] = new Date(src.valueOf());
                    } else if (isRegExp(src)) {
                        dst[key] = new RegExp(src);
                    } else if (src.nodeName) {
                        dst[key] = src.cloneNode(true);
                    } else if (isElement(src)) {
                        dst[key] = src.clone();
                    } else {
                        if (!isObject(dst[key])) dst[key] = isArray(src) ? [] : {};
                        baseExtend(dst[key], [src], true);
                    }
                } else {
                    dst[key] = src;
                }
            }
        }
        return dst;
    }
    function isElement(node) {
        return !!(node &&
        (node.nodeName  // We are a direct element.
        || (node.prop && node.attr && node.find)));  // We have an on and find method part of jQuery API.
    }
    function isObject(value) {
        // http://jsperf.com/isobject4
        return value !== null && typeof value === 'object';
    }
})(window)