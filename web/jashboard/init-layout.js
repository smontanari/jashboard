var logGeometry = function(event, ui) {
  console.log($(this).width());
  console.log($(this).height());
  console.log($(this).position());
};

var resizeMonitorDetails = function() {
  $(".monitor-panel").each(function() {
    var position = $(".monitor-details", this).position();
    var calculatedHeight = $(this).height() - position.top;
    $(".monitor-details", this).height(calculatedHeight);
  });
}

$(function() {
  $(".monitor-panel").draggable(
    { containment: "parent",
      handle: "span.drag-handle",
      scroll: true,
      stack: ".monitor-panel",
      stop: logGeometry
    }).resizable(
    { minHeight: 130,
      minWidth: 250,
      containment: "parent",
      stop: resizeMonitorDetails
  });
  resizeMonitorDetails();
});


