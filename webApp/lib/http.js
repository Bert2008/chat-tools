/**
 * Created by Bert P Chen on 2017/3/24.
 */

(function (w) {
    function Http() {
        this.resolvedAll = false;
        this.deferrds = [];
        this.dataType={
                'common':'text/plain',
                'html':'text/HTML',
                'xml':'text/xml',
                'javascript':'text/javascript',
                'json':'application/json',
                'gif':'image/GIF',
                'jpeg':'image/JPEG'
        }
        this.defaultHeader = {
            'Accept': 'application/json',
            'Content-Type': this.dataType['json']+'; charset=UTF-8',
            'Cache-Control': 'no-cache'
        }
    }

    function Deferrd() {
        this.successFn = function () {
        };
        this.errorFn = function () {
        };
        this.finallyFn = function () {
        };
    };

    Deferrd.prototype = {
        setSuccessFn: function (fn) {
            this.successFn = fn;
        },
        getSuccessFn: function () {
            return this.successFn
        },
        setErrorFn: function (fn) {
            this.errorFn = fn;
        },
        getErrorFn: function () {
            return this.errorFn
        },
        resolve: function (data) {
            this.successFn(data);
            this.finallyFn(data);
        },
        reject: function () {
            this.errorFn(data);
            this.finallyFn(data);
        },
        then: function (successFn, errorFn) {
            this.successFn = successFn;
            this.errorFn = errorFn;
        },
        finally: function (finallyFn) {
            this.finallyFn = finallyFn;
        },
        done: function (successFn) {
            this.successFn = successFn;

        },
        fail: function (errorFn) {
            this.errorFn = errorFn;
        }
    };

    function getXMLHttpRequest() {
        try {
            return new XMLHttpRequest();
        } catch (trymicrosoft) {
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (othermicrosoft) {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                } catch (failed) {
                    console.err('"Error initializing XMLHttpRequest!"')
                }
            }
        }
    };

    Http.prototype = {
        _request: function (options) {
            var _this = this, index;
            _this.deferrds.push(new Deferrd());
            index = _this.deferrds.length-1;
            if (options.header) _this.defaultHeader = options.header;

            var xmlHttpRequest = getXMLHttpRequest(),
                async = options.async || true;
            xmlHttpRequest.open(options.type.toLowerCase(), options.url, options.async || true);

            for (var headName in _this.defaultHeader) {
                xmlHttpRequest.setRequestHeader(headName, _this.defaultHeader[headName]);
            }

            xmlHttpRequest.send(JSON.stringify(options.data));
            xmlHttpRequest.onreadystatechange = function () {
                if (xmlHttpRequest.readyState == 4) {
                    if (xmlHttpRequest.status == 200) {
                        if (options.successFn) options.successFn(xmlHttpRequest.responseText);

                        _this.deferrds[index].resolve(xmlHttpRequest.responseText);
                        _this.deferrds.pop();
                    } else {
                        if (options.errorFn) options.errorFn(xmlHttpRequest.responseText);

                        _this.deferrds[index].reject(xmlHttpRequest.responseText);
                        _this.deferrds.pop();
                    }
                }
            }
            return _this.deferrds[index];
        },
        when: function (callBack) {
            _this.deferrds.length===0?callBack():'';
        }
    };

    w.deferrd =function(){return new Deferrd} ;
    w.http =function(){return new Http} ;
})(this)