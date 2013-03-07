require 'plugins/build/jenkins_plugin'
require 'plugins/build/go_plugin'

module Jashboard
  class MonitorConfigurationHelper
    @configuration_types = {
      'jenkins' => Plugin::CIServer::JenkinsServerConfiguration,
      'go' => Plugin::CIServer::GOServerConfiguration,
    }
    def self.create_build_monitor_configuration(data)
      type = data.delete :type
      @configuration_types[type].new(*data.values)
    end

    def self.method_missing(method, args)
      if (method.to_s.match(/create_\w+_monitor_configuration/))
        args
      end
    end
  end
end
