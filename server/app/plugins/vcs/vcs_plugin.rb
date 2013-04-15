require 'plugins/monitor_type_adapter'
require 'plugins/plugin'

module Jashboard
  module Plugin
    module VCS
      class VcsPlugin < MonitorTypeAdapter
        extend Plugin
        is_monitor_plugin_for_type 'vcs'
        class_eval(File.read(File.join(File.dirname(__FILE__), 'vcs_plugin_config.rb')))
      end
    end
  end
end

