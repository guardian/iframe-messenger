(function (global) {
    'use strict';

    var iframeMessenger = (function() {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var REFRESH_DELAY = 200;
        var _currentHeight = 0;
        var _bodyMargin = 0;

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


        /**
         * Handle document size change, send containing iframe a postMessage.
         */
        function _handleResize() {
            var newHeight = _getHeight();
            if (_currentHeight === newHeight) {
                return;
            }

            resize(newHeight);
            _currentHeight = newHeight;
        }


        /**
         * Get the current document height.
         * @return {int} Height integer
         */
        function _getHeight() {
            return parseInt(document.body.offsetHeight, 10) + _bodyMargin;
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
        function enableAutoResize() {
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
         * Prep-page for messaging.
         */
        function _setupPage() {
            // IE9+ as IE8 does not support getComputedStyle
            var styles = getComputedStyle(document.body);
            _bodyMargin = parseInt(styles.marginTop, 10) + parseInt(styles.marginBottom, 10);
            document.documentElement.style.height = 'auto';
            document.body.style.height = 'auto';
        }

        _setupPage();

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
}((typeof window !== 'undefined') ? window : this ));
