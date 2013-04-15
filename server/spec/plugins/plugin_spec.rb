require 'spec_helper'
require 'plugins/plugin'

module Jashboard
  module Plugin
    describe Plugin do
      it("should register the plugins") do
        monitor_adapters = Plugin.load_plugins("spec/resources/test_plugins")

        ["type1", "type2"].each do |type|
          expected_classname = "Jashboard::Plugin::#{type.capitalize}MonitorPlugin"
          monitor_adapters[type].class.name.should == expected_classname
        end
      end
    end
  end
end
