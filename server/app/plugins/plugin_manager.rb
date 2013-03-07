require 'plugins/monitor_adapter'

module Jashboard
  module Plugin
    module PluginManager
      def PluginManager.load_plugins(path = File.dirname(__FILE__))
        Dir.glob("#{path}/**/*_plugin.rb") do |plugin_file|
          require plugin_file
        end
      end

      def is_monitor_plugin_for_type(type)
        MonitorAdapter.register_type_handler(type, self)
      end
    end
  end
end
