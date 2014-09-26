define([], function () {
    return {
        boot: function (el, context, config, mediator) {
            // Extract href of the first link in the content, if any
            var iframe;
            var link = el.querySelector('a[href]');

            function _postMessage(message) {
                iframe.contentWindow.postMessage(JSON.stringify(message), '*');
            }

            if (link) {
                iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.border = 'none';
                iframe.height = '500'; // default height
                iframe.src = link.href;

                // Listen for requests from the window
                window.addEventListener('message', function(event) {
                    if (event.source !== iframe.contentWindow) {
                        return;
                    }

                    // IE 8 + 9 only support strings
                    var message = JSON.parse(event.data);

                    // Actions
                    switch (message.type) {
                        case 'set-height':
                            iframe.height = message.value;
                            break;
                        case 'navigate':
                            document.location.href = message.value;
                            break;
                        case 'scroll-to':
                            window.scrollTo(message.x, message.y);
                            break;
                        case 'get-location':
                            _postMessage({
                                'id':       message.id,
                                'type':     message.type,
                                'hash':     window.location.hash,
                                'host':     window.location.host,
                                'hostname': window.location.hostname,
                                'href':     window.location.href,
                                'pathname': window.location.pathname,
                                'protocol': window.location.protocol,
                                'port':     window.location.port,
                                'search':   window.location.search
                            }, message.id);
                            break;
                        case 'get-position':
                            _postMessage({
                                'id':           message.id,
                                'type':         message.type,
                                'iframeTop':    iframe.getBoundingClientRect().top,
                                'innerHeight':  window.innerHeight,
                                'innerWidth':   window.innerWidth,
                                'pageYOffset':  window.pageYOffset
                            });
                            break;
                        default:
                           console.error('Received unknown action from iframe: ', message);
                    }
                }, false);

                // Replace link with iframe
                // Note: link is assumed to be a direct child
                el.replaceChild(iframe, link);
            } else {
                console.warn('iframe-wrapper applied to element without any link');
            }
        }
    };
});

