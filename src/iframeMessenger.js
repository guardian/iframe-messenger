/**
 * iframe-messenger
 *
 * version: 0.2.3
 * source: https://github.com/GuardianInteractive/iframe-messenger
 *
 */

(function (global) {
    'use strict';

    var iframeMessenger = (function() {
        var pageURL = window.location.href;
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var REFRESH_DELAY = 200;
        var _postMessageCallback;
        var _currentHeight = 0;
        var _bodyMargin = 0;
        var _options = {
            absoluteHeight: false
        };

        function _postMessage(message) {
            window.parent.postMessage(JSON.stringify(message), '*');
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
                value: url,
                href: pageURL
            };

            _postMessage(message);
        }


        /**
         * Resize containing iframe.
         * @param  {number|string} height Can be number or percentage.
         */
        function resize(height) {
            var message = {
                type:'set-height',
                value: height,
                href: pageURL
            };

            _postMessage(message);
        }

        /**
         * Get the current document height.
         * @return {int} Height integer
         */
        function _getHeight() {
            return parseInt(document.body.offsetHeight, 10) + _bodyMargin;
        }

        /**
         * Get the bottom most position of all elements on the page.
         * NOTE: Absolute positioned elements are removed from the page flow
         *       so are not included in the .innerHeight of the page.
         *       Therefore, the height is retrieved via looping throught
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

            resize(newHeight);
            _currentHeight = newHeight;
        }


        /**
         * Interval resize loop.
         */
        function _setupInterval() {
            setInterval(_handleResize, REFRESH_DELAY);
        }


        /**
         * Listen for DOM modifcations.
         */
        function _setupMutationObserver() {
            var target = document.querySelector('body');
            var observer = new MutationObserver(function(mutations) {
                 mutations.forEach(function(mutation) {
                    _handleResize();
                  });
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

            _handleResize();
            window.addEventListener('resize', _handleResize);

            // Check for DOM changes
            if (MutationObserver)
                _setupMutationObserver();
            else {
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
                    console.error('Error parsing data. ' + err.toString());
                }
                _postMessageCallback(data);
            }
        }


        /**
         * Get postional information from parent page.
         * @param  {Function} callback Callback to be trigger on response.
         */
        function getPositionInformation(callback) {
            _postMessageCallback = callback;
            _postMessage({
                type:'get-position',
                href: pageURL
            });
        }


        /**
         * Scroll the parent document to a specified position
         * @param  {int} _x X position.
         * @param  {int} _y Y position.
         */
        function scrollTo(_x, _y) {
            _postMessage({
                type:'scroll-to',
                href: pageURL,
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

            var styles = getComputedStyle(document.body);
            _bodyMargin = parseInt(styles.marginTop, 10) + parseInt(styles.marginBottom, 10);
            document.documentElement.style.height = 'auto';
            document.body.style.height = 'auto';

            // Fix Chrome's scrollbar
            document.querySelector('html').style.overflow = 'hidden';
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
