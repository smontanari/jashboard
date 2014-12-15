describe("HttpService", function() {
  var httpService, $stub, logger, mockRequest;

  beforeEach(function() {
    logger = jasmine.createSpyObj("$log", ['error']);
    mockRequest = {
      fail: function(callback) {
        callback("request", "status", "error");
        return this;
      }
    };
    $stub = testHelper.stubJQuery();
    $stub.ajax = jasmine.createSpy("$.ajax()").and.returnValue(mockRequest);
    httpService = new jashboard.HttpService(logger);
  });

  it("should invoke jQuery.ajax to perform a JSON GET request", function() {
    var expectedParams = {testParam1: "value1", testParam2: "value2"};

    var request = httpService.getJSON("/test/path/to/resource", expectedParams);

    expect(request).toEqual(mockRequest);
    expect($stub.ajax.calls.mostRecent().args).toEqual([
      "/test/path/to/resource",
      {
        type: 'GET',
        data: expectedParams,
        dataType: 'json'
      }
    ]);
  });
  it("should log an error when the JSON GET request fails", function() {
    var request = httpService.getJSON("/test/path/to/resource");
    expect(logger.error).toHaveBeenCalledWith("Failed ajax request: status - error");
  });
  it("should invoke jQuery.ajax to perform a JSON POST request", function() {
    var data = {
      param1: "test.value",
      param2: 123
    };
    var request = httpService.postJSON("/test/path/to/resource", data);

    expect(request).toEqual(mockRequest);
    expect($stub.ajax.calls.mostRecent().args).toEqual([
      "/test/path/to/resource",
      {
        type: 'POST',
        data: '{"param1":"test.value","param2":123}',
        processData: false,
        contentType: 'application/json',
        dataType: 'json'
      }
    ]);
  });
  it("should invoke jQuery.ajax to perform a JSON PUT request", function() {
    var data = {
      param1: "test.value",
      param2: 123
    };
    var request = httpService.putJSON("/test/path/to/resource", data);

    expect(request).toEqual(mockRequest);
    expect($stub.ajax.calls.mostRecent().args).toEqual([
      "/test/path/to/resource",
      {
        type: 'PUT',
        data: '{"param1":"test.value","param2":123}',
        processData: false,
        contentType: 'application/json',
        dataType: 'json'
      }
    ]);
  });
  it("should invoke jQuery.ajax to perform a DELETE request", function() {
    var request = httpService.deleteResource("/test/path/to/resource");

    expect(request).toEqual(mockRequest);
    expect($stub.ajax.calls.mostRecent().args).toEqual([
      "/test/path/to/resource",
      { type: 'DELETE' }
    ]);
  });
});
