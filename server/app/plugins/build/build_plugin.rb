require 'plugins/monitor_type_adapter'
require 'plugins/plugin'

module Jashboard
  module Plugin
    class BuildPlugin < MonitorTypeAdapter
      extend Plugin
      is_monitor_adapter_for_type 'build'
      class_eval(File.read(File.join(File.dirname(__FILE__), 'build_plugin_config.rb')))
    end
  end
end

