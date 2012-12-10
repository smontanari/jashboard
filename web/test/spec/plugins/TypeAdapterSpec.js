describe("TypeAdapter", function() {
  var typeAdapter;
  beforeEach(function() {
    typeAdapter = new jashboard.plugin.TypeAdapter();
  });
  it("should register a new type handler", function() {
    var testHandler = function(data){ return {test: data.test};}
    typeAdapter.registerTypeHandler(123, testHandler);
    expect(typeAdapter.toObject({type: 123, test: "test.data"})).toEqual({test: "test.data"});
  });
  it("should return all registered types", function() {
    var testHandler = function(data){}
    typeAdapter.registerTypeHandler("type1", testHandler);
    typeAdapter.registerTypeHandler("type2", testHandler);

    expect(typeAdapter.getAllRegisteredTypes()).toEqual(['type1', 'type2']);
  });
  it("should throw an error if a handler already exists for the same type", function() {
    typeAdapter.registerTypeHandler(456, function(){});
    var errorThrowing = function() {
      typeAdapter.registerTypeHandler(456, function(){});
    };

    expect(errorThrowing).toThrow();
  });
  it("should throw an error if an adapter does not exist for the given type", function() {
    var errorThrowing = function() {
      typeAdapter.toObject(456);
    };

    expect(errorThrowing).toThrow();
  });
});
