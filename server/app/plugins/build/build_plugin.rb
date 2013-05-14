require 'plugins/monitor_type_adapter'
require 'plugins/plugin'

module Jashboard
  module Plugin
    module Build
      Dir.glob(File.join(File.dirname(__FILE__), "/adapters/*.rb")) do |adapter_file|
        require adapter_file
      end
      class BuildPlugin < MonitorTypeAdapter
        extend Plugin
        is_monitor_plugin_for_type 'build'
        class_eval(File.read(File.join(File.dirname(__FILE__), 'build_plugin_config.rb')))
      end
    end
  end
end

