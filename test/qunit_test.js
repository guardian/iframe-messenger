asyncTest("iframeMessanger .resize()", function() {
	window.
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);
		expect(2);
		equal(data['type'], 'set-height', 'should send set-height type.');
		equal(data['value'], '900', 'should send value of 900.');

		// Clear event listener
		this.removeEventListener('message', arguments.callee,false);

		start();
	});

	var iframe = document.querySelector("#qunit-fixture iframe");
	iframe.src = 'iframeContent/resizeDemo.html';
});


asyncTest("iframeMessanger enableAutoResize with absoluteHeight set", function() {
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);
		expect(2);
		equal(data['type'], 'set-height', 'should send set-height type.');
		equal(data['value'], '500', 'should have 500px height.');

		// Clear event listener
		this.removeEventListener('message', arguments.callee,false);

		start();
	});

	var iframe = document.querySelector("#qunit-fixture iframe");
	iframe.src = 'iframeContent/absolutePositionDemo.html';
});


asyncTest("iframeMessanger .navigate()", function() {
	window.
	window.addEventListener('message', function(event) {
		var data = JSON.parse(event.data);
		expect(2);
		equal(data['type'], 'navigate', 'should send the navigate type.');
		equal(data['value'], 'http://www.example.com/', 'should send correct string value.');

		// Clear event listener
		this.removeEventListener('message', arguments.callee,false);

		start();
	});

	var iframe = document.querySelector("#qunit-fixture iframe");
	iframe.src = 'iframeContent/navigateDemo.html';
});


