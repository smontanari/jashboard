describe("TooltipService", function() {
  var $stub, service, elementBinding;

  beforeEach(function() {
    elementBinding = jasmine.createSpyObj("elementBinding", ['bindElementAs', 'applyToElement']);
    spyOn(jashboard, "ElementBinding").andReturn(elementBinding);
    service = new jashboard.TooltipService();
    $stub = testHelper.stubJQuery("target-selector");
    $stub.tooltip = jasmine.createSpy("$.tooltip()");
  });

  it("shoul bind an element with a given key", function() {
    service.bindAs("test_selector", "test_key");
    
    expect(elementBinding.bindElementAs).toHaveBeenCalledWith("test_selector", "test_key");    
  });

  describe("attachHtmlTooltip()", function() {
    it("should create a simple text tooltip", function() {
      var contentElement = {
        html: jasmine.createSpy().andReturn("test-content")
      }
      $stub.withArgs("content_selector").returns(contentElement);
      elementBinding.applyToElement = jasmine.createSpy().andCallFake(function(callback) {
        callback("target-selector", {});
      });
  
      service.attachHtmlTooltip("element_key", "content_selector");

      expect(elementBinding.applyToElement).toHaveBeenCalledWith(jasmine.any(Function), "element_key");
      expect($stub.tooltip).toHaveBeenCalledWith({
        html: true,
        title: "test-content",
        container: "body"
      });
    });
  });

  describe("removeTooltip()", function() {
    it("should remove the tooltip", function() {
      elementBinding.applyToElement = jasmine.createSpy().andCallFake(function(callback) {
        callback("target-selector", {});
      });
      service.removeTooltip("element_key");
      expect(elementBinding.applyToElement).toHaveBeenCalledWith(jasmine.any(Function), "element_key");

      expect($stub.tooltip).toHaveBeenCalledWith('destroy');
    });
  });
});
