var logGeometry = function(event, ui) {
  var element = event.target;
  console.log($(element).width());
  console.log($(element).height());
  console.log($(element).position());
};

var resizeMonitorDetails = function(childrenSel, parentSel) {
  var parent = $(parentSel);
  $(childrenSel, parent).each(function(index, element) {
    var position = $(element).position();
    var calculatedHeight = $(parent).height() - position.top;
    $(element).height(calculatedHeight);
  });
}

$(function() {
  $(".monitor-panel").each(function() {
    var self = this;
    $(this).draggable(
      { 
        containment: "parent",
        handle: ".drag-handle",
        scroll: true,
        stack: ".monitor-panel",
        stop: logGeometry
      }).resizable(
      { 
        containment: "parent",
        autoHide: true,
        alsoResize: $(".monitor-details", this),
        start: function(event, ui) {
          $(".vcs-panel", this).cycle("destroy");
          $(".vcs-panel", this).attr("style", "");
          $(".vcs-info-group", this).attr("style", "");
        },
        stop: function(event, ui) {
          $(".vcs-panel", this).cycle({ 
            fx: 'scrollLeft',
            timeout:  5000
          });
        }
    });
  });
  $(".monitor-panel").each(function(index, element) {
    resizeMonitorDetails(".monitor-details", element);
  });
});


