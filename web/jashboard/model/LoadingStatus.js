(function(module) {
  jashboard.model = _.extend(module, {
    loadingStatus: {
      waiting: "waiting",
      completed: "completed",
      error: "error"
    }
  });
}(jashboard.model || {}));
