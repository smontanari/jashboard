require 'model/build_monitor'

module Jashboard
  class MonitorBuilder
    def self.as_build_monitor
      c = Class.new do
        extend BuilderHelper
        builder_for BuildMonitor
        attr_builder :id, :name, :refresh_interval, :ciserver_settings
      end
      c.new
    end
  end
end
