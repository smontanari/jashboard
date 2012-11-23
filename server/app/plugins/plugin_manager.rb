require 'plugins/monitor_adapter'

module Jashboard
  module Plugin
    module PluginManager
      def is_monitor_plugin_for_type(type)
        MonitorAdapter.register_type_handler(type, self)
      end
    end
  end
end
