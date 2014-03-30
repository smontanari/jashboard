jashboard.functionalTests.push(function () {
  module("Global teardown",{
    teardown: function() {
      F.win.close();
    }
	});
  test("closing browser", function() {expect(0);});
});
