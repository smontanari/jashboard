require 'plugins/monitor_plugin_dispatcher'
require 'plugins/monitor_type_adapter'

module Jashboard
  module Plugin
    @dispatcher = MonitorPluginDispatcher.new

    def monitor_type_adapters(*adapters)
      module_eval do
        include MonitorTypeAdapter
        adapters.each { |a| include a }
      end
    end

    def plugin_type(type)
      Plugin.instance_variable_get('@dispatcher').register_adapter(type, self)
    end

    def self.load_monitor_plugins(base_path)
      ["#{base_path}/**/adapters/*.rb", "#{base_path}/**/*_plugin.rb"].each do |p|
        Dir.glob(p) { |f| load f }
      end
      @dispatcher
    end
  end
end
