require 'model/Dashboard'

module Jashboard
  class DashboardView
    def initialize(dashboard, monitors = nil)
      @dashboard = dashboard
      @monitors = monitors || []
    end

    def to_json(*args)
      {id: @dashboard.id, name: @dashboard.name, monitors: @monitors}.to_json(*args)
    end
  end
end

