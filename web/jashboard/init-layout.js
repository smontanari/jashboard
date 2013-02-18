var logGeometry = function(event, ui) {
  var element = event.target;
  console.log($(element).width());
  console.log($(element).height());
  console.log($(element).position());
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
      handle: ".drag-handle",
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


