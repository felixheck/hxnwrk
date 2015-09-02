/********************************
 hxnwrk.js
 version :  0.8
 author  :  Felix Heck
 ********************************/

!function (window, document) {
    var hxnwrk = window.hxnwrk = window.$ = {

        // create wrapper object
        wrap: function (nodes, base) {
            if (base == undefined)
                base = document;
            else
                base = base[0];

            if (typeof nodes == 'string')
                nodes = base.querySelectorAll(nodes);

            if (!nodes.length)
                nodes = [nodes];

            var wrapper = Object.create(hxnwrk.fn);

            for (var i = 0; i < nodes.length; i++)
                wrapper[i] = nodes[i];

            wrapper.length = nodes.length;
            return wrapper;
        },

        // cross-browser prevent default
        preventDefault: function (event) {
            if (event.preventDefault)
                event.preventDefault();
            else
                event.returnValue = false;
        },

        // check if array contains item
        indexOf: function (item, array) {
            for (var i = 0; i < array.length; i++)
                if (array[i] === item)
                    return i;
            return -1;
        },

        // iterate through objects, arrays and array-likes
        each: function (obj, fn) {
            if (hxnwrk.obj.isArrayLike(obj)) {
                for (var key in obj)
                    if (obj.hasOwnProperty(key))
                        fn.call(this, obj[key], key, obj);
                return obj;
            }

            for (var i = 0, l = obj.length; i < l; i++)
                fn.call(this, obj[i], i, obj)
            return obj;
        },

        // get cross-browser viewport dimensions
        viewPortSize: function () {
            var e = document.documentElement;
            var g = document.getElementsByTagName('body')[0];

            return {
                width: window.innerWidth || e.clientWidth || g.clientWidth,
                height: window.innerHeight || e.clientHeight || g.clientHeight
            };
        },

        // get cross-browser document dimensions
        documentSize: function () {
            return {
                width: Math.max(
                    document.body.scrollWidth, document.documentElement.scrollWidth,
                    document.body.offsetWidth, document.documentElement.offsetWidth,
                    document.body.clientWidth, document.documentElement.clientWidth),
                height: Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight)
            };
        },

        // get cross-browser scroll position - horizontal
        scrollLeft: function () {
            return window.pageXOffset ||
                    document.body.scrollLeft ||
                    document.documentElement.scrollLeft || 0;
        },

        // get cross-browser scroll position - vertical
        scrollTop: function () {
            return window.pageYOffset ||
                    document.body.scrollTop||
                    document.documentElement.scrollTop || 0;
        },

        // check if document ready
        ready: function (callback) {
            document.addEventListener('DOMContentLoaded', callback, false);

            return this;
        },

        // check if entire DOM loaded
        loaded: function (callback) {
            window.addEventListener('load', callback, false);

            return this;
        },

        // check if window get resized
        resize: function (callback) {
            window.addEventListener('resize', callback, false);

            return this;
        },

        // check if window orientation changed
        flip: function (callback) {
            window.addEventListener('orientationchange', callback, false);

            return this;
        },

        // check if window get scrolled
        scroll: function (callback) {
            window.addEventListener('scroll', callback, false);

            return this;
        },

        // return object in css string
        cssRuler: function(selector, rules, override) {
            var cssString = '';
            var overrideRule = override ? ' !important' : '';

            for(var property in rules)
                if(rules.hasOwnProperty(property))
                    cssString += property + ': ' + rules[property] + overrideRule + ';';
            return selector + '{' + cssString + '}';
        },

        // wrapper properties & methods
        fn: {
            // iterate over a wrapper
            each: function (fn) {
                return hxnwrk.each(this, fn);
            },

            // add class to all items of wrapper
            addClass: function (className) {
                return this.each(function (element) {
                    if (clean(element.className).indexOf(className) > -1)
                        return;
                    element.className = clean(element.className + ' ' + className);
                })
            },

            // remove class of all items in wrapper
            removeClass: function (className) {
                return this.each(function (element) {
                    element.className = element.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
                })
            },

            // check if element has class
            hasClass: function (className) {
                var regex = new RegExp('(^| )' + className + '( |$)', 'gi').test(this[0].className);
                return this[0].classList ? this[0].classList.contains(className): regex;
            },

            // toggle class of all items in wrapper
            toggleClass: function (className) {
                return this.each(function (element, b, c) {
                    if (self.hasClass(className))
                        return c.removeClass(className);
                    return c.addClass(className);
                })
            },

            // get or set inner html of wrap
            html: function (html) {
                return arguments.length === 0 ?
                    (this.length > 0 ? this[0].innerHTML : null) :
                    this.each(function (element) {
                        element.innerHTML = html;
                    });
            },

            // get height of wrap
            height: function () {
                return this[0].offsetHeight;
            },

            // get width of wrap
            width: function () {
                return this[0].offsetWidth;
            },

            // get top offset of wrap
            top: function () {
                return this[0].offsetTop;
            },

            // get left offset of wrap
            left: function () {
                return this[0].offsetLeft;
            },

            // set or get a css value
            css: function (property, value) {
                if (arguments.length === 1 && !hxnwrk.obj.isArrayLike(property)) {
                    property = lowerCamelize(property);
                    return (this.length > 0 ? this[0].style[property] : null);
                }
                else if (arguments.length === 1 && hxnwrk.obj.isObject(property))
                    return this.each(function (element) {
                        for (var key in property) {
                            if (property.hasOwnProperty(key)) {
                                key = lowerCamelize(key);
                                element.style[key] = property[key];
                            }
                        }
                    });
                else {
                    return this.each(function (element) {
                        property = lowerCamelize(property);
                        element.style[property] = value;
                    });
                }
            },

            // hide a wrap
            hide: function () {
                return this.each(function (element) {
                    element.style.display = 'none';
                });
            },

            // show a wrap
            show: function (value) {
                value = arguments.length === 0 ? '' : value;
                return this.each(function (element) {
                    element.style.display = value;
                });
            },

            // toggle the visibility of wrap
            toggle: function (value) {
                return this.each(function (element, b, c) {
                    if (c.css('display') == 'none')
                        return c.show(value);
                    return c.hide();
                })
            },

            // set or get an attribute
            attr: function (name, value) {
                return arguments.length === 1 ?
                    (this.length > 0 ? this[0].getAttribute(name) : null) :
                    this.each(function (element) {
                        element.setAttribute(name, value);
                    });
            },

            // remove attribute
            removeAttr: function (name) {
                return this.each(function (element) {
                        element.removeAttribute(name);
                    });
            },

            // change checked property of wrap
            checked: function (value) {
                return arguments.length === 0 ?
                    (this.length > 0 ? this[0].checked : null) :
                    this.each(function (element) {
                        element.checked = value
                    });
            },

            // set or get data attribute
            data: function(name, value) {
                if(value != undefined)
                    return this.attr('data-' + name, value);
                else
                    return this.attr('data-' + name);
            },

            // scroll to element in 'href'
            scrollTo: function (duration, easing) {
                var target = this[0].getAttribute('href');
                var to = target == '#' ? 0 : hxnwrk.wrap(target).top();
                var doc = hxnwrk.userAgent.is('firefox|opera|msie') ? document.documentElement : document.body;
                var start = doc.scrollTop;
                var change = to - start;
                var currentTime = 0;
                var tick = 20;

                if (typeof duration === 'undefined')
                    duration = 500;

                if (typeof easing === 'undefined')
                    easing = hxnwrk.math.linear;
                else
                    easing = hxnwrk.math[lowerCamelize(easing)];

                var animateScroll = function () {
                    currentTime += tick;
                    doc.scrollTop = Math.round(easing(currentTime, start, change, duration));

                    if (currentTime < duration)
                        requestAnimationFrame(animateScroll);
                };
                animateScroll();

                return this;
            },

            // fade wrap in
            fadeIn: function(duration, easing) {
                return fade(this, 0, 1, duration, easing);
            },

            // fade wrap out
            fadeOut: function(duration, easing) {
                return fade(this, 1, 0, duration, easing);
            },

            // attach click event
            on: function(type, callback) {
                return this.each(function (element) {
                    element.addEventListener(type, callback);
                });
            },

            // detach click event
            off: function(type, callback) {
                return this.each(function (element) {
                    element.removeEventListener(type, callback);
                });
            },

            // add DOM element before wrap
            before: function(html) {
                return this[0].insertAdjacentHTML('beforebegin', html);
            },

            // add DOM element after wrap
            after: function(html) {
                return this[0].insertAdjacentHTML('afterend', html);
            },

            // add DOM element at the begin of wrap
            prepend: function(html) {
                return this[0].insertAdjacentHTML('afterbegin', html);
            },

            // add DOM element at the end of wrap
            append: function(html) {
                if(hxnwrk.obj.isObject(html))
                    html = html.outerHTML;
                return this[0].insertAdjacentHTML('beforeend', html);
            }
        },

        // json
        JSON: {
            // parse string to json object
            parse: function (json) {
                if (typeof json != 'string')
                    return;

                var trimRE = /^\s+|\s+$/g,
                    JSON = window.JSON;

                json = json.replace(trimRE, '');

                var isValid = this.validate(json);

                if (!isValid)
                    throw 'invalid JSON';

                return JSON && JSON.parse ? JSON.parse(json) : !function () {
                    return json;
                };
            },
            // validate a string for json
            validate: function (json) {
                var validateRE = /^[\],:{}\s]*$/,
                    replacementRE_1 = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                    replacementRE_2 = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                    replacementRE_3 = /(?:^|:|,)(?:\s*\[)+/g;

                var replacedJSON = json.replace(replacementRE_1, '@');
                replacedJSON = replacedJSON.replace(replacementRE_2, ']');
                replacedJSON = replacedJSON.replace(replacementRE_3, '');


                return validateRE.test(replacedJSON);
            }
        },

        // get information about the data type of the passed object
        obj: {
            isFunction: function (obj) {
                return type(obj) == 'function';
            },
            isObject: function (obj) {
                return type(obj) == "Object" || type(obj).substring(0, 4) == 'html' || type(obj) == "object"
            },
            isString: function (obj) {
                return type(obj) == 'string';
            },
            isUndefined: function (obj) {
                return typeof obj == 'undefined';
            },
            isArray: function (obj) {
                return type(obj) == 'array' || obj instanceof Array;
            },
            isArrayLike: function (obj) {
                return obj.length === void 0;
            }
        },

        // get information about user agent
        userAgent: {
            data: navigator.userAgent,
            mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,
            ios: /iPad|iPhone|iPod/i,

            get: function () {
                return this.data;
            },

            is: function (obj) {
                var pattern;
                if (this.hasOwnProperty(obj))
                    pattern = hxnwrk.userAgent[obj.toLowerCase()];
                else
                    pattern = new RegExp(obj, 'i');

                return pattern.test(this.data);
            }
        },

        // get and set cookies by name
        cookie: {
            set: function (name, value, days) {
                if (hxnwrk.obj.isUndefined(days))
                    days = 30;
                var expiry = expiryDate(days);
                document.cookie = name + '=' + encodeURI(value) + '; path=/; expires=' + expiry.toGMTString();
            },

            // get cookie by name
            get: function (name) {
                var re = new RegExp(name + "=([^;]+)");
                var value = re.exec(document.cookie);
                return (value !== null) ? decodeURI(value[1]) : null;
            }
        },

        math: {
            easeInOut: function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) {
                    return c / 2 * t * t + b;
                }
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            },

            easeIn: function (t, b, c, d) {
                var ts = (t /= d) * t;
                return b + c * (ts * ts);
            },

            easeOut: function (t, b, c, d) {
                var ts = (t /= d) * t;
                var tc = ts * t;
                return b + c * (-1 * ts * ts + 4 * tc + -6 * ts + 4 * t);
            },

            linear: function (t, b, c, d) {
                t /= d;
                return b + c * (t);
            }
        }
    };

    // private functions and variables
    // clean whitespaces of string
    function clean(str) {
        return str.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '')
    }

    // transform string to lower camelcase
    function lowerCamelize(str) {
        return str.replace(
            /-+(.)?/g,
            function (match, chr) {
                return chr ? chr.toUpperCase() : '';
            });
    }

    // get date for x days in future
    function expiryDate(days) {
        return new Date(today.getTime() + days * 24 * 3600 * 1000);
    }

    // get type of object
    function type(obj) {
        var class2type = {};
        var type = typePattern.exec(class2type.toString.call(obj));
        return type[0].toLowerCase();
    }

    // fading opcatiy
    function fade ($this, start, end, duration, easing) {
        $this.css({
            'opacity': start,
            'display': ''
        });

        var currentTime = 0;
        var tick = 20;
        var opacity = start;
        var change =  end - start;

        if (typeof duration === 'undefined')
            duration = 500;

        if (typeof easing === 'undefined')
            easing = hxnwrk.math.linear;
        else
            easing = hxnwrk.math[lowerCamelize(easing)];

        var animateFade = function () {
            currentTime += tick;
            opacity = easing(currentTime, start, change, duration).toFixed(2);
            $this.css('opacity', opacity);
            if (currentTime < duration) {
                requestAnimationFrame(animateFade);
            }
            else if (currentTime == duration && opacity == 0) {
                $this.css({display: 'none'});
            }
        };

        animateFade();
        return $this;
    }

	// current timestamp
	var today = new Date();
		
    // pattern to extract type of object
    var typePattern = /(?!\[object )(\w+)(?=\])/i;

    // cross browser animation frame
    var requestAnimationFrame = (function () {
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

}(window, document);
