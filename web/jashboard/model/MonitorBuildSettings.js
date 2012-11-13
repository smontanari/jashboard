jashboard.model.MonitorBuildSettings = function(settings) {
  this.hostname = settings.hostname;
  this.port = settings.port;
  switch(settings.type) {
    case 1:
      this.server = "Jenkins";
      this.build_id = settings.build_id;
      return this;
    case 2:
      this.server = "GO";
      this.pipeline = settings.pipeline;
      this.stage = settings.stage;
      this.job = settings.job;
      return this;
    default:
      throw "Invalid CI server type: " + settings.type;
  }
};

