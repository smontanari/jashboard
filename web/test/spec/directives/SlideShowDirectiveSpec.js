describe("SlideShowDirective", function() {
  var linkFunction, scope, $stub, eventListener, event,
      itemsWatcherFn, itemsPerSlideWatcherFn, intervalWatcherFn, paginationService;

  beforeEach(function() {
    event = jasmine.createSpyObj("event", ['stopPropagation']);
    $stub = testHelper.stubJQuery("test-element");
    $stub.cycle = jasmine.createSpy("$.cycle()");
    scope = {
      $on: jasmine.createSpy("scope.$on()").andCallFake(function(event, listener) {
        eventListener = listener;
      }),
      $eval: sinon.stub(),
      $watch: jasmine.createSpy("scope.$watch").andCallFake(function(expr, callback) {
        if (expr === "test_expr_items") itemsWatcherFn = callback;
        if (expr === "test_expr_items_per_slide") itemsPerSlideWatcherFn = callback;
        if (expr === "test_expr_interval") intervalWatcherFn = callback;
      })
    };

    scope.$eval.withArgs("test_expr").returns({start: 'test_event'});
    scope.$eval.withArgs("test_expr_items").returns("items");
    scope.$eval.withArgs("test_expr_items_per_slide").returns("page_size");
    scope.$eval.withArgs("test_expr_interval").returns("page_interval");

    paginationService = {
      paginate: sinon.stub()
    };
    paginationService.paginate.withArgs("items", "page_size").returns("test_slides");

    linkFunction = jashboard.angular.slideShowDirective(paginationService);
  });
  
  it("should define the slides in the scope", function() {
    linkFunction(scope, "test-element", {
      jbSlideShow: "test_expr",
      jbSlideShowItems: "test_expr_items",
      jbSlideShowItemsPerSlide: "test_expr_items_per_slide",
      jbSlideShowInterval: "test_expr_interval"
    });

    expect(scope.slides).toEqual("test_slides");
  });
  it("should not define the slides in the scope if the items are undefined", function() {
    linkFunction(scope, "test-element", {
      jbSlideShow: "test_expr",
      jbSlideShowItems: "undefined_items",
      jbSlideShowItemsPerSlide: "test_expr_items_per_slide",
      jbSlideShowInterval: "test_expr_interval"
    });

    expect(scope.slides).toBeUndefined();
    expect(paginationService.paginate).not.sinonStubToHaveBeenCalled();
  });

  describe("start event", function() {
    beforeEach(function() {
      linkFunction(scope, "test-element", {
        jbSlideShow: "test_expr",
        jbSlideShowItems: "test_expr_items",
        jbSlideShowItemsPerSlide: "test_expr_items_per_slide",
        jbSlideShowInterval: "test_expr_interval"
      });
    });  
    it("should listen to the start event", function() {
      expect(scope.$on).toHaveBeenCalledWith("test_event", jasmine.any(Function));
    });
    it("should defer the start of the slide show when receiving the start event", function() {
      testHelper.asyncTestRun([
        {
          before: function() { eventListener(event); },
          waitFor: function() { return $stub.cycle.calls.length === 1; },
          after: function() {
            expect($stub.cycle).toHaveBeenCalledWith({timeout: "page_interval"});
            expect(event.stopPropagation).toHaveBeenCalled();
          }
        }
      ]);
    });
  });

  describe("items watcher functionality", function() {
    beforeEach(function() {
      linkFunction(scope, "test-element", {
        jbSlideShow: "test_expr",
        jbSlideShowItems: "test_expr_items",
        jbSlideShowItemsPerSlide: "test_expr_items_per_slide"
      });

      paginationService.paginate.withArgs("new_items", "page_size").returns("test_new_slides");
    });
    it("should watch the expression representing the items", function() {
      expect(scope.$watch).toHaveBeenCalledWith("test_expr_items", jasmine.any(Function));
    });
    it("should not change the slides in the scope if the items are undefined", function() {
      itemsWatcherFn(undefined);

      expect(scope.slides).toEqual("test_slides");
    });
    it("should change the slides in the scope if the items are defined", function() {
      itemsWatcherFn("new_items");

      expect(scope.slides).toEqual("test_new_slides");
    });
    it("should stop the slideshow if already started before changing the slides", function() {
      testHelper.asyncTestRun([
        {
          before: function() { eventListener(event); },
          waitFor: function() { return $stub.cycle.calls.length === 1; },
          after: function() {
            itemsWatcherFn("new_items");
            expect($stub.cycle).toHaveBeenCalledWith("destroy");
          }
        }
      ]);
    });
  });

  describe("itemsPerSlide watcher functionality", function() {
    beforeEach(function() {
      linkFunction(scope, "test-element", {
        jbSlideShow: "test_expr",
        jbSlideShowItems: "test_expr_items",
        jbSlideShowItemsPerSlide: "test_expr_items_per_slide"
      });
      paginationService.paginate.withArgs("items", "new_page_size").returns("test_new_slides");
    });
    it("should watch the expression representing the items per slide", function() {
      expect(scope.$watch).toHaveBeenCalledWith("test_expr_items_per_slide", jasmine.any(Function));
    });
    it("should not change the slides in the scope if the itemsPerSlides number is not defined", function() {
      itemsPerSlideWatcherFn(undefined);

      expect(scope.slides).toEqual("test_slides");
    });
    it("should stop the slideshow and change the slides in the scope if the itemsPerSlides number is defined", function() {
      testHelper.asyncTestRun([
        {
          before: function() { eventListener(event); },
          waitFor: function() { return $stub.cycle.calls.length === 1; },
          after: function() {
            itemsPerSlideWatcherFn("new_page_size");
            expect($stub.cycle).toHaveBeenCalledWith("destroy");
            expect(scope.slides).toEqual("test_new_slides");
          }
        }
      ]);
      itemsPerSlideWatcherFn("new_page_size");

      expect(scope.slides).toEqual("test_new_slides");
    });
  });

  describe("interval watcher functionality", function() {
    beforeEach(function() {
      linkFunction(scope, "test-element", {
        jbSlideShow: "test_expr",
        jbSlideShowItems: "test_expr_items",
        jbSlideShowItemsPerSlide: "test_expr_items_per_slide",
        jbSlideShowInterval: "test_expr_interval"
      });
    });
    it("should watch the expression representing the items per slide", function() {
      expect(scope.$watch).toHaveBeenCalledWith("test_expr_interval", jasmine.any(Function));
    });
    it("should not restart the slideshow if the interval number is not defined", function() {
      intervalWatcherFn(undefined);

      expect($stub.cycle).not.toHaveBeenCalled();
    });
    it("should restart the slideshow if the interval number is defined", function() {
      var runs = [
        {
          before: function() { eventListener(event); },
          waitFor: function() { return $stub.cycle.calls.length === 1; },
          after: function() {}
        },
        {
          before: function() {
            scope.$eval.withArgs("test_expr_interval").returns("new_page_interval");
            intervalWatcherFn("new_page_interval");
          },
          waitFor: function() { return $stub.cycle.calls.length === 3; },
          after: function() {
            expect($stub.cycle).toHaveBeenCalledWith("destroy");
            expect($stub.cycle).toHaveBeenCalledWith({timeout: "new_page_interval"});
          }
        }
      ];
      testHelper.asyncTestRun(runs);
    });
  });
});
