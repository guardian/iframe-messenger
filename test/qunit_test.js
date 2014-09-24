module('iframeMessanger', {
	teardown: function() {
		var iframe = document.querySelector("#qunit-fixture iframe");
		iframe.src = '';
	}
});

asyncTest("resize() with specific option", function() {
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);
		expect(2);
		equal(data.type, 'set-height', 'should send set-height type.');
		equal(data.value, '900', 'should send value of 900.');

		// Clear event listener
		this.removeEventListener('message', arguments.callee, false);

		start();
	});

	var iframe = document.querySelector("#qunit-fixture iframe");
	iframe.src = 'iframeContent/resizeDemo.html';
});

asyncTest("resize() with no option", function() {
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);
		expect(2);
		equal(data.type, 'set-height', 'should send set-height type.');
		equal(data.value, '444', 'should send value of 444.');

		// Clear event listener
		this.removeEventListener('message', arguments.callee, false);

		start();
	});

	var iframe = document.querySelector("#qunit-fixture iframe");
	iframe.src = 'iframeContent/resizeNoParamDemo.html';
});

asyncTest("enableAutoResize with no doctype", function() {
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);
		expect(2);
		equal(data.type, 'set-height', 'should send set-height type.');
		equal(data.value, '500', 'should send value of 500.');

		// Clear event listener
		this.removeEventListener('message', arguments.callee, false);

		start();
	});

	var iframe = document.querySelector("#qunit-fixture iframe");
	iframe.src = 'iframeContent/no-doctype.html';
});



asyncTest("enableAutoResize with absoluteHeight set", function() {
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);
		expect(2);
		equal(data.type, 'set-height', 'should send set-height type.');
		equal(data.value, '500', 'should have 500px height.');

		// Clear event listener
		this.removeEventListener('message', arguments.callee, false);

		start();
	});

	var iframe = document.querySelector("#qunit-fixture iframe");
	iframe.src = 'iframeContent/absolutePositionDemo.html';
});

asyncTest("enableAutoResize with css transforms set", function() {
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);
		expect(2);
		equal(data.type, 'set-height', 'should send set-height type.');
		equal(data.value, '600', 'should have 500px height.');

		// Clear event listener
		this.removeEventListener('message', arguments.callee, false);

		start();
	});

	var iframe = document.querySelector("#qunit-fixture iframe");
	iframe.src = 'iframeContent/cssTransform.html';
});



asyncTest("enableAutoResize with absoluteHeight set and no doctype", function() {
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);
		expect(2);
		equal(data.type, 'set-height', 'should send set-height type.');
		equal(data.value, '500', 'should send value of 500.');

		// Clear event listener
		this.removeEventListener('message', arguments.callee, false);

		start();
	});

	var iframe = document.querySelector("#qunit-fixture iframe");
	iframe.src = 'iframeContent/absolute-no-doctype.html';
});


asyncTest(".navigate()", function() {
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);
		expect(2);
		equal(data.type, 'navigate', 'should send the navigate type.');
		equal(data.value, 'http://www.example.com/', 'should send correct string value.');

		// Clear event listener
		this.removeEventListener('message', arguments.callee, false);

		start();
	});

	var iframe = document.querySelector("#qunit-fixture iframe");
	iframe.src = 'iframeContent/navigateDemo.html';
});


asyncTest("postMessage", function() {
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);

		if (event.source === iframe02.contentWindow) {
			expect(2);
			equal(data.type, 'set-height', 'should should restrict to iframe source.');
			equal(data.value, '800', 'should send correct value.');

			// Clear event listener
			this.removeEventListener('message', arguments.callee, false);
			start();
		}
	});

	var locationUrl = window.location.href.substr(0, window.location.href.lastIndexOf('/') + 1);
	var iframe01Src = locationUrl + 'iframeContent/multi-iframe-01.html';
	var iframe02Src = locationUrl + 'iframeContent/multi-iframe-02.html';

	var iframe01 = document.querySelector("#qunit-fixture #iframe01");
	iframe01.src = iframe01Src;

	var iframe02 = document.querySelector("#qunit-fixture #iframe02");
	iframe02.src = iframe02Src;
});



asyncTest(".scrollTo()", function() {
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);
		expect(3);
		equal(data.type, 'scroll-to', 'should send the scroll-to action.');
		equal(data.x, 0, 'should send x position value.');
		equal(data.y, 200, 'should send x position value.');

		// Clear event listener
		this.removeEventListener('message', arguments.callee, false);

		start();
	});

	var iframe = document.querySelector("#qunit-fixture iframe");
	iframe.src = 'iframeContent/scrollTo.html';
});


asyncTest(".getPositionInformation()", function() {
	expect(2);

	// Receive first request post message for positional information
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);
		equal(data.type, 'get-position', 'should send the get-position action.');

		this.removeEventListener('message', arguments.callee, false);

        // Send mock response to test the callback is called.
        var message = {
            'id': data.id,
            'iframeTop':    iframe.getBoundingClientRect().top,
            'innerHeight':  window.innerHeight,
            'pageYOffset':      window.pageYOffset
        };
		iframe.contentWindow.postMessage(JSON.stringify(message), '*');
	});

	// Listen for successful callback post message
	window.addEventListener('message', function(event) {
		if (event.data === 'success') {
			equal(event.data,  'success', 'callback should execute receipt of position formation');
			start();
		}
    });


	var iframe = document.querySelector("#qunit-fixture iframe");
	iframe.src = 'iframeContent/getPositionInformation.html';
});

