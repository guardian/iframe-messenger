module('iframeMessanger', {
	teardown: function() {
		var iframe = document.querySelector("#qunit-fixture iframe");
		iframe.src = '';
	}
});

asyncTest("resize()", function() {
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);
		expect(2);
		equal(data['type'], 'set-height', 'should send set-height type.');
		equal(data['value'], '900', 'should send value of 900.');

		// Clear event listener
		this.removeEventListener('message', arguments.callee, false);

		start();
	});

	var iframe = document.querySelector("#qunit-fixture iframe");
	iframe.src = 'iframeContent/resizeDemo.html';
});



asyncTest("enableAutoResize with no doctype", function() {
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);
		expect(2);
		equal(data['type'], 'set-height', 'should send set-height type.');
		equal(data['value'], '500', 'should send value of 500.');

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
		equal(data['type'], 'set-height', 'should send set-height type.');
		equal(data['value'], '500', 'should have 500px height.');

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
		equal(data['type'], 'set-height', 'should send set-height type.');
		equal(data['value'], '600', 'should have 500px height.');

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
		equal(data['type'], 'set-height', 'should send set-height type.');
		equal(data['value'], '500', 'should send value of 500.');

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
		equal(data['type'], 'navigate', 'should send the navigate type.');
		equal(data['value'], 'http://www.example.com/', 'should send correct string value.');

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

		if (data.href === iframe02Src) {
			expect(2);
			equal(data['type'], 'set-height', 'should should restrict to iframe source.');
			equal(data['value'], '800', 'should send correct value.');

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
