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
  $(".monitor-panel").draggable(
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
      resize: function(event, ui) {
        resizeMonitorDetails(".monitor-details", ui.element);
      }
  });
  $(".monitor-panel").each(function(index, element) {
    resizeMonitorDetails(".monitor-details", element);
  });
});


