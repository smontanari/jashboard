describe("Tooltip", function() {
  var widget, targetElement, contentElement;
  beforeEach(function() {
    targetElement = jasmine.createSpyObj("$()", ['tooltip']);
    contentElement = {
      html: jasmine.createSpy("$.html()").andReturn("test_content")
    };
    $stub = testHelper.stubJQuery();
    $stub.withArgs("test-target-selector").returns(targetElement);
    $stub.withArgs("test-content-selector").returns(contentElement);

    widget = new jashboard.widgets.Tooltip('test-target-selector', 'test-content-selector', 'test_class');
  });

  it("should create the tooltip", function() {
    widget.show();
    expect(targetElement.tooltip).toHaveBeenCalledWith({
      content: "test_content",
      tooltipClass: 'test_class'
    });
  });
  it("should remove the tooltip", function() {
    widget.hide();

    expect(targetElement.tooltip).toHaveBeenCalledWith("destroy");
  });
});