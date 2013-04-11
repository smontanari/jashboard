require 'plugins/monitor_adapter'

module Jashboard
  module Plugin
    module PluginManager
      @@adapters = {}
      def self.load_plugins(path = File.dirname(__FILE__))
        Dir.glob("#{path}/**/*_plugin.rb") do |plugin_file|
          require plugin_file
        end
      end
      
      def self.adapter_for_type(type)
        @@adapters[type].new
      end

      def is_monitor_adapter_for_type(type)
        @@adapters[type] = self
      end

      def is_monitor_plugin_for_type(type)
        MonitorAdapter.register_type_handler(type, self)
      end
    end
  end
end
