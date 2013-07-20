module Jashboard
  module Plugin
    module MonitorTypeAdapter
      def get_runtime_info(configuration)
        type = configuration.type
        method = "get_#{type}_runtime_info".to_sym
        raise "Type '#{type}' not defined" unless (self.respond_to? method)
        self.send(method, configuration)
      end
    end
  end
end
