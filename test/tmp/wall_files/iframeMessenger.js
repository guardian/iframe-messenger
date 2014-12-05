/**
 * iframe-messenger
 *
 * version: 0.2.6
 * source: https://github.com/GuardianInteractive/iframe-messenger
 *
 */

(function (global) {
    'use strict';

    var iframeMessenger = (function() {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var REFRESH_DELAY = 200;
        var MSG_ID_PREFIX = 'iframeMessenger';
        var _postMessageCallbacks = {};
        var _currentHeight = 0;
        var _images = [];
        var _options = {
            absoluteHeight: false
        };

        /**
         * Send message to parent page and store callback ref if needed.
         * @param {oject} message Message to send to parent page.
         * @param {function} callback (optional) Func. to call upon return msg.
         */
        function _postMessage(message, callback) {
            var id = genID();
            message.id = id;

            // Store callback ready for post message event lookup
            if (callback) {
                _postMessageCallbacks[id] = callback;
            }

            window.parent.postMessage(JSON.stringify(message), '*');
        }

        /**
         * Generate a unique ID string using known prefix and random chars.
         * @returns {string} unique ID
         */
        function genID() {
            // Rnd logic from http://stackoverflow.com/a/8084248
            var rnd = Math.random().toString(36).substr(2, 5);
            return MSG_ID_PREFIX + ':' + rnd;
        }

        /**
         * Check if inside an iframe
         * @return {bool}
         */
        function _inIframe() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        }


        /**
         * Navigate parent page to new URL.
         * @param  {string} url New URL location.
         */
        function navigate(url) {
            var message = {
                type:'navigate',
                value: url
            };

            _postMessage(message);
        }


        /**
         * Resize the iframe element
         * @param  {number|string} (optional) height Can be number or percentage
         */
        function resize(height) {
            // If no height is provided use page height
            if (typeof height === 'undefined') {
                _handleResize();
            } else {
                _sendHeight(height);
            }
        }


        /**
         * Send height.
         * @param  {number|string} height Can be number or percentage.
         */
        function _sendHeight(height) {
            var message = {
                type:'set-height',
                value: height
            };

            _postMessage(message);
        }

        /**
         * Get the current document height.
         * @return {int} Height integer
         */
        function _getHeight() {
            var htmlEl = document.querySelector('html');
            var htmlHeight = htmlEl.getBoundingClientRect().height;
            //var docScrollHeight = document.documentElement.scrollHeight;
            var bodyOffset =  document.body.offsetHeight;
            var maxHeight = Math.max(htmlHeight, bodyOffset);
            return parseInt(maxHeight, 10);
        }

        /**
         * Get the bottom most position of all elements on the page.
         * NOTE: Absolute positioned elements are removed from the page flow
         *       so are not included in the .innerHeight of the page.
         *       Therefore, the height is retrieved via looping through
         *       every element and finding the one with greatest bounding
         *       bottom value. There is a performance hit relative to the number
         *       of elements on the page.
         *
         * @return {int} Greatest value of an elements bounding bottom.
         */
        function _getAbsoluteHeight() {
            var allElements = document.querySelectorAll('body *');
            var maxBottomVal = 0;
            for (var i = 0; i < allElements.length; i++) {
                if (allElements[i].getBoundingClientRect().bottom > maxBottomVal) {
                    maxBottomVal = allElements[i].getBoundingClientRect().bottom;
                }
            }

            return maxBottomVal;
        }

        /**
         * Handle document size change, send containing iframe a postMessage.
         */
        function _handleResize() {
            var newHeight = (_options.absoluteHeight) ? _getAbsoluteHeight() : _getHeight();
            if (_currentHeight === newHeight) {
                return;
            }

            _sendHeight(newHeight);
            _currentHeight = newHeight;
        }


        /**
         * Interval resize loop.
         */
        function _setupInterval() {
            setInterval(_handleResize, REFRESH_DELAY);
        }


        /**
         * Listen for DOM modifications.
         */
        function _setupMutationObserver() {
            var target = document.querySelector('body');
            var observer = new MutationObserver(function(mutations) {
                _addImageLoadListeners();
                _handleResize();
             });

            var config = {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            };

            observer.observe(target, config);
        }


        /**
         * Start listening to resize events and trigger a resize.
         */
        function enableAutoResize(options) {
            if (options) {
                _options.absoluteHeight = options.absoluteHeight || _options.absoluteHeight;
            }

            window.addEventListener('resize', _handleResize);

            // Check for DOM changes
            if (MutationObserver) {
                _setupMutationObserver();
            } else {
                _setupInterval();
            }
        }



        /**
         * Handle postMessage response and trigger callback with data.
         * @param  {object} event Post message event object
         */
        function _handlePostMessage(event) {
            if (event.data) {
                var data;
                try {
                    data = JSON.parse(event.data);
                } catch(err) {
                    return console.error('Error parsing data. ' + err.toString());
                }

                // Check postmessage is exptected 
                if (data.hasOwnProperty('id') &&
                    _postMessageCallbacks.hasOwnProperty(data.id))
                {
                    // Run callback with data a clean up afterwards
                    _postMessageCallbacks[data.id](data);
                    delete _postMessageCallbacks[data.id];
                }
            }
        }


        /**
         * Get positional information from parent page.
         * @param  {Function} callback Callback to be trigger on response.
         */
        function getPositionInformation(callback) {
            _postMessage({
                type:'get-position'
            }, callback);
        }

        /**
         * Get parent window location information.
         * @param {Function} callback Callback to be trigger on response.
         */
        function getLocation(callback) {
            _postMessage({
                type: 'get-location'
            }, callback);
        }


        /**
         * Scroll the parent document to a specified position
         * @param  {int} _x X position.
         * @param  {int} _y Y position.
         */
        function scrollTo(_x, _y) {
            _postMessage({
                type:'scroll-to',
                x: _x,
                y: _y
            });
        }

        /**
         * Prep-page for messaging.
         */
        function _setupPage() {
            // IE9+ as IE8 does not support getComputedStyle
            if (!document.body || !getComputedStyle) {
                return;
            }

            document.documentElement.style.height = 'auto';
            document.body.style.height = 'auto';

            _addImageLoadListeners();

            // Fix Chrome's scrollbar
            document.querySelector('html').style.overflow = 'hidden';
        }

        /**
         * Handle image load by triggering a resize
         */
        function _imageLoaded() {
            // Remove image from loading stack
            var imageIndex = _images.indexOf(this);
            if (imageIndex !== -1) {
                _images.splice(imageIndex, 1);
            }

            // Calculate new height
            _handleResize();
        }

        /**
         * Add 'load' event listener and store reference to image
         * @param {elm} img Image being loaded
         */
        function _addImage(img) {
            if (_images.indexOf(img) === -1) {
                img.addEventListener('load', _imageLoaded);
                _images.push(img);
            }
        }


        /**
         * Filter out images in the DOM that haven't loaded yet and add listener
         */
        function _addImageLoadListeners() {
            for (var i = 0; i < document.images.length; i++) {
                var image = document.images[i];
                // Do nothing if image is already loaded
                if (image.nodeName === 'IMG' &&
                    image.src &&
                    image.complete === false &&
                    image.readyState !== 4)
                {
                    _addImage(image);
                }
            }
        }

         // Only setup the page if inside an iframe
        if (_inIframe()) {
            window.addEventListener('DOMContentLoaded', _setupPage, false);
            window.addEventListener('message', _handlePostMessage, false);
        }

        return {
            resize: resize,
            navigate: navigate,
            enableAutoResize: enableAutoResize,
            scrollTo: scrollTo,
            getLocation: getLocation,
            getAbsoluteHeight: _getAbsoluteHeight,
            getPositionInformation: getPositionInformation
        };
    }());

    // CommonJS module
    if ( typeof module !== 'undefined' && module.exports ) {
        module.exports = iframeMessenger;
    }

    // AMD module
    else if ( typeof define !== 'undefined' && define.amd ) {
        define( function () { return iframeMessenger; });
    }

    // browser global
    else {
        global.iframeMessenger = iframeMessenger;
    }
}((typeof window !== 'undefined') ? window : this ));
