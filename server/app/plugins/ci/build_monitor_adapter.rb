require 'plugins/plugin_manager'

module Jashboard
  module Plugin
    class BuildMonitorAdapter
      extend PluginManager
      is_monitor_plugin_for_type 1

      @@ciserver_type_handlers = {}

      def self.register_ciserver_type_handler(type, clazz)
        @@ciserver_type_handlers[type] = clazz
      end

      def get_settings(input_settings)
        clazz =  @@ciserver_type_handlers[input_settings[:type]]
        clazz.new.create_settings(input_settings)
      end

      def get_runtime_info(monitor)
        clazz =  @@ciserver_type_handlers[monitor.settings.type]
        clazz.new.fetch_build_runtime_info(monitor.settings)
      end
    end
  end
end

