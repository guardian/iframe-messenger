iframeMessenger
===============
postMessage interface allowing for the resizing of containing iframe
and link navigation of the parent window.


## Latest CDN version

http://interactive.guim.co.uk/libs/iframe-messenger/iframeMessenger.js

Usage
=====

Include the library within your page or application via `<script>` or `require()`. Call a method. You'll probably want to call enableAutoResize().

Auto-resize example:
```html
<script src="libs/iframeMessenger.js"></script>
<script>
    iframeMessenger.enableAutoResize();
</script>
```

Send all links to parent window example:
```html
<script src="libs/iframeMessenger.js"></script>
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

### `.enableAutoResize(options)`
Update iframe wrapper to match document height. Optional options (object) can be provided.
```JavaScript
{
    absoluteHeight: false // Check absolute height of every element
}
```

### `.resize(height)`
Specify a height (int) for the iframe wrapper

### `.navigate(url)`
Navigate parent window to specified URL (string)

## Similar projects
 - **easyXDM**: De facto standard https://github.com/oyvindkinsey/easyXDM
 - **jquery-iframe-auto-height**: Good cross-browser support https://github.com/house9/jquery-iframe-auto-height
 - **iframe-resizer**: DOM modification event idea came from here https://github.com/davidjbradshaw/iframe-resizer



## Changelog
0.2.1:
- Added `absoluteHeight` option to auto-resize to handle absolute absolute positioned elements

0.2.0:
- Added DOM modification detection with setInterval fallback
- Replaced hard-coded margin with getComputedStyle() values

0.1.0:
- Inital release.
