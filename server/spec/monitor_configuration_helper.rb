require 'plugins/build/jenkins_plugin'
require 'plugins/build/go_plugin'

module Jashboard
  class MonitorConfigurationHelper
    @configuration_types = {
      'jenkins' => Plugin::CIServer::JenkinsServerSettings,
      'go' => Plugin::CIServer::GOServerSettings,
    }
    def self.create_build_monitor_settings(data)
      type = data.delete :type
      @configuration_types[type].new(*data.values)
    end
  end
end
