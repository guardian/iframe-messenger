iframeMessenger
===============
postMessage interface allowing for the resizing of containing iframe
and link navigation of the parent window.


## Latest CDN version

https://interactive.guim.co.uk/libs/iframe-messenger/iframeMessenger.js

Usage
=====

Include the library within your page or application via `<script>` or `require()`. Call a method. You'll probably want to call enableAutoResize().

Auto-resize example:
```html
<script src="https://interactive.guim.co.uk/libs/iframe-messenger/iframeMessenger.js"></script>
<script>
    iframeMessenger.enableAutoResize();
</script>
```

Getting parent's URL hash fragment example:
```html
<script src="https://interactive.guim.co.uk/libs/iframe-messenger/iframeMessenger.js"></script>
<script>
    function logParentHashFragment(locationObj) {
        console.log(locationObj.hash);
    }

    iframeMessenger.getLocation(logParentHashFragment);
</script>
```

Send all links to parent window example:
```html
<script src="https://interactive.guim.co.uk/libs/iframe-messenger/iframeMessenger.js"></script>
<script>
    var links = document.querySelectorAll('a');
    for(var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function(event) {
            event.preventDefault();
            iframeMessenger.navigate(this.href);
        }, false);
    }
</script>
```

## Methods

#### .enableAutoResize(options)
Update iframe wrapper to match document height. Optional options (object) can be provided.

**NOTE**: `absoluteHeight` checks the position of every element on the page, this has a significant
performance impact.

```JavaScript
{
    absoluteHeight: false // Check absolute height of every element, slow!
}
```

#### .resize(height)
(optional) `height` : INT or percentage eg '20%'
Specify a height for the iframe wrapper. If no height is specified the height
of the current document is sent.


#### .getLocation(callback)
Ask parent page for location information and executes callback passing
along an object containing parent's `document.location` information.

Sample of returned location object:
```JavaScript
{
    hash: "#myhash",
    host: "example.com:8080",
    hostname: "exaple.com",
    href: "http://example.com:8080/test.html?query=test#myhash",
    origin: "http://example.com:8080",
    pathname: "/test.html",
    port: "8080",
    protocol: "http:"
    search: "?query=test",
    type: "get-location"            // for iframeMessenger usage
    id: "iframeMessenger:ceprg"     // for iframeMessenger usage
}
```

#### .navigate(url)
Navigate parent window to specified URL (string)

#### .scrollTo(x, y)
Sends request to scroll the parent page to a specified x, y position.

#### .getPositionInformation(callback)
Ask parent page for position information and execute callback upon return post
message.

Sample of returned position data object:
```Javascript
{
    'iframeTop':    300,    // iframe.getBoundingClientRect().top,
    'innerHeight':  620,    // window.innerHeight,
    'innerWidth':   960,    // window.innerWidth,
    'pageYOffset':  90      // window.pageYOffset
}
```

## Similar projects
 - **easyXDM**: De facto standard https://github.com/oyvindkinsey/easyXDM
 - **jquery-iframe-auto-height**: Good cross-browser support https://github.com/house9/jquery-iframe-auto-height
 - **iframe-resizer**: DOM modification event idea came from here https://github.com/davidjbradshaw/iframe-resizer



## Changelog
0.2.7
- Added support for AdobeEdge content
- New method for wrapping content using ::before and ::after CSS
- More consistent height calculations across browsers
- Listen for window 'load' before auto resizing
- Lots more tests

0.2.6
- Added .getLocation(callback) for retrieving parent location information
- Added postMessage id to identify returning messages
- Updated height calculation using max of several different readings
- Fixed tests

0.2.5
- Listen for image load events and trigger resize
- More sensible way for calculating height
- Removed sending of 'href' for validation

0.2.4
- Remove trailing slash from location.href to prevent validation errors
- Check received postMessage validity to prevent unsolicited responses

0.2.3
- Added .getPositionInformation(callback) and .scrollTo(x, y)
- More tests

0.2.2
- Send iframe location.href to identify it to parent listener
- Added unit tests

0.2.1:
- Added `absoluteHeight` option to auto-resize to handle absolute absolute positioned elements

0.2.0:
- Added DOM modification detection with setInterval fallback
- Replaced hard-coded margin with getComputedStyle() values

0.1.0:
- Initial release.


## Notes
[HTML Document height via JavaScript research](https://docs.google.com/spreadsheets/d/1dv4bO6F9A0KGF6FdLsIJrKnidnrVsM8i3uI-OfCYjWQ/edit?usp=sharing)
