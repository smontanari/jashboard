describe("Tooltip", function() {
  var widget, targetElement, contentElement;
  beforeEach(function() {
    targetElement = jasmine.createSpyObj("$()", ['tooltip']);
    contentElement = {
      html: jasmine.createSpy("$.html()").and.returnValue("test_content")
    };
    $stub = testHelper.stubJQuery();
    $stub.withArgs("test-target-selector").returns(targetElement);
    $stub.withArgs("test-content-selector").returns(contentElement);

    widget = new jashboard.widgets.Tooltip('test-target-selector', 'test-content-selector');
  });

  it("should create the tooltip", function() {
    widget.show();
    expect(targetElement.tooltip).toHaveBeenCalledWith({
      html: true,
      title: "test_content",
      container: "body"
    });
  });
  it("should remove the tooltip", function() {
    widget.hide();

    expect(targetElement.tooltip).toHaveBeenCalledWith("destroy");
  });
});