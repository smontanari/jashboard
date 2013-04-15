require 'spec_helper'
require 'plugins/build/build_plugin'

module Jashboard
  module Plugin
    describe BuildPlugin do
      it("should register as monitor plugin for type 'build'") do
        Plugin.instance_variable_get(:@adapters)['build'].should_not be_nil
      end

      it("should extend MonitorTypeAdapter") do
        subject.class.ancestors.should include(Jashboard::MonitorTypeAdapter)
      end
    end
  end
end
