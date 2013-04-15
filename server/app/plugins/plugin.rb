module Jashboard
  module Plugin
    @adapters = {}
    def is_monitor_adapter_for_type(type)
      Plugin.register_adapter(type, self)
    end

    def self.load_plugins(base_path)
      @adapters = {}
      Dir.glob("#{base_path}/**/*_plugin.rb") do |plugin_file|
        load plugin_file
      end
      @adapters
    end
    
    def self.register_adapter(type, clazz)
      @adapters[type] = clazz.new
    end
  end
end
