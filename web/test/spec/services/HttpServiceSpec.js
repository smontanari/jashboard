describe("HttpService", function() {
  var httpService;
  var $stub;

  beforeEach(function() {
    $stub = testHelper.stubJQuery();
    $stub.ajax = jasmine.createSpy("$.ajax()");
    httpService = new jashboard.HttpService();
  });

  it("should invoke jQuery.ajax to perform a JSON GET request", function() {
    var expectedParams = {testParam1: "value1", testParam2: "value2"};

    httpService.getJSON("/test/path/to/resource", expectedParams);

    expect($stub.ajax.mostRecentCall.args[0]).toEqual("/test/path/to/resource");
    expect($stub.ajax.mostRecentCall.args[1]).toEqual({
      type: 'GET',
      data: expectedParams,
      dataType: 'json'
    });
  });
  it("should invoke jQuery.ajax to perform a JSON POST request", function() {
    var data = {
      param1: "test.value",
      param2: 123
    };
    httpService.postJSON("/test/path/to/resource", data);

    expect($stub.ajax.mostRecentCall.args[0]).toEqual("/test/path/to/resource");
    expect($stub.ajax.mostRecentCall.args[1]).toEqual({
      type: 'POST',
      data: '{"param1":"test.value","param2":123}',
      processData: false,
      contentType: 'application/json',
      dataType: 'json'
    });
  });
  it("should invoke jQuery.ajax to perform a JSON PUT request", function() {
    var data = {
      param1: "test.value",
      param2: 123
    };
    httpService.putJSON("/test/path/to/resource", data);

    expect($stub.ajax.mostRecentCall.args[0]).toEqual("/test/path/to/resource");
    expect($stub.ajax.mostRecentCall.args[1]).toEqual({
      type: 'PUT',
      data: '{"param1":"test.value","param2":123}',
      processData: false,
      contentType: 'application/json',
      dataType: 'json'
    });
  });
});
