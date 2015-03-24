/* global iframeMessenger */

'use strict';

var contentEl = document.querySelector('#content');

function specificHeight(height) {
    iframeMessenger.resize(height);
}

function defaultResize(height) {
    contentEl.style.height = height + 'px';
    setTimeout(iframeMessenger.resize, 200);
}


function enableAutoResize(height) {
    contentEl.style.height = height + 'px';
    iframeMessenger.enableAutoResize();
}

function floatedElements(height) {
    contentEl.style.float = 'left';
    contentEl.style.height = height + 'px';
    iframeMessenger.enableAutoResize();
}

function setAbsolutePosition(height) {
    contentEl.style.position = 'absolute';
    contentEl.style.top = '0';
    contentEl.style.height = height + 'px';
    iframeMessenger.enableAutoResize({ absoluteHeight: true });
}

function transformedElements(height) {
    var newHeight = height - contentEl.getBoundingClientRect().height;
    var transformVal = 'translate(0, ' + newHeight  + 'px)';

    contentEl.style.webkitTransform = transformVal;
    contentEl.style.MozTransform = transformVal;
    contentEl.style.msTransform = transformVal;
    contentEl.style.OTransform = transformVal;
    contentEl.style.transform = transformVal;
    iframeMessenger.enableAutoResize({ absoluteHeight: true });
}



function transformedElementsWithMargin(height) {
    var marginBottom = 20;
    var newHeight = height - contentEl.getBoundingClientRect().height;
    newHeight -= marginBottom;
    var transformVal = 'translate(0, ' + newHeight  + 'px)';

    contentEl.style.webkitTransform = transformVal;
    contentEl.style.MozTransform = transformVal;
    contentEl.style.msTransform = transformVal;
    contentEl.style.OTransform = transformVal;
    contentEl.style.transform = transformVal;
    contentEl.style.marginBottom = marginBottom + 'px';
    iframeMessenger.enableAutoResize({ absoluteHeight: true });
}

function autoResizeWithImages() {
    var img = new Image();
    var url = 'large-image.jpg?cache=' + Date.now();
    img.setAttribute('src', url);
    img.setAttribute('id', 'test-image');
    contentEl.innerHTML = '';
    contentEl.appendChild(img);
    iframeMessenger.enableAutoResize({ enableUpdateInterval: false });
}

function getLocation() {
   iframeMessenger.getLocation(function(data) {
       window.parent.postMessage(JSON.stringify(data), '*');
   }); 
}

function scrollTo(pos) {
    iframeMessenger.scrollTo(pos.x, pos.y);
}

function navigate(location) {
    iframeMessenger.navigate(location);
}

function getPositionInformation() {
    iframeMessenger.getPositionInformation(function(data) {
        window.parent.postMessage(JSON.stringify(data), '*');
    });
}


function _handlePostMessage(event) {
    if (!event.data) {
        return;
    }

    var data;
    try {
        data = JSON.parse(event.data);
    } catch(err) {
        return console.error('Error parsing data. ' + err.toString());
    }
    
    // Test switcher
    switch (data.test) {
        case 'defaultResize':
            defaultResize(data.value);
            break;
        case 'specificHeight':
            specificHeight(data.value);
            break;
        case 'enableAutoResize':
            enableAutoResize(data.value);
            break;
        case 'absolutePosition':
            setAbsolutePosition(data.value);
            break;
        case 'floatedElements':
            floatedElements(data.value);
            break;
        case 'transformedElements':
            transformedElements(data.value);
            break;
        case 'transformedElementsWithMargin':
            transformedElementsWithMargin(data.value);
            break;
        case 'getLocation':
            getLocation();
            break;
        case 'scrollTo':
            scrollTo(data.value);
            break;
        case 'navigate':
            navigate(data.value);
            break;
        case 'getPositionInformation':
            getPositionInformation();
            break;
        case 'autoResizeWithImages':
            autoResizeWithImages();
            break;

    }
}

window.addEventListener('message', _handlePostMessage, false);

