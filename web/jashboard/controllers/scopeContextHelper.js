(function(module) {
  jashboard = _.extend(module, {
    scopeContextHelper: {
      setDefaultActiveDashboard: function() {
        if (!_.isEmpty(this.dashboards)) {
          this.context.activeDashboardId = _.first(this.dashboards).id;
        } else {
          this.context.activeDashboardId = undefined;
        }
      }
    }
  });
}(jashboard || {}));
