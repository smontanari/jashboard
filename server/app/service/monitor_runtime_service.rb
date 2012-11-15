require 'service/adapters/ci/jenkins_adapter'
require 'service/adapters/ci/go_adapter'

module Jashboard
  class MonitorRuntimeService
    def get_monitor_runtime_info(monitor)
      adapter_class = get_adapter_class(monitor.ciserver_settings.class)
      adapter_class.new.fetch_build_info(monitor.ciserver_settings)
    end

    private

    def get_adapter_class(clazz)
      simple_class_name = clazz.name.split("::").last
      match = simple_class_name.match(/(\w+)ServerSettings/)
      raise "ServerSettings class name not valid: #{clazz.name}" if match.nil?
      eval "CIServer::#{match[1]}Adapter"
    end
  end
end
