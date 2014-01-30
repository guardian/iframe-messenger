(function (global) {
    'use strict';

    var iframeMessenger = (function() {
        function _postMessage(message) {
            window.parent.postMessage(JSON.stringify(message), '*');
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
         * Resize containing iframe.
         * @param  {number|string} height Can be number or percentage.
         */
        function resize(height) {
            var message = {
                type:'set-height',
                value: height
            };

            _postMessage(message);
        }

        var _currentHeight = 0;
        function _handleResize() {
            // clientHeight is off by ~20 pixels (margin top?)
            var newHeight = document.body.clientHeight + 20;
            if (_currentHeight === newHeight) {
                return;
            }

            resize(newHeight);
            _currentHeight = newHeight;
        }

        /**
         * Start listening to resize events and trigger a resize.
         */
        function enableAutoResize() {
            _handleResize();

            // Adding new elements or expanding element dimensions
            // does not trigger a resize event, so height changes
            // need to be checked for continually.
            setInterval(_handleResize, 200);
        }

        return {
            resize: resize,
            navigate: navigate,
            enableAutoResize: enableAutoResize
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
}( (typeof window !== 'undefined') ? window : this ));
