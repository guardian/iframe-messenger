define([], function () {
    return {
        boot: function (el, context, config, mediator) {
            // Extract href of the first link in the content, if any
            var link = el.querySelector('a[href]');
            if (link) {
                var iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.border = 'none';
                iframe.height = '500'; // default height
                iframe.src = link.href;

                // Listen for requests from the window
                window.addEventListener('message', function(event) {
                    if (event.origin !== 'http://interactive.guim.co.uk') {
                        return;
                    }

                    // IE 8 + 9 only support strings
                    var message = JSON.parse(event.data);

                    // Restrict message events to source iframe
                    if (!message.href || message.href !== link.href) {
                        return;
                    }

                    if (message.type === 'set-height') {
                        iframe.height = message.value;
                    } else if (message.type === 'navigate') {
                        document.location.href = message.value;
                    } else {
                        console.error('Received unknown message from iframe: ', message);
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
