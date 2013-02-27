describe("TooltipService", function() {
  var service;
  var $stub;

  beforeEach(function() {
    $stub = testHelper.stubJQuery(["target-selector", "content-selector"]);
    $stub.html = jasmine.createSpy("$.html()").andCallFake(function() {
      return "test-content";
    });
    $stub.tooltip = jasmine.createSpy("$.tooltip()");
    service = new jashboard.TooltipService();
  });

  it("should invoke $.tooltip()", function() {
    service.add("target-selector", "content-selector");

    expect($stub.tooltip).toHaveBeenCalledWith({
      html: true,
      title: "test-content",
      container: "body"
    });
  });
});
