describe("SwitchButton", function() {
  var widget, $element, callback;
  beforeEach(function() {
    callback = jasmine.createSpy("callback");
    $element = testHelper.stubJQuery("test-selector");
    $element.on = jasmine.createSpy("$.on()");
    $element.bootstrapSwitch = jasmine.createSpy("$.bootstrapSwitch()");
  });

  it("should initialise the widget", function() {
    widget = new jashboard.widgets.SwitchButton("test-selector", callback);

    expect($element.bootstrapSwitch).toHaveBeenCalled();
    expect($element.on).toHaveBeenCalledWith('change', callback);
  });
  it("should not bind a 'change' callback", function() {
    widget = new jashboard.widgets.SwitchButton("test-selector", "test_state");

    expect($element.on).not.toHaveBeenCalled();
  });
  it("should turn on the switch", function() {
    widget = new jashboard.widgets.SwitchButton("test-selector", "test_state");
    widget.setOn();

    expect($element.bootstrapSwitch).toHaveBeenCalledWith('setState', true);
  });
  it("should turn off the switch", function() {
    widget = new jashboard.widgets.SwitchButton("test-selector", "test_state");
    widget.setOff();

    expect($element.bootstrapSwitch).toHaveBeenCalledWith('setState', false);
  });
});