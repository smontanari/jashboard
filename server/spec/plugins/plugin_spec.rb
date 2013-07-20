require 'spec_helper'
require 'plugins/plugin'

module Jashboard
  module Plugin
    describe Plugin do
      it("should register the plugins") do
        dispatcher = Plugin.load_monitor_plugins("spec/resources/test_plugins")
  
        ["type1", "type2"].each do |type|
          dispatcher.instance_variable_get('@plugins')[type].should be_a Jashboard::Plugin.const_get "#{type.capitalize}MonitorPlugin".to_sym
        end
      end
    end
  end
end
