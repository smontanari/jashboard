jashboard.functionalTests.push(function () {
  module("Global teardown",{
    teardown: function() {
      S.win.close();
    }
	});
  test("closing browser", function() {});
});
