module Jashboard
  module Plugin
    class MonitorAdapter
      @@type_handlers = {}

      def self.register_type_handler(type, handler_class)
        @@type_handlers[type] = handler_class
      end

      def get_configuration(type, configuration)
         @@type_handlers[type].new.get_configuration(configuration)
      end

      def get_runtime_info(monitor)
        @@type_handlers[monitor.type].new.get_runtime_info(monitor.configuration)
      end
    end
  end
end