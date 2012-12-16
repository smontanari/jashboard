require 'model/monitor'

module Jashboard
  class MonitorBuilder
    extend BuilderHelper
    builder_for Monitor
    attr_builder :id, :type, :name, :refresh_interval, :configuration, :runtime_info
  end
end
