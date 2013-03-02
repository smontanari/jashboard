describe("TooltipService", function() {
  var service;
  var $stub;

  beforeEach(function() {
    $stub = testHelper.stubJQuery(["target-selector"]);
    $stub.tooltip = jasmine.createSpy("$.tooltip()");
    service = new jashboard.TooltipService();
  });

  it("should create a simple text $.tooltip()", function() {
    service.attachTextTooltip("target-selector", "content");

    expect($stub.tooltip).toHaveBeenCalledWith({
      title: "content",
      container: "body"
    });
  });
  it("should remove the tooltip", function() {
    service.removeTooltip("target-selector");

    expect($stub.tooltip).toHaveBeenCalledWith('destroy');
  });
});
