require 'model/build_monitor'

module Jashboard
  class BuildMonitorView
    attr_reader :monitor, :runtime_info

    def initialize(monitor, build_runtime_info)
      @monitor = monitor
      @runtime_info = build_runtime_info
    end

    def to_json(*args)
      {
        id: @monitor.id,
        name: @monitor.name,
        type: @monitor.type,
        refresh_interval: @monitor.refresh_interval,
        ciserver_settings: @monitor.ciserver_settings,
        runtime_info: @runtime_info
      }.to_json(*args)
    end
  end
end
