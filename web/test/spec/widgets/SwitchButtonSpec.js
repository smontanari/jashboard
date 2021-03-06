describe("SwitchButton", function() {
  var widget, $element, callback;
  beforeEach(function() {
    callback = jasmine.createSpy("callback");
    $element = testHelper.stubJQuery("test-selector");
    $element.on = jasmine.createSpy("$.on()");
    $element.unbind = jasmine.createSpy("$.unbind()");
    $element.bootstrapSwitch = jasmine.createSpy("$.bootstrapSwitch()").and.callFake(function() {
      if ('state' === arguments[0]) return 'false';
    })
  });

  it("initialises the widget with an initial false state", function() {
    widget = new jashboard.widgets.SwitchButton("test-selector");

    expect($element.bootstrapSwitch.calls.count()).toEqual(2);
    expect($element.bootstrapSwitch.calls.argsFor(1)).toEqual(['setState', false]);
  });

  it("initialises the widget with an initial true state", function() {
    widget = new jashboard.widgets.SwitchButton("test-selector", true);

    expect($element.bootstrapSwitch.calls.count()).toEqual(2);
    expect($element.bootstrapSwitch.calls.argsFor(1)).toEqual(['setState', true]);
    expect(callback).not.toHaveBeenCalled();
  });

  it("destroys the widget when resetting", function() {
    widget = new jashboard.widgets.SwitchButton("test-selector", true);

    widget.reset(false);

    expect($element.bootstrapSwitch).toHaveBeenCalledWith('destroy');
  });

  it("unbinds the event from the element when resetting", function() {
    widget = new jashboard.widgets.SwitchButton("test-selector", true);

    widget.reset(false);

    expect($element.unbind).toHaveBeenCalledWith('switch-change');
  });

  it("binds a change callback", function() {
    widget = new jashboard.widgets.SwitchButton("test-selector", false, callback);

    expect($element.on).toHaveBeenCalledWith('switch-change', callback);
  });

  it("does not bind a 'change' callback", function() {
    widget = new jashboard.widgets.SwitchButton("test-selector");

    expect($element.on).not.toHaveBeenCalled();
  });
});