module Jashboard
  module Plugin
    class MonitorAdapter
      @@type_handlers = {}

      def self.register_type_handler(type, handler_class)
        @@type_handlers[type] = handler_class
      end

      def get_settings(type, settings)
         @@type_handlers[type].new.get_settings(settings)
      end

      def get_runtime_info(monitor)
        @@type_handlers[monitor.type].new.get_runtime_info(monitor.settings)
      end
    end
  end
end