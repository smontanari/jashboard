module Jashboard
  class MonitorTypeAdapter
    def get_runtime_info(configuration)
      monitor_type = configuration.type
      method = "get_#{monitor_type}_runtime_info".to_sym
      raise "Type '#{monitor_type}' not defined" unless (self.respond_to? method)
      self.send(method, configuration)
    end
  end
end
