require 'plugins/build/build_plugin'
require 'plugins/build/build_plugin_config'

module Jashboard
  module Plugin
    describe BuildPlugin do
      it("should implement the configured adapters") do
        plugin = BuildPlugin.new
        ['jenkins', 'go'].each do |type|
          plugin.should respond_to("get_#{type}_runtime_info".to_sym)
        end
      end
    end
  end
end